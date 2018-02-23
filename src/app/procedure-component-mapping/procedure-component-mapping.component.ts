import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ProcedureComponentMappingServiceService } from './../services/ProviderAdminServices/procedure-component-mapping-service.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-procedure-component-mapping',
  templateUrl: './procedure-component-mapping.component.html',
  styleUrls: ['./procedure-component-mapping.component.css']
})
export class ProcedureComponentMappingComponent implements OnInit {
  state: any;
  service: any;

  states: any;
  services: any;
  disableSelection: boolean = false;

  editMode: any;
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
  selectedComponentDescription: any;

  procedureList: any;
  componentList: any;


  mappedList = [];

  constructor(private commonDataService: dataService,
    public providerAdminRoleService: ProviderAdminRoleService,
    private procedureComponentMappingServiceService: ProcedureComponentMappingServiceService) {
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
    this.editMode = false;
    // By Default, it'll be set as enabled
    // this.componentForm = this.initComponentForm();
    // this.componentForm.patchValue({
    //   disable: false
    // })
    // this.componentList = [];
    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)

    if (this.commonDataService.service_providerID)
      this.serviceProviderID = (this.commonDataService.service_providerID).toString();


    this.providerAdminRoleService.getStates(this.serviceProviderID)
      .subscribe(response => {
        this.states = this.successhandeler(response);

      }
      );

  }

  setProviderServiceMapID(ProviderServiceMapID) {
    this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
    this.providerServiceMapID = ProviderServiceMapID;

    console.log('psmid', ProviderServiceMapID);
    console.log(this.service);

    this.getProcedureDropDown();
    this.getComponentDropDown();
    this.getCurrentMappings();
  }

  configProcedureMapping(item, index) {
    this.procedureComponentMappingServiceService.getSelectedProcedureMappings(item.procedureID)
      .subscribe((res) => {
        if (res.length > 0) {
          this.editMode = index >= 0 ? true : false;
          this.loadForConfig(res);
        }
      })

  }

  loadForConfig(res) {
    let temp = this.procedureList.filter(procedure => {
      return procedure.procedureID == res[0].procedureID
    });

    if (temp.length > 0) {
      this.selectedProcedure = temp[0];
      this.selectedComponentList = res[0].compListDetails;
      this.selectedProcedureDescription = res[0].procedureDesc;
    }
  }

  getCurrentMappings() {
    this.procedureComponentMappingServiceService.getCurrentMappings(this.providerServiceMapID)
      .subscribe((res) => {
        this.mappedList = res;
      });
  }

  updateComponentMapList() {
    const index = this.selectedComponentList.indexOf(this.selectedComponent);
    if (index < 0) {
      this.selectedComponentList.push(this.selectedComponent);

      this.clearComponentValue();
    }
  }



  postMappingData() {
    const apiObject = Object.assign({},
      this.selectedProcedure,
      { compList: this.selectedComponentList, createdBy: this.commonDataService.uname, providerServiceMapID: this.providerServiceMapID })
    this.procedureComponentMappingServiceService.saveProcedureComponentMapping(apiObject)
      .subscribe((res) => {
        if (res && res.length > 0)
          this.mappedList = this.mappedList.concat(res);
        this.clearProcedureValue();
        this.clearComponentValue();
        this.clearSelectedComponentsList();
      })
  }


  removechip(component) {
    const index = this.selectedComponentList.indexOf(component);
    if (index >= 0) {
      this.selectedComponentList.splice(index, 1);
    }
  }



  procedureSelected() {
    if (this.selectedProcedure) {
      this.selectedProcedureDescription = this.selectedProcedure.procedureDesc;
      this.configProcedureMapping(this.selectedProcedure, 0);
    } else {
      this.clearSelectedComponentsList();
      this.selectedProcedureDescription = '';
      this.editMode = false;
    }
  }

  componentSelected() {
    if (this.selectedComponent) {
      this.selectedComponentDescription = this.selectedComponent.testComponentDesc;
    } else {
      this.selectedComponentDescription = '';
    }
  }

  getServices(stateID) {
    console.log(this.serviceProviderID, stateID);
    this.providerAdminRoleService.getServices(this.serviceProviderID, stateID)
      .subscribe(response => this.servicesSuccesshandeler(response));
  }

  getProcedureDropDown() {
    this.procedureComponentMappingServiceService
      .getProceduresList(this.providerServiceMapID)
      .subscribe(response => this.procedureList = this.successhandeler(response));

  }
  getComponentDropDown() {
    this.procedureComponentMappingServiceService
      .getComponentsList(this.providerServiceMapID)
      .subscribe(response => this.componentList = this.successhandeler(response));

  }

  clearProcedureValue() {
    this.selectedProcedure = '';
    this.selectedProcedureDescription = '';
  }
  clearComponentValue() {
    this.selectedComponent = '';
    this.selectedComponentDescription = '';
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

  }
  // For State List
  successhandeler(response) {
    return response;
  }
}
