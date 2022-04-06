import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProcedureMasterServiceService } from '../services/ProviderAdminServices/procedure-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';
@Component({
  selector: 'app-procedure-master',
  templateUrl: './procedure-master.component.html',
  styleUrls: ['./procedure-master.component.css']
})
export class ProcedureMasterComponent implements OnInit {

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
  procedureForm: FormGroup;
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
  iotProcedurearray:any[];

  constructor(private commonDataService: dataService,
    public alertService: ConfirmationDialogsService,
    private fb: FormBuilder,
    public providerAdminRoleService: ProviderAdminRoleService,
    private procedureMasterServiceService: ProcedureMasterServiceService,
    public stateandservices: ServicePointMasterService) {
    this.states = [];
    this.services = [];

  }

  ngOnInit() {

    this.initiateForm();
    console.log(this.procedureForm)
    
  }
  /**
   * Initiate Form
  */
  initiateForm() {
    this.procedureForm = this.initProcedureForm();
    // By Default, it'll be set as enabled
    this.procedureForm.patchValue({
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
    this.getIOTProcedure();
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

  initProcedureForm(): FormGroup {
    return this.fb.group({
      id: null,
      name: [null, Validators.required],
      type: null,
      description: null,
      gender: null,
      male: null,
      female: null,
      disable: null,
      iotProcedureID:null,
      isMandatory: null,
      isCalibration: null
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
    return this.procedureForm.controls['name'].value;
  }
  saveProcedure() {
    debugger;
    let apiObject = this.objectManipulate();
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
            this.procedureForm.reset();
            this.alertService.alert('Saved successfully', 'success');
            this.getAvailableProcedures();
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
          this.procedureForm.reset();
          this.editMode = false;
          this.alertService.alert('Updated successfully', 'success');
          this.getAvailableProcedures();
          this.showTable();
        })

    }
  }

  resetProcedure() {
    this.procedureForm.reset();
    this.editMode = false;
  }


  /**
   * Manipulate Form Object to as per API Need
  */
  objectManipulate() {
    debugger;
    const obj = Object.assign({}, this.procedureForm.value);

    console.log('this.procedureForm.value', this.procedureForm.value, obj);

    if (!obj.name || !obj.type || !obj.description || (!obj.gender)) {
      this.unfilled = true;
      return false
    } else {
      this.unfilled = false;

      let apiObject = {};
      console.log(obj);
      apiObject = {
        procedureID: '',
        modifiedBy: this.commonDataService.uname,
        procedureName: obj.name.trim(),
        procedureType: obj.type,
        procedureDesc: obj.description,
        createdBy: this.commonDataService.uname,
        providerServiceMapID: this.searchStateID.providerServiceMapID,
        gender: obj.gender,
        iotProcedureID:obj.iotProcedureID,
        isMandatory: obj.isMandatory,
        isCalibration: obj.isCalibration
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
    this.getAvailableProcedures();
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
    this.procedureForm.patchValue({
      id: item.procedureID,
      name: item.procedureName.trim(),
      type: item.procedureType,
      description: item.procedureDesc,
      gender: item.gender,
      disable: item.deleted,
      iotProcedureID:item.iotProcedureID,
      isMandatory: item.isMandatory,
      isCalibration: item.isCalibration
    })



  }


  // This is called for IOT
  getIOTProcedure(){
this.procedureMasterServiceService.getIOTProcedure().subscribe(response => {
  this.iotProcedurearray = response;
}, err => {
});
  }


}
