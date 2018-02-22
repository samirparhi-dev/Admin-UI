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

  editMode: any = false;
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

  constructor(private commonDataService: dataService,
    public providerAdminRoleService: ProviderAdminRoleService,
    private procedureComponentMappingServiceService: ProcedureComponentMappingServiceService) {
    this.states = [];
    this.services = [];
  }

  ngOnInit() {

    this.initiateForm();
  }
  consoleValues(event) {
    console.log(this.selectedProcedure, 'value here')
  }
  /**
 * Initiate Form
*/
  initiateForm() {
    // By Default, it'll be set as enabled
    // this.componentForm = this.initComponentForm();
    // this.componentForm.patchValue({
    //   disable: false
    // })
    // this.componentList = [];
    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
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
  }
  updateComponentMapList() {
    const index = this.selectedComponentList.indexOf(this.selectedComponent);
    if (index < 0) {
      this.selectedComponentList.push(this.selectedComponent);

      this.clearComponentValue();
    }
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

  postMappingData() {
    const apiObject = Object.assign({},
      this.selectedProcedure,
      { compList: this.selectedComponentList, createdBy: this.commonDataService.uname, providerServiceMapID: this.providerServiceMapID })
    this.procedureComponentMappingServiceService.saveProcedureComponentMapping(apiObject)
      .subscribe((res) => {
        console.log(res, 'res')
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

  procedureSelected() {
    if (this.selectedProcedure) {
    this.selectedProcedureDescription = this.selectedProcedure.procedureDesc;
    } else {
      this.clearSelectedComponentsList();
      this.selectedProcedureDescription = '';
    }
  }
  componentSelected() {
    if (this.selectedComponent)  {
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

  }
  // For State List
  successhandeler(response) {
    return response;
  }


}
