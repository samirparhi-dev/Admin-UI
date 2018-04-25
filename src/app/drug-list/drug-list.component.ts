import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';
import { DrugMasterService } from '../services/ProviderAdminServices/drug-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html'
})
export class DrugListComponent implements OnInit {

  showDrugs = true;
  duplicateDrugs = false;
  availableDrugs: any = [];
  data: any;
  providerServiceMapID: any;
  provider_states: any;
  provider_services: any;
  service_provider_id: any;
  editable: any = false;
  availableDrugNames: any = [];
  serviceID104: any;
  createdBy: any;
  drugList: any = [];

  @ViewChild('drugForm') drugForm: NgForm;

  constructor(public providerAdminRoleService: ProviderAdminRoleService,
    public commonDataService: dataService,
    public drugMasterService: DrugMasterService,
    private alertMessage: ConfirmationDialogsService) {
    this.data = [];
    this.service_provider_id = this.commonDataService.service_providerID;
    this.serviceID104 = this.commonDataService.serviceID104;
    this.createdBy = this.commonDataService.uname;
  }

  ngOnInit() {
    this.getStatesByServiceID();
    this.getAvailableDrugs();
  }

  stateSelection(stateID) {
    this.getServices(stateID);
  }
  getAvailableDrugs() {
    this.drugObj = {};
    this.drugObj.serviceProviderID = this.service_provider_id;
    this.drugMasterService.getDrugsList(this.drugObj).subscribe(response => this.getDrugsSuccessHandeler(response), err => {
      this.alertMessage.alert(err, 'error');
    });
  }

  getDrugsSuccessHandeler(response) {
    this.availableDrugs = response;

    for (let availableDrug of this.availableDrugs) {
      this.availableDrugNames.push(availableDrug.drugName);
    }
  }

  getServices(stateID) {
    this.providerAdminRoleService.getServices(this.service_provider_id, stateID)
      .subscribe(response => this.getServicesSuccessHandeler(response), err => {
        this.alertMessage.alert(err, 'error');
      });
  }

  getStates() {
    this.providerAdminRoleService.getStates(this.service_provider_id)
      .subscribe(response => this.getStatesSuccessHandeler(response), err => {
        this.alertMessage.alert(err, 'error');
      });
  }

  getStatesByServiceID() {
    this.drugMasterService.getStatesByServiceID(this.serviceID104, this.service_provider_id)
      .subscribe(response => this.getStatesSuccessHandeler(response), err => {
        this.alertMessage.alert(err, 'error');
      });
  }

  getStatesSuccessHandeler(response) {
    this.provider_states = response;
  }

  getServicesSuccessHandeler(response) {
    this.provider_services = response;
    for (let provider_service of this.provider_services) {
      if ("104" == provider_service.serviceName) {
        this.providerServiceMapID = provider_service.providerServiceMapID;
      }
    }
  }

  // drugFilterList(formValues) {
  //   for (let i = 0; i < this.availableDrugs.length; i++) {
  //     if (this.availableDrugs[i].drugName === formValues.drugName
  //       && this.availableDrugs[i].providerServiceMapID === formValues.providerServiceMapID) {
  //       this.alertMessage.alert('This drug is already available');
  //       this.duplicateDrugs = true;
  //     }
  //   }
  //   return this.duplicateDrugs;
  // }


  responseHandler(response) {
    this.data = response;
  }


  showForm() {
    this.showDrugs = false;
  }

  drugObj: any;
  // = {
  // 	'drug':'',
  //   'drugDesc':'',
  //   'providerServiceMapID':'',
  //   'createdBy':''
  // };

