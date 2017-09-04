import { Component, OnInit } from '@angular/core';
import { BlockProvider } from "../services/adminServices/AdminServiceProvider/block-provider-service.service";


@Component({
	selector: 'app-block-service-provider',
	templateUrl: './block-service-provider.component.html',
	styleUrls: ['./block-service-provider.component.css']
})
export class BlockServiceProviderComponent implements OnInit {

	data: any = [];
	constructor(public block_provider:BlockProvider) { }

	ngOnInit() {
		this.block_provider.getAllProviders().subscribe(response => this.successhandeler(response));
	}

	successhandeler(response)
	{
		this.data = response;
	}

}

	// showUnblockIcon:boolean=true;
	// showBlockIcon:boolean=false;

	// blocking_area: boolean = false;
	// unblocking_area: boolean = false;


	// serviceProvider: any = "";
	// toggleAction(val:any)
	// {	
	// 	if(val==='1')
	// 	{
	// 		this.showBlockIcon=true;
	// 		this.showUnblockIcon=false;
	// 		this.unblocking_area = true;
	// 		this.blocking_area = false;
	// 	}
	// 	if(val==='2')
	// 	{
	// 		this.showBlockIcon=false;
	// 		this.showUnblockIcon=true;
	// 		this.unblocking_area = false;
	// 		this.blocking_area = true;
	// 	}

	// }


	// block_type:any="";
	// unblock_type: any = "";

	// conditionExpression:any="";
	// conditionExpression_Unblock: any = "";

	// radioVal(val)
	// {
	// 	console.log(val);
	// 	this.conditionExpression=val;
	// }
	// radioValUnblock(val)
	// {
	// 	this.conditionExpression_Unblock = val;
	// }

	// states:any=[{'stateID':'1','stateName':'Punjab'},{'stateID':'2','stateName':'Karnataka'},
	// 						{'stateID':'3','stateName':'Assam'},{'stateID':'4','stateName':'Tamil Nadu'},
	// 						{'stateID':'5','stateName':'Andhra Pradesh'}
	// 					];

	// blockedStatesArray:any=[];
	// populateBlockedStateArray(state)
	// {
	// 	this.blockedStatesArray.push(state);
	// }

	// deleteRecipient(index)
	// {
	// 	this.blockedStatesArray.splice(index,1);
	// }



	// ------------------------------state n service blocking code----------------------
	// whenNotAdded: boolean = true;
	// whenAdded: boolean = false;

	// toBeBlockedStateServicesArray: any = [];

	// requestArray: any = [];

	// showReqTable: boolean = false;

	// populatetoBeBlockedStatesServicesArray(serviceline)
	// {
	// 	this.toBeBlockedStateServicesArray.push(serviceline);
	// }
	// deleteService(index)
	// {
	// 	this.toBeBlockedStateServicesArray.splice(index, 1);
	// }

	// addToRequestArray(state,servicesArray)
	// {
	// 	let reqobj={
	// 		"state":state,
	// 		"services":servicesArray
	// 	}
	// 	this.requestArray.push(reqobj);
	// 	this.toBeBlockedStateServicesArray = [];

	// 	this.showReqTable = true;
	// }

	// removeFromRequestArray(index)
	// {
	// 	this.requestArray.splice(index, 1);
	// 	if(this.requestArray.length==0)
	// 	{
	// 		this.showReqTable = false;
	// 	}
	// }


	// Block(array)
	// {
	// 	var ans = confirm('do you want to block ' + array + "??");
	// 	console.log(ans);
	// 	if(ans==true)
	// 	{
	// 		this.showReqTable = false;
	// 		alert("Services in selected States Blocked");
	// 	}

	// }







  
