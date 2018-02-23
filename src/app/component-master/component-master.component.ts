import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ComponentMasterServiceService } from './../services/ProviderAdminServices/component-master-service.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.css']
})
export class ComponentMasterComponent implements OnInit {


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
  componentForm: FormGroup;
  componentList: any;

  constructor(private commonDataService: dataService,
    private fb: FormBuilder,
    public providerAdminRoleService: ProviderAdminRoleService,
    private componentMasterServiceService: ComponentMasterServiceService) {
    this.states = [];
    this.services = [];

  }

  ngOnInit() {

    this.initiateForm();
    console.log(this.componentForm)
  }
  /**
   * Initiate Form
  */
  initiateForm() {
    // By Default, it'll be set as enabled
    this.componentForm = this.initComponentForm();
    this.componentForm.patchValue({
      disable: false
    })
    this.componentList = [];
    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
    this.serviceProviderID = (this.commonDataService.service_providerID).toString();


    this.providerAdminRoleService.getStates(this.serviceProviderID)
      .subscribe(response => {
        this.states = this.successhandeler(response);

      }
    );

  }

  initComponentForm(): FormGroup {
    return this.fb.group({
      testComponentID: null,
      testComponentName: null,
      testComponentDesc: null,
      inputType: null,
      range_max: null,
      range_min: null,
      range_normal_max: null,
      range_normal_min: null,
      measurementUnit: null,
      modifiedBy: null,
      createdBy: null,
      providerServiceMapID: null,
      compOpt: this.fb.array([
        this.initComp()
      ]),
      deleted: null
    })
  }

  initComp(): FormGroup {
    return this.fb.group({
      id: null,
      name: null
    });
  }

  myErrorStateMatcher(control, form) {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.touched || isSubmitted));
  }


  addID(index) {
    console.log('index here', index)
    if (index == 1 && this.componentForm.value.inputType == 'RadioButton' ) {
    } else {
      const val = <FormArray>this.componentForm.controls['compOpt'];
      val.push(this.initComp());
    }
  }


  removeID(i) {
    const val = <FormArray>this.componentForm.controls['compOpt'];
    val.removeAt(i);
  }

  /**
   * Get Details of Procedures available for this Service PRovider
  */
  getAvailableComponent() {

    this.componentMasterServiceService.getCurrentComponents(this.providerServiceMapID)
      .subscribe((res) => { this.componentList = this.successhandeler(res) });

  }

  selected() {
    console.log(this.componentForm.value)
      this.componentForm.patchValue({
        range_max: null,
        range_min: null,
        range_normal_max: null,
        range_normal_min: null,
        measurementUnit: null,
      })
      this.componentForm.setControl('compOpt', new FormArray([this.initComp()]))
  }

  saveComponent() {
    const apiObject = this.objectManipulate();
    delete apiObject.modifiedBy;
    delete apiObject.deleted;
    
    console.log(apiObject, 'apiObject');
    if (apiObject) {
      apiObject.createdBy = this.commonDataService.uname;

      this.componentMasterServiceService.postComponentData(apiObject)
        .subscribe((res) => {
          console.log(res, 'resonse here');
          this.componentList.unshift(res);
          this.componentForm.reset();
        })

    }
  }

  /**
   * Update Changes for The Component
  */
  updateComponent() {
    const apiObject = this.objectManipulate();

  }



  /**
   * Manipulate Form Object to as per API Need
  */
  objectManipulate() {
    const obj = Object.assign({}, this.componentForm.value);
   
    if (!obj.testComponentName || !obj.testComponentDesc || !obj.inputType ) {
      this.unfilled = true;
      return false
    } else {
      if (obj.inputType == 'TextBox') {
        if (!obj.range_max ||
          !obj.range_min ||
          !obj.range_normal_max ||
          !obj.range_normal_min ||
          !obj.measurementUnit) {
          this.unfilled = true;
          return false
          } else {
            obj.compOpt = null;
          this.unfilled = false;
          }
      }  else if (obj.inputType == 'DropDown' || obj.inputType == 'RadioButton') {
         if (obj.compOpt.length < 2) {
           this.unfilled = true;
           return false;

         }

      }
      obj.providerServiceMapID = this.providerServiceMapID;
      return obj;
    }

  }



  setProviderServiceMapID(ProviderServiceMapID) {
    this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
    this.providerServiceMapID = ProviderServiceMapID;

    console.log('psmid', ProviderServiceMapID);
    console.log(this.service);
    this.getAvailableComponent();
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

  }
  // For State List
  successhandeler(response) {
    return response;
  }


  /**
   *Enable/ Disable Component
   *
   */
  toggleComponent(componentID, index, toggle) {
    console.log(componentID, index, 'index');
    this.componentMasterServiceService.toggleComponent({ componentID: componentID, deleted: toggle })
      .subscribe((res) => {
        console.log(res, 'changed');
        if (res) {
          this.updateList(res);
        }
      })

  }

  updateList(res) {
    this.componentList.forEach((element, i) => {
      console.log(element,'elem', res, 'res')
      if (element.testComponentID == res.testComponentID) {
        this.componentList[i] = res;
      }
      
    });

  }

  configComponent(item, i) {
    this.componentForm.setValue({item});
  }

}