  addDrugToList(values) {
    debugger;
   // if (!this.drugFilterList(values)) {
      this.drugObj = {};
      this.drugObj.drugName = values.drugName;
      this.drugObj.drugDesc = values.drugDesc;
      this.drugObj.remarks = values.remarks;
      //  for(let provider_service of this.provider_services){
      //   if("104"==provider_service.serviceName){
      //      this.drugObj.providerServiceMapID =  provider_service.providerServiceMapID;
      //      this.drugObj.stateName = provider_service.stateName;
      //   }
      // } 
      this.drugObj.serviceProviderID = this.service_provider_id;
      this.drugObj.createdBy = this.createdBy;
      this.checkDuplicates(this.drugObj);
    
  //  }

  }
  checkDuplicates(object) {
    let duplicateStatus = 0
    if (this.drugList.length === 0) {
      this.drugList.push(object);
    }
    else {
      for (let i = 0; i < this.drugList.length; i++) {
        if (this.drugList[i].drugName === object.drugName
        ) {
          duplicateStatus = duplicateStatus + 1;
        }
      }
      if (duplicateStatus === 0) {
        this.drugList.push(object);
      }
    }
  }

  storedrug() {
    let obj = { 'drugMasters': this.drugList };
    console.log('request', obj);

    this.drugMasterService.saveDrugs(JSON.stringify(obj)).subscribe(response => this.successHandler(response), err => {
      this.alertMessage.alert(err, 'error');
    });
  }

  successHandler(response) {
    this.drugList = [];
    this.alertMessage.alert('Saved successfully', 'success');
    this.getAvailableDrugs();
  }

  dataObj: any = {};
  updateDrugStatus(drug) {
    let flag = !drug.deleted;
    let status;
    if (flag === true) {
      status = 'Deactivate';
    }
    if (flag === false) {
      status = 'Activate';
    }
    this.alertMessage.confirm('Confirm', 'Are you sure you want to ' + status + '?').subscribe(response => {
      if (response) {

        this.dataObj = {};
        this.dataObj.drugID = drug.drugID;
        this.dataObj.deleted = !drug.deleted;
        this.dataObj.modifiedBy = this.createdBy;
        this.drugMasterService.updateDrugStatus(this.dataObj).subscribe(res => this.updateStatusHandler(res, status), err => {
          this.alertMessage.alert(err, 'error');
        });

        drug.deleted = !drug.deleted;
      }
      // this.alertMessage.alert(status + 'd successfully');
    })
  }
  updateStatusHandler(response, status) {
    console.log('Drug status changed');
    this.alertMessage.alert(status + 'd successfully', 'success');
  }

  drugID: any;
  drugName: any;
  drugDesc: any;
  remarks: any;
  stateID: any;
  initializeObj() {
    this.drugID = "";
    this.drugName = "";
    this.drugDesc = "";
    this.remarks = "";
    this.stateID = "";
  }
  editDrugData(drug) {
    this.drugID = drug.drugID;
    this.drugName = drug.drugName
    this.drugDesc = drug.drugDesc;
    this.remarks = drug.remarks;
    // this.stateID = drug.m_providerServiceMapping.state.stateID;
    this.editable = true;
  }

  updateDrugData(drug) {
    this.dataObj = {};
    this.dataObj.drugID = this.drugID;
    this.dataObj.drugName = this.drugName;
    this.dataObj.drugDesc = drug.drugDesc;
    this.dataObj.remarks = drug.remarks;
    this.dataObj.providerServiceMapID = drug.providerServiceMapID;
    this.dataObj.modifiedBy = this.createdBy;
    this.drugMasterService.updateDrugData(this.dataObj).subscribe(response => this.updateHandler(response), err => {
      this.alertMessage.alert(err, 'error');
    });

  }

  updateHandler(response) {
    this.editable = false;
    this.alertMessage.alert('Updated successfully', 'success');
    this.getAvailableDrugs();
  }

  drugNameExist: any = false;
  checkExistance(drugName) {
    this.drugNameExist = this.availableDrugNames.includes(drugName);
  }

  remove_obj(index) {
    this.drugList.splice(index, 1);
  }
  clearEdit() {
    this.initializeObj();
    this.showDrugs = true;
    this.editable = false;
    this.drugNameExist = false;
  }
  back() {
    this.alertMessage.confirm('Confirm', 'Do you really want to cancel? Any unsaved data would be lost').subscribe(res => {
      if (res) {
        this.drugForm.resetForm();
        this.clearEdit();
        this.drugList = [];
      }
    })
  }
}
