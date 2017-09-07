import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { DrugMasterService } from '../services/ProviderAdminServices/drug-master-services.service';

@Component({
  selector: 'app-drug-mapping',
  templateUrl: './drug-mapping.component.html'
})
export class DrugMappingComponent implements OnInit {

  showMappings:any = true;
  availableDrugs:any =[];
  data:any;
  providerServiceMapID:any;
  provider_states:any;
  provider_services:any;
  service_provider_id:any;
  editable:any = false;
  constructor(public providerAdminRoleService: ProviderAdminRoleService,
              public commonDataService: dataService,
              public drugMasterService:DrugMasterService) { 
    this.data = [];
    this.service_provider_id =this.commonDataService.service_providerID;
   }

  ngOnInit() {
    this.getStates();
    this.getAvailableMappings();
  }

  stateSelection(stateID){
    this.getServices(stateID);
  }
  getAvailableMappings(){
    this.drugMasterService.getDrugsList().subscribe(response => this.getDrugsSuccessHandeler(response));
  }

  getDrugsSuccessHandeler(response){
    this.availableDrugs = response;
    console.log(this.availableDrugs);
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
    this.showMappings = false;
  }

  drugObj:any ;
  // = {
	// 	'drug':'',
  //   'drugDesc':'',
  //   'providerServiceMapID':'',
  //   'createdBy':''
	// };
  drugMapping:any= [];
  addDrugToList(values){
    this.drugObj = {};
    this.drugObj.drugName = values.drugName;
    this.drugObj.drugDesc = values.drugDesc;
    this.drugObj.remarks =  values.remarks;
     for(let provider_service of this.provider_services){
      if("104"==provider_service.serviceName){
         this.drugObj.providerServiceMapID =  provider_service.providerServiceMapID;
      }
    } 
    
    this.drugObj.createdBy = "System";

    this.drugMapping.push(this.drugObj);
    console.log(this.drugMapping);
  }

  storedrug(){
    console.log(this.drugMapping);
    let obj = {"drugMasters":this.drugMapping};
    this.drugMasterService.saveDrugs(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

   successHandler(response){
    this.drugMapping =  [];
    alert("drugs saved");
    this.getAvailableMappings();
  }

  dataObj:any ={};
  updateDrugStatus(drug){
   
    this.dataObj ={};
    this.dataObj.drugID = drug.drugID;
    this.dataObj.deleted = !drug.deleted;
    this.dataObj.modifiedBy = "Admin";
    this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(response => this.updateHandler(response));
    
    drug.deleted = !drug.deleted;

  }

  updateHandler(response){
    alert(response);
  }

  updateDrugData(drug){
    this.dataObj ={};
    this.dataObj.drugName = drug.drugName;
    this.dataObj.drugDesc = drug.drugDesc;
    this.dataObj.remarks = drug.remarks;
    this.dataObj.providerServiceMapID = drug.providerServiceMapID;
    this.dataObj.modifiedBy = "Admin";
    this.drugMasterService.updateDrugDataURL(this.dataObj).subscribe(response => this.updateHandler(response));

  }

}