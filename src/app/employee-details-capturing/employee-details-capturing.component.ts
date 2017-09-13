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
providerServiceMapID: any;
countryID: any;
	data: any = [];

username_status: any;
	showHint: boolean;
	username_dependent_flag:boolean;

/*demographics*/
title:any;
firstname:any;
middlename: any;
lastname:any;
gender:any;
dob: any;
mobileNumber:any;
emailID:any;
employeeID:any;
today = new Date();
allTitles:any=[];
allGenders:any=[];


/*qualification*/
qualificationType:any;
father_name:any;
mother_name:any;
marital_status:any;
religion: any;
community: any;


allQualificationTypes:any=[];
communities: any = [];
marital_status_array: any = [];
religions:any=[];
// allQualifications:any=[];

/*language*/
languages:any;
// preferredlanguage: any;
allLanguages: any=[];
dummy_allLanguages: any = [];// just for visual tricks
selected_languages: any = [];
language_weightage: any = [];

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
emailPattern: any;
isPermanent: any;

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
	serviceproviderAllRoles: any = [];
	serviceproviderAllServices: any = [];

/*unique IDs*/

// ID_Type:any;
// ID_Value:any;

// allIDTypes: any = [];     not used as of now
	adhaar_no:any;
	pan_no:any;


/*credentials*/
username: any;
password: any;
agentID: any;

