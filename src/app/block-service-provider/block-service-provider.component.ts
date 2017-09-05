import { Component, OnInit } from '@angular/core';
import { BlockProvider } from "../services/adminServices/AdminServiceProvider/block-provider-service.service";


@Component({
	selector: 'app-block-service-provider',
	templateUrl: './block-service-provider.component.html',
	styleUrls: ['./block-service-provider.component.css']
})
export class BlockServiceProviderComponent implements OnInit {

	data: any = [];

	service_provider_array: any = [];
	states_array: any = [];
	services_array: any = [];

	// ngModels

	service_provider:any;
	state:any;
	serviceline:any;

	showTable: boolean;
	case_one: boolean;
	case_two: boolean;
	case_three: boolean;
	case_four: boolean;

	constructor(public block_provider:BlockProvider) {
		this.service_provider="";
		this.state="";
		this.serviceline="";
		this.showTable = false;

		this.case_one=false;
		this.case_two=false;
		this.case_three=false;
		this.case_four=false;
	 }

	ngOnInit() {
		this.block_provider.getAllProviders().subscribe(response => this.getAllProvidersSuccesshandeler(response));
	}

	getStates(serviceProviderID) {
		this.block_provider.getStates(serviceProviderID).subscribe(response => { 
			this.getStatesSuccesshandeler(response);
			this.getAllServicesOfProvider(serviceProviderID);
		});
	}

	getAllServicesOfProvider(serviceProviderID)
	{
		this.block_provider.getServicesOfProvider(serviceProviderID).subscribe(response => this.getAllServicesOfProviderSuccesshandeler(response));
	}

	getServicesInState(serviceProviderID, stateID)
	{
		this.block_provider.getServicesInState(serviceProviderID, stateID).subscribe(response => this.getServicesInStatesSuccesshandeler(response));
	}



	// success handelers
	reset()
	{
		this.state = "";
		this.serviceline = "";
		this.states_array = [];
		this.services_array = [];
	}
	
	getAllProvidersSuccesshandeler(response) 
	{
		this.service_provider_array = response;
	}

	getStatesSuccesshandeler(response)
	{
		this.reset();
		this.states_array = response;
	}

	getAllServicesOfProviderSuccesshandeler(response)
	{
		this.services_array = response;
	}

	getServicesInStatesSuccesshandeler(response)
	{
		this.serviceline = "";
		this.services_array = response;
	}

	// Get STATUS function 

	getStatus(service_provider, state, serviceline)
	{
		this.showTable = true;

		if (service_provider != "" && service_provider != null && state === "" && serviceline === "")
		{
			console.log("pehla case");
			this.case_one = true;
			this.case_two = false;
			this.case_three = false;
			this.case_four = false;

			this.getStatusOnProviderLevel(service_provider);
		}
		if (service_provider != "" && service_provider != null && state != "" && state != null && serviceline === "")
		{
			console.log("dusra case");
			this.case_one = false;
			this.case_two = true;
			this.case_three = false;
			this.case_four = false;

			this.getStatusOnProviderStateLevel(service_provider, state);
		}
		if (service_provider != "" && service_provider != null && state === "" && serviceline != "" && serviceline != null)
		{
			console.log("third case");
			this.case_one = false;
			this.case_two = false;
			this.case_three = true;
			this.case_four = false;

			this.getStatusOnProviderServiceLevel(service_provider, serviceline);
		}
		if (service_provider != "" && state != "" && serviceline != "" && service_provider != null && state != null && serviceline != null)
		{
			console.log("chautha case");
			this.case_one = false;
			this.case_two = false;
			this.case_three = false;
			this.case_four = true;

			this.getStatusOnProviderStateServiceLevel(service_provider, state, serviceline);
		}
	}


	getStatusOnProviderLevel(service_provider) {
		this.block_provider.getProviderLevelStatus(service_provider).subscribe(response => this.data= this.generic_successhandeler(response));

	}

	getStatusOnProviderServiceLevel(service_provider, serviceline) {
		this.block_provider.getProvider_ServiceLineLevelStatus(service_provider, serviceline).subscribe(response =>this.data= this.generic_successhandeler(response));

	}

	getStatusOnProviderStateLevel(service_provider, state) {
		this.block_provider.getProvider_StateLevelStatus(service_provider, state).subscribe(response =>this.data= this.generic_successhandeler(response));

	}

	getStatusOnProviderStateServiceLevel(service_provider, state, serviceline) {
		this.block_provider.getProvider_State_ServiceLineLevelStatus(service_provider, state, serviceline).subscribe(response =>this.data= this.generic_successhandeler(response));

	}

	generic_successhandeler(response)
	{
		console.log(response, "RESPONSE");
		return response;
	}
	

}


// OLD CODE : diamond khanna

	/*showUnblockIcon:boolean=true;
	showBlockIcon:boolean=false;

	blocking_area: boolean = false;
	unblocking_area: boolean = false;


	serviceProvider: any = "";
	toggleAction(val:any)
	{	
		if(val==='1')
		{
			this.showBlockIcon=true;
			this.showUnblockIcon=false;
			this.unblocking_area = true;
			this.blocking_area = false;
		}
		if(val==='2')
		{
			this.showBlockIcon=false;
			this.showUnblockIcon=true;
			this.unblocking_area = false;
			this.blocking_area = true;
		}

	}


	block_type:any="";
	unblock_type: any = "";

	conditionExpression:any="";
	conditionExpression_Unblock: any = "";

	radioVal(val)
	{
		console.log(val);
		this.conditionExpression=val;
	}
	radioValUnblock(val)
	{
		this.conditionExpression_Unblock = val;
	}

	states:any=[{'stateID':'1','stateName':'Punjab'},{'stateID':'2','stateName':'Karnataka'},
							{'stateID':'3','stateName':'Assam'},{'stateID':'4','stateName':'Tamil Nadu'},
							{'stateID':'5','stateName':'Andhra Pradesh'}
						];

	blockedStatesArray:any=[];
	populateBlockedStateArray(state)
	{
		this.blockedStatesArray.push(state);
	}

	deleteRecipient(index)
	{
		this.blockedStatesArray.splice(index,1);
	}



	------------------------------state n service blocking code----------------------
	whenNotAdded: boolean = true;
	whenAdded: boolean = false;

	toBeBlockedStateServicesArray: any = [];

	requestArray: any = [];

	showReqTable: boolean = false;

	populatetoBeBlockedStatesServicesArray(serviceline)
	{
		this.toBeBlockedStateServicesArray.push(serviceline);
	}
	deleteService(index)
	{
		this.toBeBlockedStateServicesArray.splice(index, 1);
	}

	addToRequestArray(state,servicesArray)
	{
		let reqobj={
			"state":state,
			"services":servicesArray
		}
		this.requestArray.push(reqobj);
		this.toBeBlockedStateServicesArray = [];

		this.showReqTable = true;
	}

	removeFromRequestArray(index)
	{
		this.requestArray.splice(index, 1);
		if(this.requestArray.length==0)
		{
			this.showReqTable = false;
		}
	}


	Block(array)
	{
		var ans = confirm('do you want to block ' + array + "??");
		console.log(ans);
		if(ans==true)
		{
			this.showReqTable = false;
			alert("Services in selected States Blocked");
		}

	}*/







  
