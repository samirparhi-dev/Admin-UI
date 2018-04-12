import { Component, OnInit, Inject } from '@angular/core';
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
  userID: any;
  serviceProviderID: any;

  state: any;
  service: any;
  role: any;

  /*arrays*/
  states: any = [];
  services: any = [];
  roles: any = [];

  searchResultArray: any = [];

  /*flags*/
  showTableFlag = false;
  isNational = false;

  constructor(public _UserRoleAgentID_MappingService: UserRoleAgentID_MappingService,
    public commonDataService: dataService,
    public dialog: MdDialog) {
    this.serviceProviderID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.getServices(this.userID);
  }

  setIsNational(value) {
    this.isNational = value;
  }

  getStates(serviceID, isNational) {
    this._UserRoleAgentID_MappingService.getStates(this.userID, serviceID, isNational)
      .subscribe(response => this.getStatesSuccessHandeler(response, isNational));

  }

  clear() {
    this.state = "";
    this.service = "";
    this.role = "";


    this.states = [];
    this.roles = [];

    this.searchResultArray = [];
    this.showTableFlag = false;
  }

  getStatesSuccessHandeler(response, isNational) {
    this.state = '';
    this.states = [];
    this.roles = [];
    this.role = '';
    console.log("STATE", response);
    this.states = response;

    if (isNational) {
      this.getRoles(this.states[0].providerServiceMapID);
    }
  }

  getServices(userID) {

    this._UserRoleAgentID_MappingService.getServices(userID)
      .subscribe(response => this.getServicesSuccessHandeler(response));
  }

  getServicesSuccessHandeler(response) {
    console.log("SERVICES", response);
    this.services = response;
  }

  getRoles(providerServiceMapID) {
    this._UserRoleAgentID_MappingService.getRoles(providerServiceMapID)
      .subscribe(response => this.rolesSuccesshandeler(response));
  }

  rolesSuccesshandeler(response) {

    if (response.length == 0) {
      console.log("No Roles Found");
    }
    this.roles = response.filter(function (obj) {
      return obj.deleted == false;
    });
    console.log(response, 'roles of provider for that state');

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
    if (request_obj.pSMStateID === undefined || request_obj.pSMStateID === "") {
      request_obj.pSMStateID = null;
    }
    if (request_obj.serviceID === undefined || request_obj.pSMStateID === "") {
      request_obj.serviceID = null;
    }
    if (request_obj.roleID === undefined || request_obj.pSMStateID === "") {

      request_obj.roleID = null;
    }
    if (request_obj.userName === undefined) {

      request_obj.userName = null;
    }
    if (request_obj.userID === undefined) {

      request_obj.userID = null;
    }
    console.log(request_obj, "reqOBJ");
    this._UserRoleAgentID_MappingService.getEmployees(request_obj).subscribe(response => this.getEmployeesSuccessHandeler(response));
  }

  getEmployeesSuccessHandeler(response) {
    console.log(response, 'employees fetched as per condition');
    if (response) {
      this.searchResultArray = response.filter(function (obj) {
        return obj.uSRMDeleted == false && obj.roleName != 'ProviderAdmin';
      });

      this.showTableFlag = true;
    }
  }


  openMappingModal(obj) {
    let dialog_Ref = this.dialog.open(AgentIDMappingModal, {
      height: '500px',
      width: '500px',
      data: obj
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.searchEmployee(this.state, this.service, this.role, undefined, undefined);
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
  providerServiceMapID: any;
  agentPassword: any;
  usrAgentMappingID: any;

  employeeName: any;
  service: any;
  role: any;

  campaign: any;
  agentID: any;
  oldAgentID: any;

  campaigns: any = [];
  agentIDs: any = [];

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public _UserRoleAgentID_MappingService: UserRoleAgentID_MappingService,
    public commonDataService: dataService,
    public dialogReff: MdDialogRef<AgentIDMappingModal>) {

  }

  ngOnInit() {
    console.log("dialog data", this.data);
    this.employeeName = this.data.firstName + " " + this.data.middleName + " " + this.data.lastName;
    this.service = this.data.serviceName;
    this.role = this.data.roleName;

    this.oldAgentID = this.data.agentID;

    this.providerServiceMapID = this.data.providerServiceMapID;

    if (this.providerServiceMapID != undefined) {
      this._UserRoleAgentID_MappingService.getAvailableCampaigns(this.providerServiceMapID)
        .subscribe(response => this.getAvailableCampaignsSuccessHandeler(response));
    }


  }

  getAvailableCampaignsSuccessHandeler(response) {
    if (response) {
      this.campaigns = response;
      console.log(response);
    }
  }


  getAgentIDs(campaign_name) {
    this._UserRoleAgentID_MappingService.getAgentIDs(this.providerServiceMapID, campaign_name)
      .subscribe(response => this.getAgentIDsSuccessHandeler(response));
  }

  getAgentIDsSuccessHandeler(response) {
    if (response) {
      console.log("agentIDs", response);
      this.agentIDs = response;
    }
  }

  setAgentPassword_usrAgentMappingID(agentPassword, usrAgentMappingID) {
    this.agentPassword = agentPassword;
    this.usrAgentMappingID = usrAgentMappingID;
  }


  mapAgentID(agentID) {
    let req_array = [{
      "uSRMappingID": this.data.uSRMappingID,
      "agentID": agentID,
      "agentPassword": this.agentPassword,
      "usrAgentMappingID": this.usrAgentMappingID,
      "isAvailable": "false",
      "oldAgentID": this.oldAgentID,
      "providerServiceMapID": this.providerServiceMapID

    }];

    this._UserRoleAgentID_MappingService.mapAgentID(req_array)
      .subscribe(response => this.mapAgentIDSuccessHandeler(response));
  }


  mapAgentIDSuccessHandeler(response) {
    if (response) {
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
