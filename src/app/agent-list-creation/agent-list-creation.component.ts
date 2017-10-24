import { Component, OnInit } from '@angular/core';
import { AgentListCreationService } from '../services/ProviderAdminServices/agent-list-creation-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
	selector: 'app-agent-list-creation',
	templateUrl: './agent-list-creation.component.html',
	styleUrls: ['./agent-list-creation.component.css']
})
export class AgentListCreationComponent implements OnInit {

	serviceProviderID:any;
	providerServiceMapID:any;
	radio_option:any;
	
	state:any;
	service:any;
	campaign_name:any;
	agent_ID:any;
	password:any;

	states:any=[];
	services:any=[];
	campaignNames:any=[];
	resultArray:any=[];

	constructor(public AgentListCreationService:AgentListCreationService,
	            public commonDataService:dataService,
	            public alertService:ConfirmationDialogsService) {
		this.serviceProviderID =this.commonDataService.service_providerID;
	}

	ngOnInit() {
		this.radio_option='1';
		this.AgentListCreationService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response));

	}

	getStatesSuccessHandeler(response)
	{
		console.log("STATE",response);
		this.states=response;
	}

	getServices(stateID)
	{
		this.service=""; 
		this.AgentListCreationService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServicesSuccessHandeler(response));
	}

	getServicesSuccessHandeler(response)
	{
		console.log("SERVICES",response);
		this.services=response;
	}

	setProviderServiceMapID(providerServiceMapID)
	{
		console.log("providerServiceMapID",providerServiceMapID);
		this.providerServiceMapID=providerServiceMapID;
	}

	getCampaignNames(serviceName)
	{
		this.AgentListCreationService.getCampaignNames(serviceName)
		.subscribe(response=>this.getCampaignNamesSuccessHandeler(response));

	}

	getCampaignNamesSuccessHandeler(response)
	{
		if(response)
		{
			this.campaignNames=response.campaign;
		}
	}

	reset()
	{
		this.agent_ID="";
		this.resultArray=[];
	}


	validate_one(agentID)
	{ 
		this.resultArray=[];
		
		if(agentID!=""||agentID!=null||agentID!=undefined)
		{
			// var obj=
			// {
			// 	"agentID":agentID
			// }

			var obj={
				"agentID":parseInt(agentID),
				"agentPassword":this.password,
				"providerServiceMapID":this.providerServiceMapID,
				"cti_CampaignName":this.campaign_name,
				"createdBy":this.commonDataService.uname
			}

			this.resultArray.push(obj);
		}

		console.log("Result from 1",this.resultArray);

	}

	validate_two(agentID)
	{ 
		this.resultArray=[];

		var items=agentID.split(",");
		for(let i=0;i<items.length;i++)
		{
			// let obj=
			// {
			// 	"agentID":parseInt(items[i])
			// }
			var obj={
				"agentID":parseInt(items[i]),
				"agentPassword":this.password,
				"providerServiceMapID":this.providerServiceMapID,
				"cti_CampaignName":this.campaign_name,
				"createdBy":this.commonDataService.uname
			}

			if(this.resultArray.length==0)
			{
				this.resultArray.push(obj);
			}
			else
			{
				var count = 0;
				for(var k = 0; k < this.resultArray.length; k++) 
				{
					if (this.resultArray[k].agentID === obj.agentID) 
					{
						count = count+1;
					}
				}

				if(count===0)
				{
					this.resultArray.push(obj);
				}
			}

			
		}
		console.log("Result from 2",this.resultArray);
	}

	validate_three(agentID)
	{ 
		this.resultArray=[];

		var hyphen_items=agentID.split("-");
		if(hyphen_items.length==2)
		{
			var no_of_items=(parseInt(hyphen_items[1])-parseInt(hyphen_items[0]))+1;
			for(let j=0;j<no_of_items;j++)
			{
				// let obj=
				// {
				// 	"agentID":parseInt(hyphen_items[0])+j
				// }

				var obj={
					"agentID":parseInt(hyphen_items[0])+j,
					"agentPassword":this.password,
					"providerServiceMapID":this.providerServiceMapID,
					"cti_CampaignName":this.campaign_name,
					"createdBy":this.commonDataService.uname
				}

				if(this.resultArray.length==0)
				{
					this.resultArray.push(obj);
				}
				else
				{
					var count = 0;
					for(var i = 0; i < this.resultArray.length; i++) 
					{
						if (this.resultArray[i].agentID === obj.agentID) 
						{
							count = count+1;
						}
					}

					if(count===0)
					{
						this.resultArray.push(obj);
					}
				}
			}
		}

		console.log("Result from 3",this.resultArray);
	}


	map(choice)
	{
		if(choice==="1")
		{
			this.validate_one(this.agent_ID);
		}
		if(choice==="2")
		{
			this.validate_two(this.agent_ID);
		}
		if(choice==="3")
		{
			this.validate_three(this.agent_ID);
		}

		this.AgentListCreationService.saveAgentListMapping(this.resultArray)
		.subscribe(response=>this.saveSuccessHandeler(response));
	}

	saveSuccessHandeler(response)
	{
		console.log(response,"DIAMOND KA RESPONSE");
		if(response)
		{
			if(response.length>0)
			{
				this.alertService.alert("Mapping Done Successfully for "+response.length+" Agent ID");
				this.resetFields();
			}
			if(response.length==0)
			{
				this.alertService.alert("Mapping has already been done for the provided Agent ID/IDs");
			}
		}
	}


	resetFields()
	{
		this.state="";
		this.service="";
		this.campaign_name="";
		this.agent_ID="";
		this.password="";

		this.radio_option='1';

		this.services=[];
		this.campaignNames=[];
		this.resultArray=[];
	}


	// validateAgentID(input)
	// {
	// 	var result_array=[];
	// 	var str=input;
	// 	var hyphen_check=str.search("-");
	// 	var comma_check=str.search(",");

	// 	if(comma_check!=-1)
	// 	{
	// 		var items=str.split(",");
	// 		for(let i=0;i<items.length;i++)
	// 		{
	// 			var hyphen_check_two=items[i].search("-");
	// 			if(hyphen_check_two===-1)
	// 			{
	// 				let obj={
	// 					"item":parseInt(items[i])
	// 				}

	// 				result_array.push(obj);	
	// 			}
	// 			else
	// 			{
	// 				var hyphen_items=items[i].split("-");
	// 				if(hyphen_items.length==2)
	// 				{
	// 					var no_of_items=(parseInt(hyphen_items[1])-parseInt(hyphen_items[0]))+1;
	// 					for(let j=0;j<no_of_items;j++)
	// 					{
	// 						let obj={
	// 							"item":parseInt(hyphen_items[0])+j
	// 						}

	// 						result_array.push(obj);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	console.log("result",result_array);
	// }

}