// arrays

	
	govtIDs:any=[];


	constructor(public EmployeeMasterService: EmployeeMasterService, public commonDataService: dataService) {
	this.languages= [];
	this.index = 0;

	this.serviceProviderID =this.commonDataService.service_providerID;
	this.countryID = 1; // hardcoded as country is INDIA

	this.showHint = false;
	this.username_dependent_flag=true;

	}

	ngOnInit() {
		jQuery("#UD0").css("font-size", "130%");
		this.dob = new Date();
    	this.dob.setFullYear(this.today.getFullYear() - 20);
		this.EmployeeMasterService.getCommonRegistrationData().subscribe((response:Response)=>this.commonRegistrationDataSuccessHandeler(response));
		this.EmployeeMasterService.getStatesOfServiceProvider(this.serviceProviderID).subscribe((response: Response) => this.getStatesOfServiceProviderSuccessHandeler(response));
		this.EmployeeMasterService.getQualifications().subscribe((response: Response) => this.getQualificationsHandeler(response));
	    this.emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

	}

	getServices(stateID)
	{
		this.EmployeeMasterService.getServicesOfServiceProvider(this.serviceProviderID,stateID).subscribe((response: Response) => this.getServicesOfServiceProviderSuccessHandeler(response));

	}

	getOffices(stateID,serviceID) {
		this.EmployeeMasterService.getWorkLocationsInState(this.serviceProviderID, stateID, serviceID).subscribe((response: Response) => this.getWorkLocationsInStateSuccessHandeler(response));

	}

	getRoles(stateID, serviceID) {
		this.EmployeeMasterService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe((response: Response) => this.getRolesSuccessHandeler(response));

	}

	commonRegistrationDataSuccessHandeler(response)
	{
		console.log(response,"emp master component common reg data");
		this.allTitles = response.m_Title;
		this.allGenders = response.m_genders;

		this.allLanguages = response.m_language;
		this.dummy_allLanguages = response.m_language;
		this.allStates = response.states;
		// this.allIDTypes = response.govtIdentityTypes;
		this.communities = response.m_communities;
		this.marital_status_array = response.m_maritalStatuses;

	}

	getQualificationsHandeler(response)
	{
		console.log(response, "qualifications");
		this.allQualificationTypes = response;
	}

	createEmployeeSuccessHandeler(response)
	{
		console.log(response, "employee created successfully");
		alert("Employee Created Successfully!");
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

	getServicesOfServiceProviderSuccessHandeler(response)
	{
		console.log("all services",response);
		this.serviceproviderAllServices = response;
	}

	getWorkLocationsInStateSuccessHandeler(response)
	{
		console.log("all offices", response);
		this.serviceproviderAllOfficesInState = response;
	}

	getRolesSuccessHandeler(response)
	{
		console.log("all roles", response);
		this.serviceproviderAllRoles = response;
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

			this.isPermanent = "1";
		}
		else
		{
			this.currentAddressLine1 = "";
			this.currentAddressLine2 = "";
			this.currentState = "";
			this.currentDistrict = "";
			this.currentPincode = "";
			this.isPermanent = "0";
		}
	}

	MOVE2NEXT(value)
	{
		this.index = value;

		jQuery("#UD"+value).css("font-size", "130%");
			
		for (let i = 0; i <= 6;i++)
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

	setProviderServiceMapID(psmID)
	{
		this.providerServiceMapID = psmID;
	}

	getDistricts(stateID)
	{
		this.EmployeeMasterService.getDistricts(stateID).subscribe((response:Response)=>this.getDistrictsSuccessHandeler(response));
	}

	getOfficeDistricts(stateID) {
		this.EmployeeMasterService.getDistricts(stateID).subscribe((response: Response) => this.getOfficeDistrictsSuccessHandeler(response));
	}

	sliderarray: any = [];
	updateSliderData(data,index)
	{
		
		let index_exists= false;
		let obj={
			"language_index":index,
			"value": data
		}
		if(this.sliderarray.length===0)
		{
			this.sliderarray.push(obj);
		}
		else
		{
			for (let i = 0; i < this.sliderarray.length;i++)
			{
				if(this.sliderarray[i].language_index===index)
				{
					this.sliderarray[i].value = data;
					index_exists = true;
				}
				
			}
			if(index_exists===false)
			{
				this.sliderarray.push(obj);
			}
		}

		// assigning weightage array
		for (let i = 0; i < this.sliderarray.length; i++) {
			this.language_weightage.push(this.sliderarray[i].value);
		}

		//to  check highly proficient language.....not the most proficient language would be at the end of array

		this.sliderarray.sort(function(a, b) { return a.value - b.value });
		
	}


	pushPrivelege()
	{
		let obj={
			"roleID":this.agent_role,
			"providerServiceMapID": this.providerServiceMapID,
			"workingLocationID":this.agent_officeName
		}

		this.data.push(obj);
	}

	removePrivelege(index)
	{
		this.data.splice(index, 1);
	}


	// AddIDs(type,value)
	// {
	// 	let obj={
	// 		'IDtype':type,
	// 		'IDvalue':value
	// 	}

	// 	if (this.govtIDs.length===0)
	// 	{
	// 		this.govtIDs.push(obj);
	// 		this.ID_Type = "";
	// 		this.ID_Value = "";
	// 	}else
	// 	{
	// 		let count = 0;
	// 		for (let i = 0; i < this.govtIDs.length;i++)
	// 		{
	// 			if (type === this.govtIDs[i].IDtype)
	// 			{
	// 				count = count + 1;
	// 			}
	// 		}
	// 		if(count===0)
	// 		{
	// 			this.govtIDs.push(obj);
	// 			this.ID_Type = "";
	// 			this.ID_Value = "";
	// 		}
	// 	}
		
	// }

	// RemoveID(index)
	// {
	// 	this.govtIDs.splice(index,1);
	// }


	createEmployee()
	{
		let request_object = {

			"titleID": this.title,
			"firstName": this.firstname,
			"middleName": this.middlename,
			"lastName": this.lastname,
			"genderID": this.gender,
			"maritalStatusID": this.marital_status,
			"aadhaarNo": this.adhaar_no,
			"pAN": this.pan_no,
			//"dOB": new Date((this.dob) - 1 * (this.dob.getTimezoneOffset() * 60 * 1000)).toJSON(),
			"dOJ": "2017-08-02T00:00:00.000Z",
			"qualificationID":this.qualificationType,
			"userName": this.username,
			"agentID": this.agentID,
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
			"agentPassword": this.password,
			// "createdDate": "2017-08-01T00:00:00.000Z",
			"fathersName": this.father_name,
			"mothersName": this.mother_name,
			"addressLine1": this.permanentAddressLine1,
			"addressLine2": this.permanentAddressLine2,
			// "addressLine3": "xzli",
			// "addressLine4": "abc1",
			// "addressLine5": "abc2",
			"cityID": "1",
			"stateID": this.permanentState,
			"communityID": this.community,
			"religionID":  this.religion,
			"countryID": this.countryID,
			"pinCode": this.permanentPincode,
			"isPresent": "1",  // by default it will remain 1 , if checked, then permanent will also be 1
			"isPermanent": this.isPermanent,
			"languageID": this.languages,
			"weightage": this.language_weightage,
			"previleges":this.data
			// "roleID": this.agent_role,
			// "serviceProviderID": this.serviceProviderID,
			// "providerServiceMapID": this.providerServiceMapID,
			// "workingLocationID": this.agent_officeName
		}
		console.log("create employee request Object:", request_object);
		this.EmployeeMasterService.createEmployee(request_object).subscribe((response:Response)=>this.createEmployeeSuccessHandeler(response));
	}
	
	

	checkUsernameExists(username)
	{
		this.EmployeeMasterService.checkUsernameExists(username).subscribe((response: Response) => this.checkUsernameSuccessHandeler(response));
	}

	checkUsernameSuccessHandeler(response)
	{
		console.log(this.username, "uname");
		console.log("username existance status", response);
		if (response === "userexist")
		{
			this.username_status = "Username Exists !! Choose A Different 'Username' Please!";
			this.showHint=true;
			this.username_dependent_flag = true;
		}
		if (response === "usernotexist")
		{
			if (this.username != "" && (this.username != undefined && this.username != null))
			{
				this.showHint = false;
				this.username_dependent_flag = false;
			}
			else
			{
				this.showHint = true;
				this.username_dependent_flag = true;
				this.username_status = "Username can't be blank";
			}
			
		}
	}
	

	
}
