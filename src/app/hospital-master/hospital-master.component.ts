import { Component, OnInit,Inject } from '@angular/core';
import { HospitalMasterService } from '../services/ProviderAdminServices/hospital-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
	selector: 'app-hospital-master',
	templateUrl: './hospital-master.component.html',
	styleUrls: ['./hospital-master.component.css']
})
export class HospitalMasterComponent implements OnInit {
	/*ngModels*/
	serviceProviderID:any;
	providerServiceMapID:any;
	state:any;
	service:any;
	district:any;
	taluk:any;

	institutionName:any;
	address:any;
	website:any;
	contact_person_name:any;
	contact_number:any;
	emailID:any;

	/*arrays*/
	states:any=[];
	services:any=[];
	districts:any=[];
	taluks:any=[];

	searchResultArray:any=[];

	/*flags*/
	disabled_flag:boolean=false;
	showTableFlag:boolean=false;
	showFormFlag:boolean=false;

	constructor(public HospitalMasterService:HospitalMasterService,
	            public commonDataService:dataService,
	            public dialog:MdDialog,
	            public alertService:ConfirmationDialogsService) 
	{
		this.serviceProviderID=this.commonDataService.service_providerID;
	}

	ngOnInit() {
		this.HospitalMasterService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response));
	}

	clear()
	{
		this.state="";
		this.service="";
		this.district="";
		this.taluk="";

		this.searchResultArray=[];

		this.showTableFlag=false;
	}

	showForm()
	{
		this.disabled_flag=true;
		this.showTableFlag=false;
		this.showFormFlag=true;
	}

	back()
	{
		this.disabled_flag=false;
		this.showTableFlag=true;
		this.showFormFlag=false;

		this.institutionName="";
		this.address="";
		this.website="";
		this.contact_person_name="";
		this.contact_number="";
		this.emailID="";

	}

	getStatesSuccessHandeler(response)
	{
		if(response)
		{
			this.states=response;	
		}
	}

	getServices(stateID)
	{
		this.service="";
		this.district="";
		this.taluk="";

		this.HospitalMasterService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServiceSuccessHandeler(response));
	}

	getServiceSuccessHandeler(response)
	{
		if(response)
		{
			this.services=response;
		}
	}

	getDistrict(stateID)
	{
		this.service="";
		this.district="";
		this.taluk="";

		this.HospitalMasterService.getDistricts(stateID).subscribe(response=>this.getDistrictSuccessHandeler(response));

	}

	getDistrictSuccessHandeler(response)
	{
		console.log(response,"Districts");
		if(response)
		{
			this.districts=response;
		}
	}

	getTaluk(districtID)
	{
		this.taluk="";
		this.HospitalMasterService.getTaluks(districtID).subscribe(response=>this.getTalukSuccessHandeler(response));
	}

	getTalukSuccessHandeler(response)
	{
		console.log(response,"Taluk")
		if(response)
		{
			this.taluks=response;
		}
	}

	setProviderServiceMapID(providerServiceMapID)
	{
		this.district="";
		this.taluk="";
		this.providerServiceMapID=providerServiceMapID;
	}


	getInstitutions()
	{
		let request_obj={
			"providerServiceMapID" : this.providerServiceMapID,
			"stateID" : this.state,
			"districtID" : this.district,
			"blockID": this.taluk
		}
		this.HospitalMasterService.getInstitutions(request_obj).subscribe(response=>this.getInstitutionSuccessHandeler(response));
	}

	getInstitutionSuccessHandeler(response)
	{
		console.log(response,"GET HOSPITAL LIST");
		this.showTableFlag=true;
	}

	createInstitution()
	{
		let request_obj={

			"institutionName": "test1",
			"stateID": 5,
			"districtID": 37,
			"blockID": 537,
			"address": "test adress",
			"contactPerson1": "bipin",
			"contactPerson1_Email": "testcontectperson",
			"contactNo1": "12345678900",
			"contactPerson2": "sunil",
			"contactPerson2_Email": "jjj",
			"contactNo2": "2543464564",
			"contactPerson3": "vinay",
			"contactPerson3_Email": "test3",
			"contactNo3": "233645",
			"website": "www.123.com",
			"providerServiceMapID": 720,
			"createdBy": "wahim"

		}
	}

}
