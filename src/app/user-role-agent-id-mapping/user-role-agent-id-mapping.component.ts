import { Component, OnInit,Inject } from '@angular/core';
import { UserRoleAgentID_MappingService } from '../services/ProviderAdminServices/user-role-agentID-mapping-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-user-role-agent-id-mapping',
	templateUrl: './user-role-agent-id-mapping.component.html',
	styleUrls: ['./user-role-agent-id-mapping.component.css']
})
export class UserRoleAgentIDMappingComponent implements OnInit {

	/*ngModels*/
	serviceProviderID:any;
	
	state:any;
	service:any;
	role:any;

	/*arrays*/
	states:any=[];
	services:any=[];
	roles:any=[];

	searchResultArray:any=[];

	/*flags*/
	showTableFlag:boolean=false;

	constructor(public UserRoleAgentID_MappingService:UserRoleAgentID_MappingService,
	            public commonDataService:dataService,
	            public dialog:MdDialog) {
		this.serviceProviderID =this.commonDataService.service_providerID;
	}

	ngOnInit() {
		this.UserRoleAgentID_MappingService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response));

	}

	getStatesSuccessHandeler(response)
	{
		console.log("STATE",response);
		this.states=response;
	}

	getServices(stateID)
	{
		this.service=""; //resetting the field on changing state
		this.UserRoleAgentID_MappingService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServicesSuccessHandeler(response));
	}

	getServicesSuccessHandeler(response)
	{
		console.log("SERVICES",response);
		this.services=response;
	}

	getRoles(stateID, serviceID) 
	{
		this.UserRoleAgentID_MappingService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe(response => this.rolesSuccesshandeler(response));
	}

	rolesSuccesshandeler(response) 
	{
		console.log(response, 'roles of provider for that state');
		this.roles = response;
	}

	searchEmployee(state, service, role, empname, empid) {
		console.log(state + "--" + service + "--" + role + "--" + empname + "--" + empid);
		let request_obj = {
			"serviceProviderID": this.serviceProviderID,
			"pSMStateID": state,
			"serviceID": service,
			"roleID": role,
			"userName": empname,
			"userID": empid
		}
		if (request_obj.pSMStateID === undefined || request_obj.pSMStateID === "" ) {
			request_obj.pSMStateID = null;
		}
		if (request_obj.serviceID === undefined || request_obj.pSMStateID === "" ) {
			request_obj.serviceID = null;
		}
		if (request_obj.roleID === undefined || request_obj.pSMStateID === "" ) {

			request_obj.roleID = null;
		}
		if (request_obj.userName === undefined) {

			request_obj.userName = null;
		}
		if (request_obj.userID === undefined) {

			request_obj.userID = null;
		}
		console.log(request_obj, "reqOBJ");
		this.UserRoleAgentID_MappingService.getEmployees(request_obj).subscribe(response => this.getEmployeesSuccessHandeler(response));
	}

	getEmployeesSuccessHandeler(response) {
		console.log(response, 'employees fetched as per condition');
		if(response)
		{
			this.searchResultArray = response.filter(function (obj) {
				return obj.uSRMDeleted == false && obj.roleName != 'ProviderAdmin';
			});

			this.showTableFlag=true;
		}
	}


	openMappingModal(obj)
	{
		let dialog_Ref = this.dialog.open(AgentIDMappingModal, {
			height: '500px',
			width: '500px',
			data: obj
		});

		dialog_Ref.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
			if (result === "success") {
				this.searchEmployee(this.state,this.service,this.role,undefined,undefined);
			}

		});

	}

}

@Component({
	selector: 'agent-id-mapping-modal',
	templateUrl: './agent-id-mapping-modal.html'
})
export class AgentIDMappingModal {

	/*ngModels*/
	providerServiceMapID:any;
	agentPassword:any;

	employeeName:any;
	service:any;
	role:any;

	campaign:any;
	agentID:any;

	campaigns:any=[];
	agentIDs:any=[];

	constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
	            public UserRoleAgentID_MappingService: UserRoleAgentID_MappingService,
	            public commonDataService:dataService,
	            public dialogReff: MdDialogRef<AgentIDMappingModal>) {
		
	}

	ngOnInit()
	{
		console.log("dialog data",this.data);
		this.employeeName=this.data.firstName+" "+this.data.middleName+" "+this.data.lastName;
		this.service=this.data.serviceName;
		this.role=this.data.roleName;

		this.providerServiceMapID=this.data.providerServiceMapID;

		if(this.providerServiceMapID!=undefined)
		{
			this.UserRoleAgentID_MappingService.getAvailableCampaigns(this.providerServiceMapID)
			.subscribe(response=>this.getAvailableCampaignsSuccessHandeler(response));
		}
		

	}

	getAvailableCampaignsSuccessHandeler(response)
	{
		if(response)
		{
			this.campaigns=response;
			console.log(response);
		}
	}


	getAgentIDs(campaign_name)
	{
		this.UserRoleAgentID_MappingService.getAgentIDs(this.providerServiceMapID,campaign_name)
		.subscribe(response=>this.getAgentIDsSuccessHandeler(response));
	}

	getAgentIDsSuccessHandeler(response)
	{
		if(response)
		{
			console.log("agentIDs",response);
			this.agentIDs=response;
		}
	}

	setAgentPassword(agentPassword)
	{
		this.agentPassword=agentPassword;
	}


	mapAgentID(agentID)
	{
		let req_array=[{
			"uSRMappingID" : this.data.uSRMappingID,
			"agentID" : agentID,
			"agentPassword":this.agentPassword
		}];

		this.UserRoleAgentID_MappingService.mapAgentID(req_array)
		.subscribe(response=>this.mapAgentIDSuccessHandeler(response));
	}


	mapAgentIDSuccessHandeler(response)
	{
		if(response)
		{
			this.dialogReff.close("success");
		}
	}


	/*
	SAVE req obj
	[
		{ "uSRMappingID" : 947, "agentID" : "2001", "agentPassword":"jara" },

		{ "uSRMappingID" : 948, "agentID" : "2002", "agentPassword":"hai" }
		]*/



	}
