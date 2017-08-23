import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';


@Component({
  selector: 'app-provider-admin-role-master',
  templateUrl: './provider-admin-role-master.component.html',
  styleUrls: ['./provider-admin-role-master.component.css']
})
export class ProviderAdminRoleMasterComponent implements OnInit {
	role: any;
	description: any;

	serviceProviderID: any;
	provider_service_mapID: any;

	state: any;
	service: any;


	toBeEditedRoleObj: any;
	

	// arrays
	states: any;
	services: any;
	searchresultarray: any;

	objs: any = [];
	finalResponse: any;


	STATE_ID: any;
	SERVICE_ID: any;

	features: any = [{ "featureName": "RO" }, { "featureName": "HAO" }, { "featureName": "MO" }, { "featureName": "CO" }, { "featureName": "SIO" }];


	// flags
	showRoleCreationForm: boolean = false;
	setEditSubmitButton: boolean = false;
	showAddButtonFlag: boolean = false;

	constructor(public ProviderAdminRoleService: ProviderAdminRoleService,
				public commonDataService: dataService) 
	{
		this.role = "";
		this.description = "";

		// provide service provider ID, (As of now hardcoded, but to be fetched from login response)
		this.serviceProviderID =(this.commonDataService.service_providerID).toString();

		// array initialization
		this.states = [];
		this.services = [];
		this.searchresultarray = [];
		

		}

	ngOnInit() {
		this.ProviderAdminRoleService.getStates(this.serviceProviderID).subscribe(response=>this.states=this.successhandeler(response));
	}

	getServices(stateID) {
		console.log(this.serviceProviderID,stateID);
		this.ProviderAdminRoleService.getServices(this.serviceProviderID, stateID).subscribe(response => this.servicesSuccesshandeler(response));
	}

	setProviderServiceMapID(ProviderServiceMapID)
	{
		this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
	}

	servicesSuccesshandeler(response)
	{
		this.services = response;

	}

	findRoles(stateID, serviceID) {
		this.STATE_ID = stateID;
		this.SERVICE_ID = serviceID;

		console.log(this.serviceProviderID, stateID,serviceID);
		this.ProviderAdminRoleService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe(response => this.searchresultarray = this.fetchRoleSuccessHandeler(response));
	
	}

	finalsave() {
		console.log(this.objs);
		this.ProviderAdminRoleService.createRoles(this.objs).subscribe(response => this.createRolesSuccessHandeler(response));
		
	}

	deleteRole(roleID)
	{
		let confirmation=confirm("Do you really want to delete the role with id:"+roleID+"?");
		if(confirmation)
		{
			this.ProviderAdminRoleService.deleteRole(roleID).subscribe(response => this.edit_delete_RolesSuccessHandeler(response));	
		}
		
	}

	editRole(roleObj)
	{
		this.setRoleFormFlag(true);
		this.role = roleObj.roleName;
		this.description = roleObj.roleDesc;
		this.setEditSubmitButton = true;

		this.toBeEditedRoleObj = roleObj;
	}

	saveEditChanges()
	{
		let obj = {
			"roleID": this.toBeEditedRoleObj.roleID,
			"roleName": this.role,
			"roleDesc": this.description,
			"providerServiceMapID": this.toBeEditedRoleObj.providerServiceMapID,
			"createdBy": "Diamond Khanna",
			"createdDate": "2017-07-25T00:00:00.000Z"
		}

		// console.log(JSON.stringify(this.toBeEditedRoleObj));
		this.ProviderAdminRoleService.editRole(obj).subscribe(response => this.edit_delete_RolesSuccessHandeler(response));
	}

	edit_delete_RolesSuccessHandeler(response)
	{
		console.log(response, "edit/delete response");
		this.showRoleCreationForm=false;
		this.setEditSubmitButton=false;
		this.findRoles(this.STATE_ID, this.SERVICE_ID);
		this.role = "";
		this.description = "";
	}

	successhandeler(response)
	{
		console.log(response.stateID,"in component.ts");
		return response;
	}

	fetchRoleSuccessHandeler(response)
	{
		console.log(response, "in fetch role success in component.ts");
		this.showAddButtonFlag = true;
		return response;

	}

	createRolesSuccessHandeler(response) {
		console.log(response, "in create role success in component.ts");
		this.finalResponse = response;
		if (this.finalResponse[0].roleID)
		{
			this.objs = []; //empty the buffer array
			this.setRoleFormFlag(false);
			this.findRoles(this.STATE_ID, this.SERVICE_ID);
		}
		
	}


  setRoleFormFlag(flag)
  {
	this.showRoleCreationForm = flag;
  }

  add_obj(role,desc,feature)
  {
	var result = this.validateRole(role);
  	if(result)
  	{
			let count = 0;
			if(this.objs.length<1)
			{	
				let obj = {
					"roleName": role,
					"roleDesc": desc,
					"feature":feature,
					"createdBy":"diamond",
					"createdDate":"2017-07-28",
					"providerServiceMapID": this.commonDataService.provider_serviceMapID    // this needs to be fed dynmically!!!
				};
				this.objs.push(obj);

			}
			else
			{
				for (let i = 0; i < this.objs.length; i++) {
					if (this.objs[i].roleName === role) {
						count = count + 1;
					}
				}
				if(count<1)
				{
					let obj = {
						"roleName": role,
						"roleDesc": desc,
						"createdBy": "diamond",
						"createdDate": new Date(),
						"providerServiceMapID": this.commonDataService.provider_serviceMapID   //this needs to be fed dynmically!!!
					};
					this.objs.push(obj);
				}
			}
		}
		this.role = "";
		this.description = "";
  }

	validateRole(role) {
		var count = 0;
		for (let i = 0; i < this.searchresultarray.length; i++) {
			if (this.searchresultarray[i].roleName === role) {
				count = count + 1;
			}
		}
		console.log(count);
		if (count > 0) {
			return false;
		}
		else {
			return true;
		}
	}

  remove_obj(index)
  {
	  this.objs.splice(index, 1);
  }

}
