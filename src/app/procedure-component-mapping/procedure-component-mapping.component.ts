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
  filteredMappedList = [];

  constructor(private commonDataService: dataService,
    public providerAdminRoleService: ProviderAdminRoleService,
    public alertService: ConfirmationDialogsService,
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

    if (this.commonDataService.service_providerID) {
      this.serviceProviderID = (this.commonDataService.service_providerID).toString();
    }

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
    this.selectedComponent = '';
    this.selectedComponentDescription = '';
    this.procedureComponentMappingServiceService.getSelectedProcedureMappings(item.procedureID)
      .subscribe((res) => {
        if (res.length > 0) {
          console.log(JSON.stringify(res,null,4), 'recheck')
          this.editMode = index >= 0 ? true : false;
          this.loadForConfig(res);
        } else {
          this.editMode =  false;
          this.selectedComponentList = [];
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
    } else {
      this.selectedComponentList = [];
    }
  }

  getCurrentMappings() {
    this.procedureComponentMappingServiceService.getCurrentMappings(this.providerServiceMapID)
      .subscribe((res) => {
        this.mappedList = res;
        this.filteredMappedList = res;
      });
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

      this.selectedComponentList.push(this.selectedComponent);

      this.clearComponentValue();
    } else {
      this.alertService.alert('This Component is already mapped with selected Procedure.');
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
      })
  }



  /**
   * 
   * Update Mapped List as per 'Save' or 'Update'
   */
  updateListAsPerFunction(res) {
    if (!this.editMode) {
      this.mappedList.unshift(res[0]);
      this.alertService.alert('Procedure- Component Mapping has been saved successfully.');
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
        this.alertService.alert('Procedure- Component Mapping has been updated successfully.');
        
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
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredMappedList.push(item); break;
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
      .subscribe(response => this.procedureList = this.filterProcedureListforNull(response));

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
    this.filteredMappedList = [];

  }
  // For State List
  successhandeler(response) {
    return response;
  }
}
