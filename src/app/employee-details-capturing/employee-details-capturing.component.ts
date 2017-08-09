import { Component, OnInit, ElementRef } from '@angular/core';
import { EmployeeMasterService } from "../services/ProviderAdminServices/employee-master-service.service";
import { dataService } from '../services/dataService/data.service';


declare var jQuery:any;

@Component({
	selector: 'app-employee-details-capturing',
	templateUrl: './employee-details-capturing.component.html',
	styleUrls: ['./employee-details-capturing.component.css']
})


export class EmployeeDetailsCapturingComponent implements OnInit {

index: any;
serviceProviderID:any;
	countryID: any;

/*demographics*/
title:any;
firstname:any;
middlename: any;
lastname:any;
gender:any;
dob:any;
mobileNumber:any;
emailID:any;
employeeID:any;

allTitles:any=[];
allGenders:any=[];


/*qualification*/
qualificationType:any;
qualification:any;
passingYear:any;
duration:any;

allQualificationTypes:any=[];
allQualifications:any=[];

/*language*/
languages:any;
preferredLanguage:any;
allLanguages: any=[];


/*address*/
permanentAddressLine1:any;
permanentAddressLine2:any;
permanentState:any;
permanentDistrict: any;
permanentPincode:any;

currentAddressLine1:any;
currentAddressLine2:any;
currentState:any;
currentDistrict:any;
currentPincode:any;

allStates: any = [];
districts: any = [];

/*work place*/
officeState:any;
oficeDistrict:any;
agent_officeName:any;
agent_serviceline:any;
agent_role:any;

	serviceproviderAllStates: any = [];
	serviceproviderDistricts: any = [];
	serviceproviderAllOfficesInState: any = [];
	serviceproviderAllServicesInOffice: any = [];

/*unique IDs*/
ID_Type:any;
ID_Value:any;

	allIDTypes: any = [];

/*credentials*/
username: any;
password: any;

// arrays

	
	govtIDs:any=[];


	constructor(public EmployeeMasterService: EmployeeMasterService, public commonDataService: dataService) {
	this.languages= [];
	this.index = 0;

	this.serviceProviderID = this.commonDataService.service_providerID;
	this.countryID = 1;

	}

	ngOnInit() {
		jQuery("#UD0").css("font-size", "130%");

		this.EmployeeMasterService.getCommonRegistrationData().subscribe((response:Response)=>this.commonRegistrationDataSuccessHandeler(response));
		this.EmployeeMasterService.getStatesOfServiceProvider(this.serviceProviderID).subscribe((response: Response) => this.getStatesOfServiceProviderSuccessHandeler(response));
	}

	commonRegistrationDataSuccessHandeler(response)
	{
		console.log(response,"emp master component common reg data");
		this.allTitles = response.m_Title;
		this.allGenders = response.m_genders;

		this.allQualificationTypes = response.i_BeneficiaryEducation;
		this.allLanguages = response.m_language;
		this.allStates = response.states;
		this.allIDTypes = response.govtIdentityTypes;

	}

	createEmployeeSuccessHandeler(response)
	{
		console.log(response, "employee created successfully");
	}

	getDistrictsSuccessHandeler(response)
	{
		console.log(response, "districts retrieved");
		this.districts = response;
	}

	getOfficeDistrictsSuccessHandeler(response)
	{
		console.log(response,"office districts");
		this.serviceproviderDistricts = response;
	}

	getStatesOfServiceProviderSuccessHandeler(response)
	{
		this.serviceproviderAllStates = response;
	}

	

	addressCheck(value)
	{
		if(value.checked)
		{
			console.log(this.permanentAddressLine1, this.permanentAddressLine2, this.permanentState, this.permanentDistrict, this.permanentPincode);
			this.currentAddressLine1 = this.permanentAddressLine1;
			this.currentAddressLine2 = this.permanentAddressLine2;
			this.currentState = this.permanentState;
			this.currentDistrict = this.permanentDistrict;
			this.currentPincode = this.permanentPincode;
		}
		else
		{
			this.currentAddressLine1 = "";
			this.currentAddressLine2 = "";
			this.currentState = "";
			this.currentDistrict = "";
			this.currentPincode = "";
		}
	}

	MOVE2NEXT(value)
	{
		this.index = value;

		jQuery("#UD"+value).css("font-size", "130%");
			
		for (let i = 0; i < 6;i++)
		{
			if(i===value)
			{
				continue;
			}
			else{

				jQuery("#UD"+i).css("font-size", "13px");
			}
		}
	}

	getDistricts(stateID)
	{
		this.EmployeeMasterService.getDistricts(stateID).subscribe((response:Response)=>this.getDistrictsSuccessHandeler(response));
	}

	getOfficeDistricts(stateID) {
		this.EmployeeMasterService.getDistricts(stateID).subscribe((response: Response) => this.getOfficeDistrictsSuccessHandeler(response));
	}



	AddIDs(type,value)
	{
		let obj={
			'IDtype':type,
			'IDvalue':value
		}

		if (this.govtIDs.length===0)
		{
			this.govtIDs.push(obj);
			this.ID_Type = "";
			this.ID_Value = "";
		}else
		{
			let count = 0;
			for (let i = 0; i < this.govtIDs.length;i++)
			{
				if (type === this.govtIDs[i].IDtype)
				{
					count = count + 1;
				}
			}
			if(count===0)
			{
				this.govtIDs.push(obj);
				this.ID_Type = "";
				this.ID_Value = "";
			}
		}
		
	}

	RemoveID(index)
	{
		this.govtIDs.splice(index,1);
	}


	createEmployee()
	{
		let request_object = {

			"titleID": this.title,
			"firstName": this.firstname,
			"middleName": this.middlename,
			"lastName": this.lastname,
			"genderID": this.gender,
			"maritalStatusID": 2,
			"aadhaarNo": "999999999999",
			"pAN": "888888888888",
			"dOB": new Date((this.dob) - 1 * (this.dob.getTimezoneOffset() * 60 * 1000)).toJSON(),
			"dOJ": "2017-08-02T00:00:00.000Z",
			// "qualificationID": this.qualificationType,
			"qualificationID":1,
			"userName": this.username,
			"agentID": "w758937534",
			"emailID": this.emailID,
			"statusID": 1,  // because its a new user 
			// "emergencyContactPerson": "Ish Gandotra",
			// "emergencyContactNo": "9023650041",
			// "titleName": "Mrs",
			// "status": "New",
			// "qualificationName": "PostGraduate",
			"createdBy": "DI352929",
			"modifiedBy": "DiamondKhanna",
			"password": this.password,
			"agentPassword": "8069",
			// "createdDate": "2017-08-01T00:00:00.000Z",
			// "fathersName": "ML Kundra",
			// "mothersName": "Sudarshan Kundra",
			"addressLine1": this.permanentAddressLine1,
			"addressLine2": this.permanentAddressLine2,
			// "addressLine3": "xzli",
			// "addressLine4": "abc1",
			// "addressLine5": "abc2",
			"cityID": "1",
			"stateID": this.permanentState,
			"communityID": "1",
			"religionID": "1",
			"countryID": this.countryID,
			"pinCode": this.permanentPincode,
			"isPresent": "0",
			"isPermanent": "1",
			"languageID": this.languages,
			"weightage": [10, 20],
			"roleID": [1,2,3],
			"serviceProviderID": this.serviceProviderID,
			"providerServiceMapID": "1",
			"workingLocationID": "1"
		}

		this.EmployeeMasterService.createEmployee(request_object).subscribe((response:Response)=>this.createEmployeeSuccessHandeler(response));
	}
	
	


	

	
}
