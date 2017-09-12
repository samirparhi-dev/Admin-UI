import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { DrugMasterService } from '../services/ProviderAdminServices/drug-master-services.service';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html'
})
export class DrugListComponent implements OnInit {

  showDrugs:any = true;
  availableDrugs:any =[];
  data:any;
  providerServiceMapID:any;
  provider_states:any;
  provider_services:any;
  service_provider_id:any;
  editable:any = false;
  availableDrugNames:any = [];

  constructor(public providerAdminRoleService: ProviderAdminRoleService,
              public commonDataService: dataService,
              public drugMasterService:DrugMasterService) { 
    this.data = [];
    this.service_provider_id =this.commonDataService.service_providerID;
   }

  ngOnInit() {
    this.getStates();
    this.getAvailableDrugs();
  }

  stateSelection(stateID){
    this.getServices(stateID);
  }
  getAvailableDrugs(){
    this.drugMasterService.getDrugsList().subscribe(response => this.getDrugsSuccessHandeler(response));
  }

  getDrugsSuccessHandeler(response){
    this.availableDrugs = response;
    console.log(this.availableDrugs);
    for(let availableDrug of this.availableDrugs){
      this.availableDrugNames.push(availableDrug.drugName);
    }
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
         this.providerServiceMapID = provider_service.providerServiceMapID;
      }
    } 
	}

  

  responseHandler(response){
    this.data = response;
  }
  

  showForm(){
    this.showDrugs = false;
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
    this.drugObj.drugName = values.drugName;
    this.drugObj.drugDesc = values.drugDesc;
    this.drugObj.remarks =  values.remarks;
     for(let provider_service of this.provider_services){
      if("104"==provider_service.serviceName){
         this.drugObj.providerServiceMapID =  provider_service.providerServiceMapID;
         this.drugObj.stateName = provider_service.stateName;
      }
    } 
    
    this.drugObj.createdBy = "System";

    this.drugList.push(this.drugObj);
    console.log(this.drugList);
  }

  storedrug(){
    console.log(this.drugList);
    let obj = {"drugMasters":this.drugList};
    this.drugMasterService.saveDrugs(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

   successHandler(response){
    this.drugList =  [];
    alert("drugs saved");
    this.getAvailableDrugs();
  }

  dataObj:any ={};
  updateDrugStatus(drug){
   
    this.dataObj ={};
    this.dataObj.drugID = drug.drugID;
    this.dataObj.deleted = !drug.deleted;
    this.dataObj.modifiedBy = "Admin";
    this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));
    
    drug.deleted = !drug.deleted;

  }
  updateStatusHandler(response){
    alert("Drug Status Changed");
  }

  drugID:any;
  drugName:any;
  drugDesc:any;
  remarks:any;
  stateID:any;
  
  editDrugData(drug){
    this.drugID = drug.drugID;
    this.drugName = drug.drugName
    this.drugDesc = drug.drugDesc;
    this.remarks = drug.remarks;
    this.stateID = drug.m_providerServiceMapping.state.stateID;
    this.editable = true;
  }

  updateDrugData(drug){
    this.dataObj ={};
    this.dataObj.drugID = drug.drugID;
    this.dataObj.drugName = drug.drugName;
    this.dataObj.drugDesc = drug.drugDesc;
    this.dataObj.remarks = drug.remarks;
    this.dataObj.providerServiceMapID = drug.providerServiceMapID;
    this.dataObj.modifiedBy = "Admin";
    this.drugMasterService.updateDrugData(this.dataObj).subscribe(response => this.updateHandler(response));
    
  }

  updateHandler(response){
    this.editable = false;
    alert("updated successfully");
    this.getAvailableDrugs();
  }

  drugNameExist :any = false;
  checkExistance(drugName){
    this.drugNameExist = this.availableDrugNames.includes(drugName);
    console.log(this.drugNameExist);
  }


}