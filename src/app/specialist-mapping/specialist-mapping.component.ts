import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProcedureMasterServiceService } from '../services/ProviderAdminServices/procedure-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';
import {  SpecialistMappingService } from './../services/ProviderAdminServices/specialist-mapping.service';
@Component({
  selector: 'app-specialist-mapping',
  templateUrl: './specialist-mapping.component.html',
  styleUrls: ['./specialist-mapping.component.css']
})
export class SpecialistMappingComponent implements OnInit {

  alreadyExistcount: boolean;
  state: any;
  service: any;
  serviceline: any;
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
  mappingForm: FormGroup;
  procedureList: any;
  filteredprocedureList: any;
  tableMode: boolean = false;
  saveEditMode: boolean = false;
  alreadyExist: boolean = false;
  bufferArray: any = [];
  services_array: any = [];
  userID: any;
  provider_states: any = [];
  searchStateID: any;

  constructor(private commonDataService: dataService,
    public alertService: ConfirmationDialogsService,
    private fb: FormBuilder,
    public providerAdminRoleService: ProviderAdminRoleService,
    private procedureMasterServiceService: ProcedureMasterServiceService,
    public stateandservices: ServicePointMasterService,
    private specialistMappingService: SpecialistMappingService) {
    this.states = [];
    this.services = [];

  }

