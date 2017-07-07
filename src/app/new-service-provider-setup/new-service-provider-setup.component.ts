import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-service-provider-setup',
  templateUrl: './new-service-provider-setup.component.html',
  styleUrls: ['./new-service-provider-setup.component.css']
})
export class NewServiceProviderSetupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  show1: boolean = true;
  show2: boolean = false;
  show3: boolean = false;

  show(val:number)
  {
  	if(val==2)
  	{
		this.show1= false;
		this.show2= true;
		this.show3= false;
  	}
  	if(val==3)
  	{
		this.show1= false;
		this.show2= false;
		this.show3= true;
  	}
  }

  // section 1


  // section 2


  // section 3

  state: any = "";
  service: any = "";

  showTable: boolean = false;

  services_in_state: any = [];
  addServicesToState(service)
  {
	  
	  if (!this.services_in_state.includes(service))
	  {
		  this.services_in_state.push(service);
	  }
	 
  }
  removeServicesFromState(index)
  {
	  this.services_in_state.splice(index, 1);
  }

  state_service_array: any = [];
  add_2_state_service_array(state,services)
  {
  	let data_obj={
  		"state":state,
  		"services":services
  	}
		/** NOTE
		if services are already mentioned for that state in that transaction,
		dont add it in the  'state_service_array'
`		*/
		

		/** if the state_service_array is not empty, CHECK if that has an OBJ 
		for a particular state
		*/
		if (this.state_service_array.length>0)   
		{
			let count = 0;
			for (var i = 0; i < this.state_service_array.length; i++) {
				if (this.state_service_array[i].state === state) {
					count = count + 1;
				}
			}
			/** counter will not increase if an obj for that state is not there*/
			if(count===0)
			{
				this.state_service_array.push(data_obj);
			}
		}
		/** if blank array enter it as it is */
		else{
			this.state_service_array.push(data_obj);

		}


		/** once data is pushed in the table array..do the following */

		this.services_in_state = [];
		this.state = "";
		this.service = "";
		this.showTable = true;
  }
  remove_from_state_service_array(index){
	  this.state_service_array.splice(index,1);
	  if (this.state_service_array.length==0)
	  {
		  this.showTable = false;
	  }

  }

}
