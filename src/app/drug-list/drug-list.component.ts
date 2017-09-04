import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html'
})
export class DrugListComponent implements OnInit {

  showdrugs:any = true;
  availabledrugs:any =[];
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
    this.showdrugs = false;
  }

  drugObj:any ;
  // = {
	// 	'drug':'',
  //   'drugDesc':'',
  //   'providerServiceMapID':'',
  //   'createdBy':''
	// };
  drugList:any= [];
  addDrugToList(values){
    this.drugObj = {};
    this.drugObj.drug = values.drugName;
    this.drugObj.drugDesc = values.drugDesc;
    this.drugObj.remarks =  values.remarks;
    this.drugObj.providerServiceMapID = this.providerServiceMapID;
    this.drugObj.createdBy = "System";

    this.drugList.push(this.drugObj);
    console.log(this.drugList);
  }

  storedrug(){
    console.log(this.drugList);
  }

}