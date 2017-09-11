import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { DrugMasterService } from '../services/ProviderAdminServices/drug-master-services.service';

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
  constructor(public providerAdminRoleService: ProviderAdminRoleService,
              public commonDataService: dataService,
              public drugMasterService:DrugMasterService) { 
    this.data = [];
    this.service_provider_id =this.commonDataService.service_providerID;
   }

  ngOnInit() {
    this.getAvailableDrugs();
    this.getStates();
   
  }

  stateSelection(stateID){
    this.getServices(stateID);
  }
  getAvailableDrugs(){
    this.drugMasterService.getDrugGroups().subscribe(response => this.getDrugGroupsSuccessHandeler(response));
  }

  getDrugGroupsSuccessHandeler(response){
    this.availableDrugGroups = response;
    console.log(this.availableDrugGroups);
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
    debugger;
    this.drugGroupObj = {};
    this.drugGroupObj.drugGroup = values.drugGroup;
    this.drugGroupObj.drugGroupDesc = values.drugGroupDesc;

    for(let provider_service of this.provider_services){
      if("104"==provider_service.serviceName){
         this.drugGroupObj.providerServiceMapID =  provider_service.providerServiceMapID;
         this.drugGroupObj.stateName = provider_service.stateName;
      }
    } 
    
    this.drugGroupObj.createdBy = "System";

    this.drugGroupList.push(this.drugGroupObj);
    console.log(this.drugGroupList);
  }

  storeDrugGroup(){
    console.log(this.drugGroupList);

    let obj = {"drugGroups":this.drugGroupList};
    this.drugMasterService.saveDrugGroups(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

  successHandler(response){
    this.drugGroupList =  [];
    alert("drug group saved");
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
    alert("Drug Status Changed");
  }

  drugGroupID:any;
  drugGroup:any;
  drugGroupDesc:any;
  stateID:any;
  
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
    alert("updated successfully");
    this.getAvailableDrugs();
  }

  groupNameExist :any = false;
  checkExistance(drugGroup){
    this.groupNameExist = this.availableDrugGroupNames.includes(drugGroup);
    console.log(this.groupNameExist);
  }

}