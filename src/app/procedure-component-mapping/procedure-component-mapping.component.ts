/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ProcedureComponentMappingServiceService } from './../services/ProviderAdminServices/procedure-component-mapping-service.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';

@Component({
  selector: 'app-procedure-component-mapping',
  templateUrl: './procedure-component-mapping.component.html',
  styleUrls: ['./procedure-component-mapping.component.css']
})
export class ProcedureComponentMappingComponent implements OnInit {

  serviceline: any;
  searchStateID: any;
  provider_states: any = [];
  services_array: any = [];
  userID: any;
  state: any;
  service: any;
  tableMode: boolean = false;
  saveMode: boolean = false;

  states: any;
  services: any;
  disableSelection: boolean = false;

  editMode: boolean = false;
  serviceProviderID: any;

  STATE_ID: any;
  SERVICE_ID: any;
  providerServiceMapID: any;
  unfilled: Boolean = false;
  editProcedure: any;
  selectedProcedure: any;
  selectedComponent: any;
  selectedComponentList = [];
  selectedProcedureDescription: any;
  selectedProcedureType: any;
  selectedComponentDescription: any;
  selectedLoincCode: any;

  procedureList: any;
  componentList: any;
  masterComponentList: any;


  mappedList = [];
  filteredMappedList = [];
  selectedLoincComponent: any;

  constructor(private commonDataService: dataService,
    public providerAdminRoleService: ProviderAdminRoleService,
    public alertService: ConfirmationDialogsService,
    private procedureComponentMappingServiceService: ProcedureComponentMappingServiceService,
    public stateandservices: ServicePointMasterService) {
    this.states = [];
    this.services = [];
  }

  ngOnInit() {

    this.initiateForm();
  }

  /**
 * Initiate Form
*/
  initiateForm() {
    // this.editMode = false;
    // By Default, it'll be set as enabled
    // this.componentForm = this.initComponentForm();
    // this.componentForm.patchValue({
    //   disable: false
    // })
    // this.componentList = [];
    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)

    if (this.commonDataService.service_providerID) {
      this.serviceProviderID = (this.commonDataService.service_providerID).toString();
    }

    this.userID = this.commonDataService.uid;