  ngOnInit() {

    this.initiateForm();
    console.log(this.mappingForm)
  }
  /**
   * Initiate Form
  */
  initiateForm() {
    this.mappingForm = this.initmappingForm();
    // By Default, it'll be set as enabled
    this.mappingForm.patchValue({
      disable: false
    })
    this.procedureList = [];
    this.filteredprocedureList = [];

    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
    this.serviceProviderID = (this.commonDataService.service_providerID).toString();
    this.userID = this.commonDataService.uid;

    // this.providerAdminRoleService.getStates(this.serviceProviderID)
    //   .subscribe(response => this.states = this.successhandeler(response));
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
    this.filteredprocedureList = [];
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

  initmappingForm(): FormGroup {
    return this.fb.group({
      id: null,
      name: [null, Validators.required],
      type: null,
      description: null,
      gender: null,
      male: null,
      female: null,
      disable: null
    })
  }

  /**
   * Get Details of Procedures available for this Service PRovider
  */
  getAvailableProcedures() {

    this.procedureMasterServiceService.getCurrentProcedures(this.searchStateID.providerServiceMapID)
      .subscribe((res) => {
        this.procedureList = this.successhandeler(res);
        this.filteredprocedureList = this.successhandeler(res);
        this.tableMode = true;
      });

  }
  back() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.showTable();
        this.alreadyExist = false;
        this.resetProcedure();
      }
    })
  }
  showTable() {
    this.tableMode = true;
    this.saveEditMode = false;
    this.disableSelection = false;
  }
  showForm() {
    this.editMode = false;
    this.tableMode = false;
    this.saveEditMode = true;
    this.disableSelection = true;
  }
  procedureUnique() {
    this.alreadyExist = false;
    console.log("filteredprocedureList", this.filteredprocedureList);
    let count = 0;
    for (let a = 0; a < this.filteredprocedureList.length; a++) {

      if (this.filteredprocedureList[a].procedureName === this.name && !this.filteredprocedureList[a].deleted) {
        count = count + 1;
        console.log("count", count);

        if (count > 0) {
          this.alreadyExist = true;
        }
      }
    }
  }
  procedureUnique_actvate(name) {
    console.log("name", name);
    this.alreadyExistcount = false;
    console.log("filteredprocedureList", this.filteredprocedureList);
    let count = 0;
    for (let a = 0; a < this.filteredprocedureList.length; a++) {

      if (this.filteredprocedureList[a].procedureName === name && !this.filteredprocedureList[a].deleted) {
        count = count + 1;
        console.log("count", count);

        if (count >= 1) {
          this.alreadyExistcount = true;
        }
      }
    }
  }

  get name() {
    return this.mappingForm.controls['name'].value;
  }
  saveProcedure() {
    let apiObject = this.objectManipulate();
    let obj = Object.assign({}, this.mappingForm.value);
    let count = 0;
    console.log('here to check available', apiObject);
    for (let a = 0; a < this.filteredprocedureList.length; a++) {
      if (this.filteredprocedureList[a].procedureName === apiObject["procedureName"] && !this.filteredprocedureList[a].deleted) {
        count = count + 1;
        console.log('here to check available', count);
      }
    }
    if (count == 0) {
      console.log('here to check available', apiObject);

      if (apiObject) {
        delete apiObject['modifiedBy'];
        delete apiObject['procedureID'];
        console.log('here to check available', apiObject);

        this.procedureMasterServiceService.postProcedureData(apiObject)
          .subscribe((res) => {
            this.procedureList.unshift(res);
            this.mappingForm.reset();
            this.alertService.alert('Saved successfully', 'success')
            this.showTable();
          })

      }
    }
    else {
      this.alertService.alert('Already exists')
    }
  }

  /**
   * Update Changes for The Procedure
  */
  updateProcedure() {
    const apiObject = this.objectManipulate();
    if (apiObject) {
      delete apiObject['createdBy'];
      apiObject['procedureID'] = this.editMode;

      this.procedureMasterServiceService.updateProcedureData(apiObject)
        .subscribe((res) => {
          this.updateList(res);
          this.mappingForm.reset();
          this.editMode = false;
          this.alertService.alert('Updated successfully', 'success')
          this.showTable();
        })

    }
  }

  resetProcedure() {
    this.mappingForm.reset();
    this.editMode = false;
  }


  /**
   * Manipulate Form Object to as per API Need
  */
  objectManipulate() {
    const obj = Object.assign({}, this.mappingForm.value);

    console.log('this.mappingForm.value', this.mappingForm.value, obj);

    if (!obj.name || !obj.type || !obj.description || (!obj.gender)) {
      this.unfilled = true;
      return false
    } else {
      this.unfilled = false;

      let apiObject = {};
      apiObject = {
        procedureID: '',
        modifiedBy: this.commonDataService.uname,
        procedureName: obj.name,
        procedureType: obj.type,
        procedureDesc: obj.description,
        createdBy: this.commonDataService.uname,
        providerServiceMapID: this.searchStateID.providerServiceMapID,
        gender: obj.gender
      };

      // console.log(obj.male, 'obj');
      // if (obj.gender) {
      //   apiObject = {
      //     procedureID: '',
      //     modifiedBy: this.commonDataService.uname,
      //     procedureName: obj.name,
      //     procedureType: obj.type,
      //     procedureDesc: obj.description,
      //     createdBy: this.commonDataService.uname,
      //     providerServiceMapID: this.searchStateID.providerServiceMapID,
      //     gender: 'Unisex'
      //   };
      // } else if (obj.male && !obj.female) {
      //   apiObject = {
      //     procedureID: '',
      //     modifiedBy: this.commonDataService.uname,
      //     procedureName: obj.name,
      //     procedureType: obj.type,
      //     procedureDesc: obj.description,
      //     createdBy: this.commonDataService.uname,
      //     providerServiceMapID: this.searchStateID.providerServiceMapID,
      //     gender: 'Male'
      //   };
      // } else if (!obj.male && obj.female) {
      //   apiObject = {
      //     procedureID: '',
      //     modifiedBy: this.commonDataService.uname,
      //     procedureName: obj.name,
      //     procedureType: obj.type,
      //     procedureDesc: obj.description,
      //     createdBy: this.commonDataService.uname,
      //     providerServiceMapID: this.searchStateID.providerServiceMapID,
      //     gender: 'Female'
      //   };
      // }
      console.log(JSON.stringify(apiObject, null, 3), 'apiObject');
      return apiObject;
    }

  }



  setProviderServiceMapID() {
    this.commonDataService.provider_serviceMapID = this.searchStateID.ProviderServiceMapID;
    this.providerServiceMapID = this.searchStateID.ProviderServiceMapID;

    console.log('psmid', this.searchStateID.ProviderServiceMapID);
    console.log(this.service);
    this.getAvailableMapping();
    this.getAvailableProcedures();
  }

  getAvailableMapping() {
    console.log(this.commonDataService.service_providerID,'id')
    // this.procedureMasterServiceService.getCurrentProcedures(this.searchStateID.providerServiceMapID)
    // .subscribe((res) => {
    //   this.procedureList = this.successhandeler(res);
    //   this.filteredprocedureList = this.successhandeler(res);
    //   this.tableMode = true;
    // });

  }

  // getServices(stateID) {
  //   console.log(this.serviceProviderID, stateID);
  //   this.providerAdminRoleService.getServices_filtered(this.serviceProviderID, stateID)
  //     .subscribe(response => this.servicesSuccesshandeler(response));
  // }


  // // For Service List
  // servicesSuccesshandeler(response) {
  //   this.service = '';
  //   this.services = response;
  //   this.providerServiceMapID = null;

  // }
  // For State List
  successhandeler(response) {
    return response;
  }


  /**
   *Enable/ Disable Procedure
   *
   */
  toggleProcedure(procedureID, index, toggle, procedureName) {
    let activateProcdure = false;
    this.procedureUnique_actvate(procedureName);
    if (this.alreadyExistcount) {
      this.alertService.confirm('Confirm', "Duplicate procedure already exists do you want to enable it?").subscribe(response => {
        if (response) {
          this.activate(procedureID, index, toggle);
        }
      })
    }
    else {
      this.activate(procedureID, index, toggle);
    }

  }
  activate(procedureID, index, toggle) {
    let text;
    if (!toggle)
      text = "Are you sure you want to Activate?";
    else
      text = "Are you sure you want to Deactivate?";

    this.alertService.confirm('Confirm', text).subscribe(response => {
      if (response) {
        console.log(procedureID, index, 'index');
        this.procedureMasterServiceService.toggleProcedure({ procedureID: procedureID, deleted: toggle })
          .subscribe((res) => {
            console.log(res, 'changed');
            if (res) {
              if (!toggle)
                this.alertService.alert("Activated successfully", 'success');
              else
                this.alertService.alert("Deactivated successfully", 'success');
              this.updateList(res);
              // this.procedureList[index] = res;
            }
          })
      }

    })
  }
  deactivatetoggleProcedure(procedureID, index, toggle) {
    let text;
    if (!toggle)
      text = "Are you sure you want to Activate?";
    else
      text = "Are you sure you want to Deactivate?";
    this.alertService.confirm('Confirm', text).subscribe(response => {
      if (response) {
        console.log(procedureID, index, 'index');
        this.procedureMasterServiceService.toggleProcedure({ procedureID: procedureID, deleted: toggle })
          .subscribe((res) => {
            console.log(res, 'changed');
            if (res) {
              if (!toggle)
                this.alertService.alert("Activated successfully", 'success');
              else
                this.alertService.alert("Deactivated successfully", 'success');
              this.updateList(res);
              // this.procedureList[index] = res;
            }
          })
      }
    })
  }

  updateList(res) {
    this.procedureList.forEach((element, i) => {
      console.log(element, 'elem', res, 'res')
      if (element.procedureID == res.procedureID) {
        this.procedureList[i] = res;
      }

    });

    this.filteredprocedureList.forEach((element, i) => {
      console.log(element, 'elem', res, 'res')
      if (element.procedureID == res.procedureID) {
        this.filteredprocedureList[i] = res;
      }

    });

  }

  filterprocedureList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredprocedureList = this.procedureList;
    } else {
      this.filteredprocedureList = [];
      this.procedureList.forEach((item) => {
        for (let key in item) {
          if (key == 'procedureName' || key == 'procedureType') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredprocedureList.push(item); break;
            }
          }
        }
      });
    }

  }

  configProcedure(item, index) {
    this.editMode = true;
    let male: any;
    let female: any;
    let unisex: any;
    if (item.gender == 'unisex') {
      unisex = "unisex";
    } else if (item.gender == 'male') {
      male = "male";
    } else if (item.gender == 'female') {
      female = "female";
    }
    this.editMode = index >= 0 ? item.procedureID : false; // setting edit mode on
    console.log(JSON.stringify(item, null, 4));
    this.mappingForm.patchValue({
      id: item.procedureID,
      name: item.procedureName,
      type: item.procedureType,
      description: item.procedureDesc,
      gender: item.gender,
      disable: item.deleted
    })



  }



}
