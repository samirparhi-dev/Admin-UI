import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { WrapupTimeConfigurationService } from '../services/ProviderAdminServices/wrapup-time-configuration.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-wrapup-time-configuration',
  templateUrl: './wrapup-time-configuration.component.html',
  styleUrls: ['./wrapup-time-configuration.component.css']
})
export class WrapupTimeConfigurationComponent implements OnInit {

  service: any;
  state: any;

  services: any = [];
  userID: any;
  states: any = [];
  activeRoles: any;
  providerServiceMapID: any;
  roleIDList: any = [];
  alertMessage: any;

  //Flags
  showRoles: Boolean = false;
  disableInputField: Boolean = false;

  wrapupTimeForm: FormGroup;
  uncheck: boolean;
  disableState: boolean;

  constructor(private dataService: dataService,
    private fb: FormBuilder,
    private wrapupTimeConfigurationService: WrapupTimeConfigurationService,
    private dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    //this.uncheck=false;
    this.userID = this.dataService.uid;
    this.getServiceLines();
    this.wrapupTimeForm = this.fb.group({
      timings: this.fb.array([])
     // wrapUpTime:[null,[Validators.min(1), Validators.max(600)]]
    })
  }
  /*
  * Service line
  */
  getServiceLines() {
    this.wrapupTimeConfigurationService.getServiceLinesWrapup(this.userID).subscribe((response) => {
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
        this.getStatesSuccessHandeler(response,value.isNational);
      }, (err) => {
        console.log("Error in fetching states");
      });
  }
  getStatesSuccessHandeler(response, isNational) {
    
    this.state = '';
    if (response) {
      console.log(response, 'Provider States');
      this.states = response;
      // this.services_array = [];
      if (isNational) {
        this.state = '';
        this.getActiveRoles(this.states[0].providerServiceMapID);
      }
    }
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
      uncheck: null,
      disableInputField: obj.disableInputField
    })
  }

  givePrivilegeForWrapupTime(event, role) {
    let formArray = this.wrapupTimeForm.controls['timings'] as FormArray;
    let index=null;
    for(var i=0;i<formArray.length;i++)
    {
      const element=formArray.at(i);
      if(element.value.roleID === role.roleID)
      {
         index=i;
        break;
      }
    }
    if (event.checked) {
      role.isWrapUpTime = true;
      role.uncheck=false;
      // this.wrapupTimeForm.patchValue({
      //   uncheck: false
      // })
      if(index !=null)
      (<FormGroup>formArray.at(index)).controls['uncheck'].setValue(false);
    } else {
      role.isWrapUpTime = false;
      // this.wrapupTimeForm.patchValue({
      //   uncheck: true
      // })
      if(index !=null)
      (<FormGroup>formArray.at(index)).controls['uncheck'].setValue(true);
      role.uncheck=true;
      role.enableEdit = false;
      role.wrapUpTime = null;
      // this.wrapupTimeForm.patchValue({
      //   wrapUpTime: null
      // })
      if(index !=null)
      (<FormGroup>formArray.at(index)).controls['wrapUpTime'].setValue(null);
    }
  }
  editField(role) {
    this.activeRoles.map((obj) => {
      if (obj.roleID == role.roleID) {
        obj.disableInputField = false;
      }
    })
    this.createFormArray(this.activeRoles);
  }
  saveWrapupTime(role,value) {
    if( (role.wrapUpTime !=undefined && role.wrapUpTime !=null && isNaN(role.wrapUpTime)) || ( role.isWrapUpTime !=undefined && role.isWrapUpTime !=null && role.isWrapUpTime ==true &&
      role.wrapUpTime !=undefined && role.wrapUpTime !=null && Number(role.wrapUpTime) <=0 || Number(role.wrapUpTime) >600))
    {
      this.dialogService.alert('Enter value inside range 1 to 600', 'info');
      this.wrapupTimeForm.patchValue({
        wrapUpTime: null
      })
    }
    else{
    // if (role.enableEdit == true) {
    //   this.alertMessage = "Updated"
    // } else {
    //   this.alertMessage = "Saved"
    // }
    this.alertMessage = value;
    this.wrapupTimeConfigurationService.saveWrapUpTime(role).subscribe((response) => {
      console.log(response, "response");
      this.dialogService.alert(`${this.alertMessage} Successfully`, 'success');
      let formArray = this.wrapupTimeForm.controls['timings'] as FormArray;
    let index=null;
    for(var i=0;i<formArray.length;i++)
    {
      const element=formArray.at(i);
      if(element.value.roleID === role.roleID)
      {
         index=i;
        break;
      }
    }
    if(index !=null)
    (<FormGroup>formArray.at(index)).controls['uncheck'].setValue(null);
      this.getActiveRoles(this.providerServiceMapID);
    })
  }
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
