import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { DrugMasterService } from '../services/ProviderAdminServices/drug-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

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
  serviceID104:any;
  createdBy:any;
  constructor(public providerAdminRoleService: ProviderAdminRoleService,
              public commonDataService: dataService,
              public drugMasterService:DrugMasterService,
              private alertMessage: ConfirmationDialogsService) { 
    this.data = [];
    this.service_provider_id =this.commonDataService.service_providerID;
    this.serviceID104 = this.commonDataService.serviceID104;
    this.createdBy = this.commonDataService.uname;
   }

  ngOnInit() {
    this.getStatesByServiceID();
    this.getAvailableDrugs();
  }

  stateSelection(stateID){
    this.getServices(stateID);
  }
  getAvailableDrugs(){
    this.drugObj = {};
    this.drugObj.serviceProviderID = this.service_provider_id;
    this.drugMasterService.getDrugsList(this.drugObj).subscribe(response => this.getDrugsSuccessHandeler(response));
  }

  getDrugsSuccessHandeler(response){
    this.availableDrugs = response;

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
  
  getStatesByServiceID(){
    this.drugMasterService.getStatesByServiceID(this.serviceID104,this.service_provider_id).subscribe(response=>this.getStatesSuccessHandeler(response));
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
    //  for(let provider_service of this.provider_services){
    //   if("104"==provider_service.serviceName){
    //      this.drugObj.providerServiceMapID =  provider_service.providerServiceMapID;
    //      this.drugObj.stateName = provider_service.stateName;
    //   }
    // } 
    this.drugObj.serviceProviderID =  this.service_provider_id;
    this.drugObj.createdBy = this.createdBy;

    this.drugList.push(this.drugObj);

  }

  storedrug(){
    let obj = {"drugMasters":this.drugList};
    this.drugMasterService.saveDrugs(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

   successHandler(response){
    this.drugList =  [];
    this.alertMessage.alert("Drugs stored successfully");
    this.getAvailableDrugs();
  }

  dataObj:any ={};
  updateDrugStatus(drug){
   
    this.dataObj ={};
    this.dataObj.drugID = drug.drugID;
    this.dataObj.deleted = !drug.deleted;
    this.dataObj.modifiedBy = this.createdBy;
    this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));
    
    drug.deleted = !drug.deleted;

  }
  updateStatusHandler(response){
    console.log("Drug status changed");
    this.alertMessage.alert("Drug status changed");
  }

  drugID:any;
  drugName:any;
  drugDesc:any;
  remarks:any;
  stateID:any;
  initializeObj() {
        this.drugID = "";
        this.drugName = "";
        this.drugDesc = "";
        this.remarks = "";
        this.stateID = "";
    }
  editDrugData(drug){
    this.drugID = drug.drugID;
    this.drugName = drug.drugName
    this.drugDesc = drug.drugDesc;
    this.remarks = drug.remarks;
    //this.stateID = drug.m_providerServiceMapping.state.stateID;
    this.editable = true;
  }

  updateDrugData(drug){
    this.dataObj ={};
    this.dataObj.drugID = drug.drugID;
    this.dataObj.drugName = drug.drugName;
    this.dataObj.drugDesc = drug.drugDesc;
    this.dataObj.remarks = drug.remarks;
    this.dataObj.providerServiceMapID = drug.providerServiceMapID;
    this.dataObj.modifiedBy = this.createdBy;
    this.drugMasterService.updateDrugData(this.dataObj).subscribe(response => this.updateHandler(response));
    
  }

  updateHandler(response){
    this.editable = false;
    this.alertMessage.alert("Updated successfully");
    this.getAvailableDrugs();
  }

  drugNameExist :any = false;
  checkExistance(drugName){
    this.drugNameExist = this.availableDrugNames.includes(drugName);
  }

  clearEdit(){
    this.initializeObj();
    this.showDrugs = true;
    this.editable=false;
    this.drugNameExist=false;
  }

}