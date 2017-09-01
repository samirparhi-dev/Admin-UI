import { Component, OnInit } from '@angular/core';
import { CallTypeSubtypeService } from "../services/ProviderAdminServices/calltype-subtype-master-service.service";
import { dataService } from '../services/dataService/data.service';


@Component({
	selector: 'app-call-disposition-type-master',
	templateUrl: './call-disposition-type-master.component.html',
	styleUrls: ['./call-disposition-type-master.component.css']
})
export class CallDispositionTypeMasterComponent implements OnInit {

	service_provider_id: any;
	providerServiceMapID: any;
	// ngmodels 
	state: any;
	service: any;

	callType: any;
	callSubType: any;
	fitToBlock: any="0";
	fitForFollowup: any="0";


	// api related 
	request_array: any;
	request_object: any;

	// arrays
	data: any;
	provider_states: any = [];
	provider_services: any = [];

	temporarySubtypeArray: any = [];

	// flags
	showTable: boolean;
	showForm: boolean;


	constructor(public callTypeSubtypeService: CallTypeSubtypeService,
				public commonDataService: dataService) {
		this.data = [];
		this.service_provider_id =this.commonDataService.service_providerID;
		this.providerServiceMapID = "";

		this.showTable = false;
		this.showForm = false;
	 }

	ngOnInit() {
		this.callTypeSubtypeService.getStates(this.service_provider_id).subscribe(response=>this.getStatesSuccessHandeler(response));

		this.request_array = [];
		this.request_object={
			"callGroupType": "",
			"callType1": [],
			"providerServiceMapID": "",
			// "callTypeDesc": "call type desc 1",
			// "fitToBlock": "1",
			// "fitForFollowup": "1",
			"createdBy": "Diamond Khanna"
		}
	}

	// data getters and setters for the component
	getServices(stateID)
	{
		this.callTypeSubtypeService.getServices(this.service_provider_id,stateID).subscribe(response => this.getServicesSuccessHandeler(response));
	}

	setProviderServiceMapID(providerServiceMapID){
		this.providerServiceMapID = providerServiceMapID;
	}

	hideTable()
	{
		this.showTable = false;
		this.showForm = true;
	}

	hideForm()
	{
		this.showTable = true;
		this.showForm = false;
	}

	reset()
	{
		this.callSubType = "";
		this.temporarySubtypeArray = [];
		this.fitToBlock= "0";
		this.fitForFollowup= "0";
	}

	pushCallSubType(call_subtype, fitToBlock, fitForFollowup)
	{
		let obj={
			"call_subtype":call_subtype,
			"fitToBlock": fitToBlock,
			"fitForFollowup":fitForFollowup,
			"call_description": call_subtype
		}
		console.log('dummy obj', obj);

		if(this.temporarySubtypeArray.length==0)
		{
			this.temporarySubtypeArray.push(obj);
			console.log("value pushed1");
		}
		else
		{
			let count = 0;
			for (let i = 0; i < this.temporarySubtypeArray.length;i++)
			{
				if (this.temporarySubtypeArray[i].call_subtype === call_subtype)
				{
					count = count + 1;
					console.log(count, "count");
				}
			}
			if(count<1)
			{
				this.temporarySubtypeArray.push(obj);
				console.log("value pushed2");
			}
			else{
				alert("value exists in buffer array");
			}
		}


		// resetting fields
		this.callSubType = "";
		this.fitToBlock = "0";
		this.fitForFollowup = "0";

	}

	removeFromCallSubType(index)
	{
		this.temporarySubtypeArray.splice(index, 1);
	}

	save()
	{
		this.request_object = {
			"callGroupType": this.callType,
			"callType1": this.temporarySubtypeArray,
			"providerServiceMapID": this.providerServiceMapID,
			// "callTypeDesc": "call type desc 1",
			// "fitToBlock": "1",
			// "fitForFollowup": "1",
			"createdBy": "Diamond Khanna"
		}
		this.request_array.push(this.request_object);
		console.log(this.request_array, "requested array");
		this.hideForm();

	}

	
	// CRUD
	get_calltype_subtype_history()
	{
		this.callTypeSubtypeService.getCallTypeSubType(this.providerServiceMapID).subscribe(response => this.getCallTypeSubTypeSuccessHandeler(response));
	}


	// successhandelers

	getStatesSuccessHandeler(response)
	{
		this.provider_states = response;
	}

	getServicesSuccessHandeler(response) {
		this.provider_services = response;
	}

	getCallTypeSubTypeSuccessHandeler(response)
	{
		console.log("call type subtype history", response);
		this.data = response;

		this.showTable = true;
	}



}
