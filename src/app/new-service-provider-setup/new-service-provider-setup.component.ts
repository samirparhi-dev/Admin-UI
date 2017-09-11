import { Component, OnInit, Input } from '@angular/core';
declare var jQuery: any;

import { SuperAdmin_ServiceProvider_Service } from "../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service";
import { EmployeeMasterService } from "../services/ProviderAdminServices/employee-master-service.service";


@Component({
	selector: 'app-new-service-provider-setup',
	templateUrl: './new-service-provider-setup.component.html',
	styleUrls: ['./new-service-provider-setup.component.css']
})
export class NewServiceProviderSetupComponent implements OnInit {
	@Input() current_language: any;
	currentlanguage: any;

	username_status: any;
	showHint: boolean;
	username_dependent_flag: boolean;

	/** ngModels*/

	serviceProviderName: any = "";
	validTill:any="";
	contactPerson:any="";
	contactNumber:any="";
	emailID:any="";
	address1:any="";
	address2:any="";

	state: any = "";
	service: any = "";

	title: any = "";
	gender: any = "";
	dob: any = "";
	doj: any = "";
	firstname:any="";
	middlename:any="";
	lastname:any="";
	username:any="";
	password:any="";
	providerAdmin_EmailID:any="";
	providerAdmin_PhoneNumber:any="";
	aadhaar_number: any = "";
	pan_number: any = "";


	countryID: any;

	/** --ngModels*/


	// arrays

	titles: any;
	genders: any;

	states: any;
	servicelines:any;

	constructor(public super_admin_service: SuperAdmin_ServiceProvider_Service, public EmployeeMasterService: EmployeeMasterService) { 

		this.countryID = 1;

		this.currentlanguage = {};

		this.showHint = false;
		this.username_dependent_flag=true;

	};


	ngOnInit() {

		this.super_admin_service.getAllStates(this.countryID).subscribe((response:Response)=>this.states=this.successhandeler(response));
		this.super_admin_service.getAllServiceLines().subscribe((response: Response) => this.servicelines = this.successhandeler(response));
		this.super_admin_service.getCommonRegistrationData().subscribe(response=>this.reg_data_successhandeler(response));
	}

	ngOnChanges() {
		this.setLanguage(this.current_language);
	}

	reg_data_successhandeler(response)
	{
		console.log("common registration",response);
		this.titles=response.m_Title
		this.genders=response.m_genders
	}

	setLanguage(language) {
		this.currentlanguage = language;
		console.log(language, "language");
	}

	successhandeler(response)
	{
		console.log(response, "**");
		return response;
	}

	resetNGmodules()
	{
		this.serviceProviderName= "";
		this.validTill="";
		this.contactPerson="";
		this.contactNumber="";
		this.emailID="";
		this.address1="";
		this.address2="";

		this.state="";
		this.service="";

		this.title="";
		this.gender="";
		this.dob="";
		this.doj="";
		this.firstname="";
		this.middlename="";
		this.lastname="";
		this.username="";
		this.password="";
		this.providerAdmin_EmailID="";
		this.providerAdmin_PhoneNumber="";

	}

	show1: boolean = true;
	show2: boolean = false;
	show3: boolean = false;

	request_object: any = {
		"serviceProviderName": "",

		"stateId": null,
		"logoFileName": "",
		"logoFilePath": "",
		"primaryContactName": "",
		"primaryContactNo": "",
		"primaryContactEmailID": "",
		"primaryContactAddress": "",

		"secondaryContactName": "",
		"secondaryContactNo": "",
		"secondaryContactEmailID": "",
		"secondaryContactAddress": "",
		"statusID": "1",


		"createdBy": "Diamond_Khanna",

		"stateAndServiceMapList": [],
		"providerAdminDetails": []
	}


	show(val:number,action:string)
	{
		if(val==1 && action==="back")
		{
			this.show1 = true;
			this.show2 = false;
			this.show3 = false;
		}

		if(val==2 && action==="save")
		{
			this.show1= false;
			this.show2= true;
			this.show3= false;


			this.request_object.serviceProviderName = this.serviceProviderName.toLowerCase();
			// this.request_object.valid_till = new Date((this.validTill) - 1 * (this.validTill.getTimezoneOffset() * 60 * 1000)).toJSON();
			this.request_object.primaryContactName = this.contactPerson;
			this.request_object.primaryContactNo = this.contactNumber;
			this.request_object.primaryContactEmailID = this.emailID;
			this.request_object.primaryContactAddress = this.address1+","+this.address2;


		}

		if (val == 2 && action === "back") {
			this.show1 = false;
			this.show2 = true;
			this.show3 = false;
		}

		if(val==3 && action==="save")
		{
			this.show1= false;
			this.show2= false;
			this.show3= true;

			this.request_object.stateAndServiceMapList = this.state_service_array;
		}
	}

