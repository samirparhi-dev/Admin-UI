import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-drug-group',
  templateUrl: './drug-group.component.html'
})
export class DrugGroupComponent implements OnInit {

  showDrugGroups:any = true;
  availableDrugGroups:any =[];
  data:any;
  providerServiceMapID:any;
  provider_states:any;
  provider_services:any;
  service_provider_id:any;

  constructor(public providerAdminRoleService: ProviderAdminRoleService,
              public commonDataService: dataService) { 
    this.data = [];
    this.service_provider_id =this.commonDataService.service_providerID;
   }

  ngOnInit() {
    this.getStates();
   
  }

  stateSelection(stateID){
    debugger;
    this.getServices(stateID);
  }
  getAvailableDrugs(){
    
  }

  getServices(stateID)
	{
		this.providerAdminRoleService.getServices(this.service_provider_id,stateID).subscribe(response => this.getServicesSuccessHandeler(response));
	}

  getStates(){
    this.providerAdminRoleService.getStates(this.service_provider_id).subscribe(response=>this.getStatesSuccessHandeler(response));
  }
  
  getStatesSuccessHandeler(response)
	{
		this.provider_states = response;
	}

	getServicesSuccessHandeler(response) {
		this.provider_services = response;
    for(let provider_service of this.provider_services){
      if("104"==provider_service.serviceName){
         this.providerServiceMapID = this.provider_services.providerServiceMapID;
      }
    } 
	}

  

  responseHandler(response){
    this.data = response;
  }
  

  showForm(){
    this.showDrugGroups = false;
  }

  drugGroupObj:any ;
  // = {
	// 	'drugGroup':'',
  //   'drugGroupDesc':'',
  //   'providerServiceMapID':'',
  //   'createdBy':''
	// };
  drugGroupList:any= [];
  addDrugGroupToList(values){
    this.drugGroupObj = {};
    this.drugGroupObj.drugGroup = values.drugGroup;
    this.drugGroupObj.drugGroupDesc = values.drugGroupDesc;
    this.drugGroupObj.providerServiceMapID = this.providerServiceMapID;
    this.drugGroupObj.createdBy = "System";

    this.drugGroupList.push(this.drugGroupObj);
    console.log(this.drugGroupList);
  }

  storeDrugGroup(){
    console.log(this.drugGroupList);
  }

}