import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

import { SuperAdmin_ServiceProvider_Service } from "../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service";

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

	/** --ngModels*/


	// arrays

	titles: any;
	genders: any;

	constructor(public super_admin_service: SuperAdmin_ServiceProvider_Service) { 
		this.UI_Services_Array = this.ServicesInSystem;
		this.titles = [
		{
			"id":"1",
			"name":"Mr"
		},
		{
			"id": "2",
			"name": "Ms"
		}];
		this.genders = [
		{
			"id": "1",
			"name": "Male"
		},
		{
			"id": "2",
			"name": "Female"
		}];

	};


	ngOnInit() {


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
		"ServiceProviderName": "",

		"StateId": null,
		"LogoFileName": "",
		"LogoFilePath": "",
		"PrimaryContactName": "",
		"PrimaryContactNo": "",
		"PrimaryContactEmailID": "",
		"PrimaryContactAddress": "",

		"SecondaryContactName": "",
		"SecondaryContactNo": "",
		"SecondaryContactEmailID": "",
		"SecondaryContactAddress": "",


		"CreatedBy": "",

		"stateAndServiceMapList": [],
		"providerAdminDetails": []
	}


	show(val:number)
	{
		if(val==2)
		{
			this.show1= false;
			this.show2= true;
			this.show3= false;


			this.request_object.ServiceProviderName = this.serviceProviderName;
			// this.request_object.valid_till = new Date((this.validTill) - 1 * (this.validTill.getTimezoneOffset() * 60 * 1000)).toJSON();
			this.request_object.PrimaryContactName = this.contactPerson;
			this.request_object.PrimaryContactNo = this.contactNumber;
			this.request_object.PrimaryContactEmailID = this.emailID;
			this.request_object.PrimaryContactAddress = this.address1+","+this.address2;


		}
		if(val==3)
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

	ServicesInSystem:any= [
	{
		"id": "1",
		"name": "104"
	},
	{
		"id": "2",
		"name": "1097"
	},
	{
		"id": "3",
		"name": "MCTS"
	},
	{
		"id": "4",
		"name": "TM"
	},
	{
		"id": "5",
		"name": "MMU"
	}
	];

	UI_Services_Array: any ;

	services_in_state: any = [];
	addServicesToState(service,index)
	{
		console.log(service, index);
		if (this.services_in_state.length<1)
		{
			this.services_in_state.push(service.id);
			this.UI_Services_Array.splice(index, 1);
			console.log("first time insertion in array");
		}
		else
		{
			var count = 0;
			for (var i = 0; i < this.services_in_state.length;i++)
			{
				if (this.services_in_state[i]===service.id)
				{
					count = count + 1;
				}
			}
			if (count < 1) {
				this.services_in_state.push(service.id);
				this.UI_Services_Array.splice(index, 1);
				console.log("Subsequent time insertion in array");
			}
		}

	}
	removeServicesFromState(index)
	{
		this.UI_Services_Array.push(this.services_in_state[index]);
		this.services_in_state.splice(index, 1);
	}

	state_service_array: any = [];
	add_2_state_service_array(state,services)
	{
		let data_obj={
			"stateId": state,
			"services": services
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
		/** if blank array, enter obj as it is */
		else{
			this.state_service_array.push(data_obj);
			console.log(this.state_service_array);

		}


		/** once data is pushed in the table array..do the following */

		this.services_in_state = [];
		this.state = "";
		this.service = "";
		this.showTable = true;
		
		this.UI_Services_Array = [
		{
			"id": "1",
			"name": "104"
		},
		{
			"id": "2",
			"name": "1097"
		},
		{
			"id": "3",
			"name": "MCTS"
		},
		{
			"id": "4",
			"name": "TM"
		},
		{
			"id": "5",
			"name": "MMU"
		}
		];
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
			"userName": this.username,
			"password": this.password,
			"titleID": this.title,
			"genderID": this.gender,
			"dob": new Date((this.dob) - 1 * (this.dob.getTimezoneOffset() * 60 * 1000)).toJSON(),
			"doj": new Date((this.doj) - 1 * (this.doj.getTimezoneOffset() * 60 * 1000)).toJSON(),
			"maritalStatusID": "",
			"aadharNo": "",
			"panNo": "",
			"qualificationID": "",
			"emrContactPersion": "",
			"emrConctactNo": "",
			"statusID": "1"
		}

		this.request_object.CreatedBy="kaakaJi"
		

		this.request_object.providerAdminDetails.push(provider_admin_details_obj);
		console.log(this.request_object);

		this.super_admin_service.createServiceProvider(this.request_object).subscribe((response:Response) =>this.successHandeler(response));

	}


	successHandeler(response)
	{
		console.log(response, "in TS, the response after having sent req for creating service provider");
		if(response==="true")
		{
			this.show1 = true;
			this.show2 = false;
			this.show3 = false;
			this.resetNGmodules();
		}
	}

}