	// section 1





	// section 2



	showTable: boolean = false;

	

	

	state_service_array: any = [];
	add_2_state_service_array(state,services)
	{
		let data_obj={
			"stateId": state,
			"services": services.map(String)
		}
		/** NOTE
		if services are already mentioned for that state in that transaction,
		dont add it in the  'state_service_array'
	`       */


		/** if the state_service_array is not empty, CHECK if that has an OBJ 
		for a particular state
			*/
		if (this.state_service_array.length>0)   
		{
			let count = 0;
			for (var i = 0; i < this.state_service_array.length; i++) {
				if (this.state_service_array[i].stateId === data_obj.stateId) {
					count = count + 1;
				}
			}
			/** counter will not increase if an obj for that state is not there*/
			if(count===0)
			{
				if (data_obj.stateId != "")
				{
					this.state_service_array.push(data_obj);
				}
				
			}
		}
		/** if blank array, enter obj as it is */
		else{
			if (data_obj.stateId != "") {
				this.state_service_array.push(data_obj);
			}
			
			console.log(this.state_service_array);

		}


		/** once data is pushed in the table array..do the following */

		this.state = "";
		this.service = "";
		this.showTable = true;
		
	}
	remove_from_state_service_array(index){
		this.state_service_array.splice(index,1);
		if (this.state_service_array.length==0)
		{
			this.showTable = false;
		}

	}

	resetArray()
	{
		this.state_service_array = [];
	}


	// section 3

	finalSubmit()
	{
		let provider_admin_details_obj={
			"firstName": this.firstname,
			"middleName": this.middlename,
			"lastName": this.lastname,
			"emailID": this.providerAdmin_EmailID,
			"mobileNo": this.providerAdmin_PhoneNumber,
			"userName": this.username.toLowerCase(),
			"password": this.password,
			"titleID": this.title,
			"genderID": this.gender,
			"dob": new Date((this.dob) - 1 * (this.dob.getTimezoneOffset() * 60 * 1000)).toJSON(),
			"doj": new Date((this.doj) - 1 * (this.doj.getTimezoneOffset() * 60 * 1000)).toJSON(),
			"maritalStatusID": "",
			"aadharNo": this.aadhaar_number,
			"panNo": this.pan_number,
			"qualificationID": "",
			"emrContactPersion": "",
			"emrConctactNo": "",
			"statusID": "1"
		}

		this.request_object.createdBy="kaakaJi"
		

		this.request_object.providerAdminDetails.push(provider_admin_details_obj);
		console.log(JSON.stringify(this.request_object));

		this.super_admin_service.createServiceProvider(this.request_object).subscribe((response:Response) =>this.successHandeler(response));

	}


	successHandeler(response)
	{
		console.log(response, "in TS, the response after having sent req for creating service provider");
		if(response==="true")
		{
			alert("PROVIDER CREATED SUCCESSFULLY");
			this.show1 = true;
			this.show2 = false;
			this.show3 = false;
			this.resetNGmodules();
		}
	}

	checkProviderNameAvailability(service_provider_name)
	{
		this.super_admin_service.checkProviderNameAvailability(service_provider_name).subscribe(response=>this.checkProviderNameAvailibilityHandeler(response));
	}

	checkProviderNameAvailibilityHandeler(response)
	{
		console.log(response,"provider name availability");
	}

	checkUsernameExists(username) {
		this.EmployeeMasterService.checkUsernameExists(username).subscribe((response: Response) => this.checkUsernameSuccessHandeler(response));
	}

	checkUsernameSuccessHandeler(response) {
		console.log(this.username, "uname");
		console.log("username existance status", response);
		if (response === "userexist") {
			this.username_status = "Username Exists !! Choose A Different 'Username' Please!";
			this.showHint = true;
			this.username_dependent_flag = true;
		}
		if (response === "usernotexist") {
			if (this.username != "" && (this.username != undefined && this.username != null)) {
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
