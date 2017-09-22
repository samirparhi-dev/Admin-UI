import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { DrugMasterService } from '../services/ProviderAdminServices/drug-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-drug-group',
  templateUrl: './drug-group.component.html'
})
export class DrugGroupComponent implements OnInit {

  showDrugGroups:any = true;
  availableDrugGroups:any = [];
  data:any;
  providerServiceMapID:any;
  provider_states:any;
  provider_services:any;
  service_provider_id:any;
  showPaginationControls:any = true;
  editable:any = false;
  availableDrugGroupNames:any = [];
  serviceID104:any;

  constructor(public providerAdminRoleService: ProviderAdminRoleService,
              public commonDataService: dataService,
              public drugMasterService:DrugMasterService,
              private alertMessage: ConfirmationDialogsService) { 
    this.data = [];
    this.service_provider_id =this.commonDataService.service_providerID;
    this.serviceID104 = this.commonDataService.serviceID104;
   }

  ngOnInit() {
    this.getAvailableDrugs();
    this.getStatesByServiceID();
   
  }

  stateSelection(stateID){
    this.getServices(stateID);
  }

  getAvailableDrugs(){
    this.drugMasterService.getDrugGroups({}).subscribe(response => this.getDrugGroupsSuccessHandeler(response));
  }

  getDrugGroupsSuccessHandeler(response){
    this.availableDrugGroups = response;
    for(let availableDrugGroup of this.availableDrugGroups){
      this.availableDrugGroupNames.push(availableDrugGroup.drugGroup);
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
    for(let provider_service of this.provider_services){
      if("104"==provider_service.serviceName){
        this.drugGroupObj = {};
        this.drugGroupObj.drugGroup = values.drugGroup;
        this.drugGroupObj.drugGroupDesc = values.drugGroupDesc;

         this.drugGroupObj.providerServiceMapID =  provider_service.providerServiceMapID;
         this.drugGroupObj.stateName = provider_service.stateName;

        this.drugGroupObj.createdBy = "System";

        this.drugGroupList.push(this.drugGroupObj);
     }
    } 
    if(this.drugGroupList.length<=0){
        this.alertMessage.alert("No Service available with the state selected");
    }
  }

  storeDrugGroup(){
    let obj = {"drugGroups":this.drugGroupList};
    this.drugMasterService.saveDrugGroups(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

  successHandler(response){
    this.drugGroupList =  [];
    this.alertMessage.alert("Drug Groups stored successfully");
    this.getAvailableDrugs();
  }
  dataObj:any ={};
  updateDrugGroupStatus(drugGroup){
   
    this.dataObj ={};
    this.dataObj.drugGroupID = drugGroup.drugGroupID;
    this.dataObj.deleted = !drugGroup.deleted;
    this.dataObj.modifiedBy = "Admin";
    this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));
     drugGroup.deleted = !drugGroup.deleted;
     
  }

  updateStatusHandler(response){
    console.log("Drug Group status changed");
  }

  drugGroupID:any;
  drugGroup:any;
  drugGroupDesc:any;
  stateID:any;
  
  initializeObj() {
        this.drugGroupID = "";
        this.drugGroup = "";
        this.drugGroupDesc = "";
        this.stateID = "";
    }
  editDrugGroup(drug){
    this.drugGroupID = drug.drugGroupID;
    this.drugGroup = drug.drugGroup
    this.drugGroupDesc = drug.drugGroupDesc;
    this.stateID = drug.m_providerServiceMapping.state.stateID;
    this.editable = true;
  }

  updateDrugGroup(drugGroup){
    this.dataObj ={};
    this.dataObj.drugGroupID = drugGroup.drugGroupID;
    this.dataObj.drugGroup = drugGroup.drugGroup;
    this.dataObj.drugGroupDesc = drugGroup.drugGroupDesc;
    this.dataObj.providerServiceMapID = drugGroup.providerServiceMapID;
    this.dataObj.modifiedBy = "Admin";
    this.drugMasterService.updateDrugGroup(this.dataObj).subscribe(response => this.updateHandler(response));
    
  }

  updateHandler(response){
    this.editable = false;
    this.alertMessage.alert("updated successfully");
    this.getAvailableDrugs();
  }

  groupNameExist :any = false;
  checkExistance(drugGroup){
    this.groupNameExist = this.availableDrugGroupNames.includes(drugGroup);
  }
  clearEdit(){
    this.initializeObj();
    this.showDrugGroups = true;
    this.editable=false;
    this.groupNameExist=false;
  }
  

}