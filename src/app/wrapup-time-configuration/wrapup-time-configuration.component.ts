import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { WrapupTimeConfigurationService } from '../services/ProviderAdminServices/wrapup-time-configuration.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-wrapup-time-configuration',
  templateUrl: './wrapup-time-configuration.component.html',
  styleUrls: ['./wrapup-time-configuration.component.css']
})
export class WrapupTimeConfigurationComponent implements OnInit {

  services: any;
  userID: any;
  states: any;
  activeRoles: any;
  providerServiceMapID: any;
  roleIDList: any = [];
  alertMessage: any;

  //Flags
  showRoles: Boolean = false;
  disableInputField: Boolean = false;

  wrapupTimeForm: FormGroup;

  constructor(private dataService: dataService,
    private fb: FormBuilder,
    private wrapupTimeConfigurationService: WrapupTimeConfigurationService,
    private dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.userID = this.dataService.uid;
    this.getServiceLines();
    this.wrapupTimeForm = this.fb.group({
      timings: this.fb.array([]),
    })
  }
  /*
  * Service line
  */
  getServiceLines() {
    this.wrapupTimeConfigurationService.getServiceLines(this.userID).subscribe((response) => {
      this.services = response;
    }, (err) => {
      console.log("Error in fetching servicelines");
    });
  }

  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.wrapupTimeConfigurationService.getStates(obj).
      subscribe(response => {
        this.states = response;
      }, (err) => {
        console.log("Error in fetching states");
      });
  }

  getActiveRoles(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    this.wrapupTimeConfigurationService.getActiveRoles(providerServiceMapID).subscribe((response) => {
      response.map((obj) => {
        if (obj.isWrapUpTime == true && obj.WrapUpTime != null) {
          obj.enableEdit = true;
          obj.disableInputField = true;
        } else {
          obj.enableEdit = false;
          obj.disableInputField = false;
        }
      })
      this.activeRoles = response;
      this.showRoles = true;
      this.createFormArray(response);
    })
  }

  createFormArray(activeRoles) {
    let temp = this.wrapupTimeForm.controls['timings'] as FormArray;
    temp.reset();
    let tempLength = temp.length
    if (tempLength > 0) {
      for (let i = 0; i <= tempLength; i++) {
        temp.removeAt(0);
      }
    }
    for (var i = 0; i < activeRoles.length; i++) {
      (temp).push(this.createObject(activeRoles[i]));
    }
  }

  createObject(obj): FormGroup {
    return this.fb.group({
      isWrapUpTime: obj.isWrapUpTime,
      wrapUpTime: obj.WrapUpTime,
      roleID: obj.roleID,
      roleName: obj.roleName,
      providerServiceMapID: obj.providerServiceMapID,
      modifiedBy: obj.createdBy,
      enableEdit: obj.enableEdit,
      disableInputField: obj.disableInputField
    })
  }

  givePrivilegeForWrapupTime(event, role) {
    if (event.checked) {
      role.isWrapUpTime = true;
    } else {
      role.isWrapUpTime = false;
      role.wrapUpTime = null;
      this.wrapupTimeForm.patchValue({
        wrapUpTime: null
      })
    }
  }
  editField(role) {
    this.activeRoles.map((obj) => {
      if (obj.roleID == role.roleID) {
        obj.disableInputField = false;
        this.wrapupTimeForm.patchValue({
        wrapUpTime: null
      })
      }
    })
    this.createFormArray(this.activeRoles);
  }
  saveWrapupTime(role) {
    if (role.enableEdit == true) {
      this.alertMessage = "Updated"
    } else {
      this.alertMessage = "Saved"
    }
    this.wrapupTimeConfigurationService.saveWrapUpTime(role).subscribe((response) => {
      console.log(response, "response");
      this.dialogService.alert(`${this.alertMessage} Successfully`);
      this.getActiveRoles(this.providerServiceMapID);
    })
  }
  filterComponentList(searchTerm?: string) {
    let temp = this.wrapupTimeForm.controls['timings'] as FormArray;
    temp.reset();
    let tempLength = temp.length
    if (tempLength > 0) {
      for (let i = 0; i <= tempLength; i++) {
        temp.removeAt(0);
      }
    }
    if (!searchTerm) {
      for (var i = 0; i < this.activeRoles.length; i++) {
        (temp).push(this.createObject(this.activeRoles[i]));
      }
    } else {
      this.activeRoles.forEach((item) => {
        for (let key in item) {
          if (key == 'roleName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              (temp).push(this.createObject(item)); break;
            }
          }
        }
      });
    }
  }
}