    this.getProviderServices();
  }
  getProviderServices() {
    this.stateandservices.getServices(this.userID)
      .subscribe(response => {
        this.services_array = response;
      }, err => {
      });
  }
  getStates(serviceID) {
    this.filteredMappedList = [];
    this.stateandservices.getStates(this.userID, serviceID, false).
      subscribe(response => this.getStatesSuccessHandeler(response, false), err => {
      });
  }
  getStatesSuccessHandeler(response, isNational) {
    if (response) {
      console.log(response, 'Provider States');
      this.provider_states = response;
      // this.createButton = false;
    }
  }

  setProviderServiceMapID() {
    this.commonDataService.provider_serviceMapID = this.searchStateID.providerServiceMapID;
    this.providerServiceMapID = this.searchStateID.providerServiceMapID;

    console.log('psmid', this.searchStateID.providerServiceMapID);
    console.log(this.service);

    this.getProcedureDropDown();
    this.getComponentDropDown();
    this.getCurrentMappings();
  }
  getProcedureDropDown() {
    this.procedureComponentMappingServiceService
      .getProceduresList(this.providerServiceMapID)
      .subscribe(response => {
        console.log("procedure List", response);
        this.procedureList = this.filterProcedureListforNull(response)
      });

  }
  getComponentDropDown() {
    this.procedureComponentMappingServiceService
      .getComponentsList(this.providerServiceMapID)
      .subscribe(response => {
        console.log("component list", response);
        this.componentList = this.successhandeler(response);
        this.masterComponentList = this.successhandeler(response)
      });

  }

  getCurrentMappings() {
    this.procedureComponentMappingServiceService.getCurrentMappings(this.providerServiceMapID)
      .subscribe((res) => {
        this.mappedList = res;
        this.filteredMappedList = res;
        this.tableMode = true;
      });
  }


  configProcedureMapping(item, index) {
    this.showForm();
    this.selectedComponent = '';
    this.selectedComponentDescription = '';
    this.selectedLoincCode = '';
    this.selectedLoincComponent = '';
    console.log(item, 'here item')
    this.procedureComponentMappingServiceService.getSelectedProcedureMappings(item.procedureID)
      .subscribe((res) => {
        console.log("config procedure", res);
        if (res.length > 0) {
          console.log(JSON.stringify(res, null, 4), 'recheck')
          this.editMode = index >= 0 ? true : false;
          if (this.editMode)
            this.saveMode = false;
          // this.selectedProcedureType = item.procedureType;

          this.loadForConfig(res, item);
          //   this.configProcedureMapping(this.selectedProcedure, -1);
          this.procedureSelected_edit();
        } else {
          this.editMode = false;
          this.selectedComponentList = [];
          // this.selectedProcedureType = item.procedureType;

          const masters = Object.assign([], this.masterComponentList);
          this.filterComponentList(masters, item.procedureType);

        }
      })

  }

  loadForConfig(res, item) {
    console.log(this.masterComponentList, 'masterComponentList');
    let temp = this.procedureList.filter(procedure => {
      return procedure.procedureID == res[0].procedureID
    });
    console.log(temp, 'temp')
    if (temp.length > 0) {
      this.selectedProcedure = temp[0];
      res.forEach((mappedComponent) => {
        this.selectedComponentList.push(mappedComponent.compListDetails[0]);
      })
      // this.selectedComponentList = res[0].compListDetails;
      this.selectedProcedureDescription = res[0].procedureDesc;
      // this.selectedProcedureType = res[0].procedureType;
    } else {
      // this.selectedProcedureType = res[0].procedureType;

      this.selectedComponentList = [];
    }
    this.componentList = [];
    const masters = Object.assign([], this.masterComponentList);
    this.filterComponentList(masters, temp[0].procedureType);
    console.log('loadCompList', this.componentList);
  }

  filterComponentList(compMaster, typeOfProcedure) {
    if (compMaster) {
      if (typeOfProcedure === 'Radiology') {
        this.componentList = compMaster.filter((comp) => {
          return comp.inputType === 'FileUpload';
        });
      } else if (typeOfProcedure !== 'Radiology') {
        this.componentList = compMaster.filter((comp) => {
          return comp.inputType !== 'FileUpload';
        });
      }
    }
    console.log(this.componentList, 'compList')
  }

  updateComponentMapList() {
    if (this.selectedComponent) {
      // const index = this.selectedComponentList.indexOf(this.selectedComponent);
      let index = -1;
      this.selectedComponentList.forEach((component, i) => {
        if (component.testComponentID === this.selectedComponent.testComponentID) {
          index = i;
        }
      })
      if (index < 0) {
        console.log(this.selectedComponentList, this.selectedComponentList.length, 'lengtho', this.selectedProcedureType, 'type')
        if (this.selectedComponentList.length > 0 && this.selectedProcedureType === 'Radiology') {
          this.alertService.alert('A Radiology Test can not have more than one component mapped');
        } else {

          this.selectedComponentList.push(this.selectedComponent);
          this.postMappingData();
          this.clearComponentValue();
        }
      } else {
        this.alertService.alert('Already exists');
      }
    }
  }



  postMappingData() {
    const apiObject = Object.assign({},
      this.selectedProcedure,
      { compList: this.selectedComponentList, createdBy: this.commonDataService.uname, providerServiceMapID: this.providerServiceMapID })
    this.procedureComponentMappingServiceService.saveProcedureComponentMapping(apiObject)
      .subscribe((res) => {
        if (res && res.length > 0) {
          this.updateListAsPerFunction(res);
        }
        this.clearProcedureValue();
        this.clearComponentValue();
        this.clearSelectedComponentsList();
        this.getCurrentMappings();
      })
  }



  /**
   *
   * Update Mapped List as per 'Save' or 'Update'
   */
  updateListAsPerFunction(res) {
    if (!this.editMode) {
      this.mappedList.unshift(res[0]);
      if (!this.editMode)
        this.alertService.alert('Mapping saved successfully', 'success');
      else this.alertService.alert('Mapping updated successfully', 'success');
      this.showTable();
    } else if (this.editMode) {
      let index = -1;
      let filterIndex = -1;
      this.mappedList.forEach((procedure, i) => {
        if (procedure.procedureID == res[0].procedureID) {
          index = i;
        }
      })
      this.filteredMappedList.forEach((procedure, i) => {
        if (procedure.procedureID == res[0].procedureID) {
          filterIndex = i;
        }
      })
      if (index >= 0) {
        this.mappedList[index] = res[0];
        this.filteredMappedList[filterIndex] = res[0];
        this.alertService.alert('Mapping updated successfully', 'success');
        this.showTable();

      } else {
        this.mappedList.unshift(res[0]);
      }
    }
  }



  filterMappingList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredMappedList = this.mappedList;
    } else {
      this.filteredMappedList = [];
      this.mappedList.forEach((item) => {
        for (let key in item) {
          if (key == 'procedureName' || key == 'compList') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredMappedList.push(item); break;
            }
          }
        }
      });
    }

  }


  removechip(component) {
    const index = this.selectedComponentList.indexOf(component);
    if (index >= 0) {
      this.selectedComponentList.splice(index, 1);
    }
  }

  filterProcedureListforNull(response) {
    const resp = response.filter((procedure) => {
      return procedure.procedureName != null
    })

    return resp;
  }
  procedureSelected_edit() {
    if (this.selectedProcedure) {
      console.log("selected procedure", this.selectedProcedure);
      this.selectedProcedureDescription = this.selectedProcedure.procedureDesc;
      this.selectedProcedureType = this.selectedProcedure.procedureType;
      console.log(this.selectedProcedureType)
    }
  }

  procedureSelected() {
    if (this.selectedProcedure) {
      console.log("selected procedure", this.selectedProcedure);
      this.selectedProcedureDescription = this.selectedProcedure.procedureDesc;
      this.selectedProcedureType = this.selectedProcedure.procedureType;
      console.log(this.selectedProcedureType)
      this.configProcedureMapping(this.selectedProcedure, -1);
    } else {
      this.clearSelectedComponentsList();
      this.selectedProcedureDescription = '';
      this.selectedProcedureType = '';
      this.editMode = false;
    }
  }

  componentSelected() {
    if (this.selectedComponent) {
      this.selectedComponentDescription = this.selectedComponent.testComponentDesc;
      this.selectedLoincCode = this.selectedComponent.lionicNum;
      this.selectedLoincComponent = this.selectedComponent.component;
    } else {
      this.selectedComponentDescription = '';
      this.selectedLoincCode = '';
      this.selectedLoincComponent = '';
    }
  }

  getServices(stateID) {
    console.log(this.serviceProviderID, stateID);
    this.providerAdminRoleService.getServices(this.serviceProviderID, stateID)
      .subscribe(response => this.servicesSuccesshandeler(response));
  }
  showForm() {
    this.tableMode = false;
    this.saveMode = true;
    this.disableSelection = true;
  }
  showTable() {
    this.tableMode = true;
    this.editMode = false;
    this.saveMode = false;
    this.disableSelection = false;
  }
  back() {
    this.showTable();
    this.clearProcedureValue();
    this.clearComponentValue();
    this.clearSelectedComponentsList();
  }


  clearProcedureValue() {
    this.selectedProcedure = '';
    this.selectedProcedureDescription = '';
  }
  clearComponentValue() {
    this.selectedComponent = '';
    this.selectedComponentDescription = '';
    this.selectedLoincCode = '';
    this.selectedLoincComponent = '';
  }
  clearSelectedComponentsList() {
    this.selectedComponentList = [];
  }
  // For Service List
  servicesSuccesshandeler(response) {
    this.service = '';
    this.services = response;
    this.providerServiceMapID = null;
    this.clearProcedureValue();
    this.clearComponentValue();
    this.clearSelectedComponentsList();
    this.procedureList = [];
    this.componentList = [];
    this.mappedList = [];
    this.filteredMappedList = [];

  }
  // For State List
  successhandeler(response) {
    return response;
  }
}
