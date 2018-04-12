import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProcedureMasterServiceService } from '../services/ProviderAdminServices/procedure-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-procedure-master',
  templateUrl: './procedure-master.component.html',
  styleUrls: ['./procedure-master.component.css']
})
export class ProcedureMasterComponent implements OnInit {

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
  procedureForm: FormGroup;
  procedureList: any;
  filteredprocedureList: any;
  tableMode: boolean = true;
  saveEditMode: boolean = false;

  bufferArray: any = [];


  constructor(private commonDataService: dataService,
    public alertService: ConfirmationDialogsService,
    private fb: FormBuilder,
    public providerAdminRoleService: ProviderAdminRoleService,
    private procedureMasterServiceService: ProcedureMasterServiceService) {
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

    this.providerAdminRoleService.getStates(this.serviceProviderID)
      .subscribe(response => this.states = this.successhandeler(response));

  }

  initProcedureForm(): FormGroup {
    return this.fb.group({
      id: null,
      name: null,
      type: null,
      description: null,
      male: null,
      female: null,
      disable: null
    })
  }

  /**
   * Get Details of Procedures available for this Service PRovider
  */
  getAvailableProcedures() {

    this.procedureMasterServiceService.getCurrentProcedures(this.providerServiceMapID)
      .subscribe((res) => { this.procedureList = this.successhandeler(res); this.filteredprocedureList = this.successhandeler(res); });

  }
  showTable() {
    this.tableMode = true;
    this.saveEditMode = false;
  }
  showForm() {
    this.tableMode = false;
    this.saveEditMode = true;
  }
  saveProcedure() {
    const apiObject = this.objectManipulate();
    if (apiObject) {
      delete apiObject['modifiedBy'];
      delete apiObject['procedureID'];

      this.procedureMasterServiceService.postProcedureData(apiObject)
        .subscribe((res) => {
          this.procedureList.unshift(res);
          this.procedureForm.reset();
          this.alertService.alert('Procedure details saved.')
        })

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
          this.alertService.alert('Procedure details updated.')
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
    const obj = Object.assign({}, this.procedureForm.value);

    if (!obj.name || !obj.type || !obj.description || (!obj.male && !obj.female)) {
      this.unfilled = true;
      return false
    } else {
      this.unfilled = false;

      let apiObject = {};


      console.log(obj.male, 'obj');
      if (obj.male && obj.female) {
        apiObject = {
          procedureID: '',
          modifiedBy: this.commonDataService.uname,
          procedureName: obj.name,
          procedureType: obj.type,
          procedureDesc: obj.description,
          createdBy: this.commonDataService.uname,
          providerServiceMapID: this.commonDataService.provider_serviceMapID,
          gender: 'Unisex'
        };
      } else if (obj.male && !obj.female) {
        apiObject = {
          procedureID: '',
          modifiedBy: this.commonDataService.uname,
          procedureName: obj.name,
          procedureType: obj.type,
          procedureDesc: obj.description,
          createdBy: this.commonDataService.uname,
          providerServiceMapID: this.commonDataService.provider_serviceMapID,
          gender: 'Male'
        };
      } else if (!obj.male && obj.female) {
        apiObject = {
          procedureID: '',
          modifiedBy: this.commonDataService.uname,
          procedureName: obj.name,
          procedureType: obj.type,
          procedureDesc: obj.description,
          createdBy: this.commonDataService.uname,
          providerServiceMapID: this.commonDataService.provider_serviceMapID,
          gender: 'Female'
        };
      }
      console.log(JSON.stringify(apiObject, null, 3), 'apiObject');
      return apiObject;
    }

  }



  setProviderServiceMapID(ProviderServiceMapID) {
    this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
    this.providerServiceMapID = ProviderServiceMapID;

    console.log('psmid', ProviderServiceMapID);
    console.log(this.service);
    this.getAvailableProcedures();
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
   *Enable/ Disable Procedure
   *
   */
  toggleProcedure(procedureID, index, toggle) {
    let text;
    if (!toggle)
      text = "Are you sure you want to Activate?";
    else
      text = "Are you sure you want to Deactivate?";
    this.alertService.confirm('Confirm',text).subscribe(response => {
      if (response) {
        console.log(procedureID, index, 'index');
        this.procedureMasterServiceService.toggleProcedure({ procedureID: procedureID, deleted: toggle })
          .subscribe((res) => {
            console.log(res, 'changed');
            if (res) {
              if (!toggle)
                this.alertService.alert("Activated successfully");
              else
                this.alertService.alert("Deactivated successfully");
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
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredprocedureList.push(item); break;
          }
        }
      });
    }

  }

  configProcedure(item, index) {
    let male = false;
    let female = false;
    if (item.gender === 'Unisex') {
      male = true;
      female = true;
    } else if (item.gender === 'Male') {
      male = true;
    } else if (item.gender === 'Female') {
      female = true;
    }
    this.editMode = index >= 0 ? item.procedureID : false; // setting edit mode on
    console.log(JSON.stringify(item, null, 4));
    this.procedureForm.patchValue({
      id: item.procedureID,
      name: item.procedureName,
      type: item.procedureType,
      description: item.procedureDesc,
      male: male,
      female: female,
      disable: item.deleted
    })



  }


  /**
   * Manage Geneder String to Value
   */


  // /**
  //   * Disable the Procedure for Doctor
  //  */
  // disableProcedure() {

  //   this.procedureForm.patchValue({
  //     disable: true
  //   })

  // }
  // /**
  //  * Enable the Procedure for Doctor
  // */
  // enableProcedure() {
  //   this.procedureForm.patchValue({
  //     disable: false
  //   })
  // }
}
