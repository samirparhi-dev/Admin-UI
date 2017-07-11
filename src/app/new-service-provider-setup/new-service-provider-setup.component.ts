import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-service-provider-setup',
  templateUrl: './new-service-provider-setup.component.html',
  styleUrls: ['./new-service-provider-setup.component.css']
})
export class NewServiceProviderSetupComponent implements OnInit {

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

	firstname:any="";
	middlename:any="";
	lastname:any="";
	username:any="";
	password:any="";
	providerAdmin_EmailID:any="";
	providerAdmin_PhoneNumber:any="";

/** --ngModels*/

  constructor() { }

  ngOnInit() {
  }

  show1: boolean = true;
  show2: boolean = false;
  show3: boolean = false;

  mainobj: any = {
	  	"service_provider_name":"",
	  	"valid_till":"",
	  	"contact_person":"",
	  	"contact_number":"",
	  	"emailID":"",
	  	"address1":"",
	  	"address2":"",
		"state_n_services": [],
		"provider_admin":[]
	};//the req obj

  // main_object: any = {
	 //  "ServiceProviderName": "",

	 //  "StateId": "",
	 //  "LogoFileName": "",
	 //  "LogoFilePath": "",
	 //  "PrimaryContactName": "",
	 //  "PrimaryContactNo": "",
	 //  "PrimaryContactEmailID": "",
	 //  "PrimaryContactAddress": "",

	 //  "SecondaryContactName": "",
	 //  "SecondaryContactNo": "",
	 //  "SecondaryContactEmailID": "",
	 //  "SecondaryContactAddress": "",


	 //  "CreatedBy": "",

	 //  "stateAndServiceMapList": [],
		  // "stateId": "",
		  // "services": ["1", "2"]

	  
	  // "providerAdminDetails": []
	  // {
		 //  "firstName": "Neeraj",
		 //  "middleName": "kumar",
		 //  "lastName": "singh",
		 //  "emailID": "neer.1@gmail.com",
		 //  "mobileNo": "7777777777",
		 //  "userName": "singh",
		 //  "password": "singh",
		 //  "titleID": "1",
		 //  "genderID": "2",
		 //  "dob": "2038-01-19 00:00:00",
		 //  "doj": "2038-01-19 03:14:07",
		 //  "maritalStatusID": "",
		 //  "aadharNo": "",
		 //  "panNo": "",
		 //  "qualificationID": "",
		 //  "emrContactPersion": "",
		 //  "emrConctactNo": ""


	  // }]
  // }

  show(val:number)
  {
  	if(val==2)
  	{
		this.show1= false;
		this.show2= true;
		this.show3= false;
		

		this.mainobj.service_provider_name = this.serviceProviderName;
		this.mainobj.valid_till = new Date((this.validTill) - 1 * (this.validTill.getTimezoneOffset() * 60 * 1000)).toJSON();
		this.mainobj.contact_person = this.contactPerson;
		this.mainobj.contact_number = this.contactNumber;
		this.mainobj.emailID = this.emailID;
		this.mainobj.address1 = this.address1;
		this.mainobj.address2 = this.address2;
			
  	}
  	if(val==3)
  	{
		this.show1= false;
		this.show2= false;
		this.show3= true;
		
		this.mainobj.state_n_services = this.state_service_array;
  	}
  }

  // section 1


  


  // section 2

  

  showTable: boolean = false;

  services_in_state: any = [];
  addServicesToState(service)
  {
	  
	  if (!this.services_in_state.includes(service))
	  {
		  this.services_in_state.push(service);
	  }
	 
  }
  removeServicesFromState(index)
  {
	  this.services_in_state.splice(index, 1);
  }

  state_service_array: any = [];
  add_2_state_service_array(state,services)
  {
  	let data_obj={
  		"state":state,
  		"services":services
  	}
		/** NOTE
		if services are already mentioned for that state in that transaction,
		dont add it in the  'state_service_array'
`		*/
		

		/** if the state_service_array is not empty, CHECK if that has an OBJ 
		for a particular state
		*/
		if (this.state_service_array.length>0)   
		{
			let count = 0;
			for (var i = 0; i < this.state_service_array.length; i++) {
				if (this.state_service_array[i].state === state) {
					count = count + 1;
				}
			}
			/** counter will not increase if an obj for that state is not there*/
			if(count===0)
			{
				this.state_service_array.push(data_obj);
			}
		}
		/** if blank array enter it as it is */
		else{
			this.state_service_array.push(data_obj);

		}


		/** once data is pushed in the table array..do the following */

		this.services_in_state = [];
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


  // section 3

  finalSubmit()
  {
  	let provider_admin_details_object={
			"firstname": this.firstname,
			"middlename":this.middlename,
			"lastname":this.lastname,
			"provider_admin_emailID": this.providerAdmin_EmailID,
			"provider_admin_phoneNumber": this.providerAdmin_PhoneNumber,
			"username": this.username,
			"temp_password": this.password
	}
	 
	  this.mainobj.provider_admin.push(provider_admin_details_object);
	  console.log(this.mainobj);

  }

}
