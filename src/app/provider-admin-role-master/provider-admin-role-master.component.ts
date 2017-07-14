import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';

@Component({
  selector: 'app-provider-admin-role-master',
  templateUrl: './provider-admin-role-master.component.html',
  styleUrls: ['./provider-admin-role-master.component.css']
})
export class ProviderAdminRoleMasterComponent implements OnInit {
	role: any;
	description: any;

	serviceProviderID: any;

	// arrays
	states: any;
	services: any;
	searchresultarray: any;

	objs: any = [];
	finalResponse: any;


	// flags
	showRoleCreationForm: boolean = false;

	constructor(public ProviderAdminRoleService: ProviderAdminRoleService) {
		this.role = "";
		this.description = "";

		// provide service provider ID, (As of now hardcoded, but to be fetched from login response)
		this.serviceProviderID = "1";

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
		this.ProviderAdminRoleService.getServices(this.serviceProviderID, stateID).subscribe(response => this.services = this.successhandeler(response));
	}

	findRoles(stateID, serviceID) {
		console.log(this.serviceProviderID, stateID,serviceID);
		this.ProviderAdminRoleService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe(response => this.searchresultarray = this.fetchRoleSuccessHandeler(response));
	
	}

	finalsave() {
		console.log(this.objs);
		this.ProviderAdminRoleService.createRoles(this.objs).subscribe(response => this.createRolesSuccessHandeler(response));
		
	}

	successhandeler(response)
	{
		console.log(response,"in component.ts");
		return response;
	}

	fetchRoleSuccessHandeler(response)
	{
		console.log(response, "in fetch role success in component.ts");
		return response;

	}

	createRolesSuccessHandeler(response) {
		console.log(response, "in create role success in component.ts");
		this.finalResponse = response;
		if (this.finalResponse === "data Save SuccessFully")
		{
			this.objs = []; //empty the buffer array
			this.setRoleFormFlag(false);
			this.findRoles("1","6");
		}
		
	}



  


  
  setRoleFormFlag(flag)
  {
	this.showRoleCreationForm = flag;
  }

  add_obj(role,desc)
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
					"createdBy":"diamond",
					"createdDate":"2017-07-14",
					"providerServiceMapID": "1"
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
						"providerServiceMapID": "1"
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
