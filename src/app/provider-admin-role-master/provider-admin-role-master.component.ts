import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-admin-role-master',
  templateUrl: './provider-admin-role-master.component.html',
  styleUrls: ['./provider-admin-role-master.component.css']
})
export class ProviderAdminRoleMasterComponent implements OnInit {

  constructor() {
		this.role = "";
		this.description = ""; }

  ngOnInit() {
  }

	showTable: boolean = false;
	showRoleCreationForm: boolean = false;

	role: any;
	description: any;
  searchresultarray: any = [
  {
  	"role":"RO",
  	"description":"Registration Officer"
  },
  {
	"role": "MO",
	"description": "Medical Officer"
  }];


  findRoles(state, service)
  {
		this.showTable = true;
  }
	setRoleFormFlag(flag)
	{
		this.showRoleCreationForm = flag;
	}

  objs: any = [];

  validateRole(role)
  {
	  var count = 0;
	  for (let i = 0; i < this.searchresultarray.length;i++)
	  {
	  	if(this.searchresultarray[i].role===role)
	  	{
				count = count+1;
	  	}
	  }
	  console.log(count);
	  if(count>0)
	  {
		  return false;
	  }
	  else
	  {
		  return true;
	  }
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
					"role": role,
					"description": desc
				};
				this.objs.push(obj);

			}
			else
			{
				for (let i = 0; i < this.objs.length; i++) {
					if (this.objs[i].role === role) {
						count = count + 1;
					}
				}
				if(count<1)
				{
					let obj = {
						"role": role,
						"description": desc
					};
					this.objs.push(obj);
				}
			}
		}
		this.role = "";
		this.description = "";
  }

  remove_obj(index)
  {
	  this.objs.splice(index, 1);
  }

  finalsave()
  {
	  for (var i = 0; i < this.objs.length;i++)
	  {
		  this.searchresultarray.push(this.objs[i]);
	  }

	  this.objs = []; //empty the buffer array
		this.setRoleFormFlag(false);
  }

}
