import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from 'app/services/dataService/data.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { CallibrationMasterServiceService } from 'app/services/ProviderAdminServices/callibration-master-service.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';

@Component({
  selector: 'app-calibration-master',
  templateUrl: './calibration-master.component.html',
  styleUrls: ['./calibration-master.component.css']
})
export class CalibrationMasterComponent implements OnInit {
  createdBy: any;
  state: any;
  service: any;
  userID: any;
  services: any;
  states: any;
  searchresultarray: any = [];
  filteredsearchresultarray: any = [];
  today: Date;
  expiryDate: any;
  stripCode: any;
  confirmMessage: any;
  //flags
  stripCodeExist: boolean = false;
  disableSelection: boolean = false;
  showCalibrationCreationForm: boolean = false;
  editHeading: boolean = false;
  nationalFlag: boolean;
  tableMode = false;
  formMode = false;
  editMode = false;

  @ViewChild('stripCodeForm') stripCodeForm: NgForm;
  calibrationStripId: any;
  constructor(public provider_AdminRoleService: ProviderAdminRoleService, public data_service: dataService,
    public alertService: ConfirmationDialogsService, public calibrationService: CallibrationMasterServiceService) { }

  ngOnInit() {
    this.createdBy = this.data_service.uname;
    this.userID = this.data_service.uid;
    this.getServiceLines();
    this.today = new Date();
  }
  getServiceLines() {
    this.provider_AdminRoleService.getServiceLinesCalibrationNew(this.userID).subscribe((response) => {
      if(response){
      this.services = this.successhandeler(response)
      }
      else{
        this.alertService.alert(response.errorMessage);
      }
    }, (err) => {
      console.log(err, 'error');
    });
  }
  successhandeler(response) {
    return response;
  }
  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.provider_AdminRoleService.getStatesNew(obj).
      subscribe(response => {
        if(response){
        this.statesSuccesshandeler(response, value)
        }
        else{
          this.alertService.alert(response.errorMessage);
        }
      }, (err) => {
        console.log(err, 'error');
      });
  }
  statesSuccesshandeler(response, value) {
    this.state = '';
    this.states = response;
    this.searchresultarray = [];
    this.filteredsearchresultarray = [];
    if (value.isNational) {
      this.nationalFlag = value.isNational;
      this.setProviderServiceMapID(response[0].providerServiceMapID);
    }
    else {
      this.nationalFlag = value.isNational;
    }
  }
  setProviderServiceMapID(ProviderServiceMapID) {
    this.data_service.provider_serviceMapID = ProviderServiceMapID;
    this.getCalibrationStrips(null);
  }
  getCalibrationStrips(stripCode) {
    let obj = {
      "providerServiceMapID": this.data_service.provider_serviceMapID
    }
    this.calibrationService.fetCalibrationMasters(obj).subscribe((response) => {
      console.log("stripdata", response);
      if (response.statusCode == 200) {
        this.searchresultarray = response.data.calibrationData;
        this.filteredsearchresultarray = response.data.calibrationData;
        console.log("this.filteredsearchresultarray",  this.filteredsearchresultarray)
        this.tableMode = true;
        if(stripCode != null && stripCode != undefined)
        {
           this.filterComponentList(stripCode);
        }
      }
      else{
        this.alertService.alert(response.errorMessage);
      }
    }, err => {
      console.log(err, 'error');
    });
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchresultarray = this.searchresultarray;
    } else {
      this.filteredsearchresultarray = [];
      this.searchresultarray.forEach((item) => {
        for (let key in item) {
          if (key == 'stripCode') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchresultarray.push(item); break;
            }
          }
        }
      });
    }
  }
  //start showing Calibration and form mode
  showForm(flag) {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = flag;
    this.editHeading = false;
    this.disableSelection = true;
    this.showCalibrationCreationForm = true;
    this.stripCodeExist = false;
    this.stripCode = null;
    this.expiryDate = null;
  }
  back() {
    this.alertService.confirm('Confirm', 'Do you really want to cancel? Any unsaved data would be lost').subscribe(res => {
      if (res) {
        this.filteredsearchresultarray=this.searchresultarray;
        this.redirectToMainPage();
      }
    })
  }
  redirectToMainPage() {
    this.tableMode = true;
    this.formMode = false;
    this.editHeading = false;
    this.disableSelection = false;
    this.showCalibrationCreationForm = false;
    this.stripCodeExist = false;
    this.stripCodeForm.resetForm();
  }
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  editCalibrationStrip(stripObj) {
    this.stripCode = stripObj.stripCode;
    this.expiryDate = stripObj.expiryDate;
    this.calibrationStripId = stripObj.calibrationStripID
    this.showCalibrationCreationForm = true;
    this.editHeading = true;
    this.disableSelection = true;
    this.stripCodeExist = false;
    this.tableMode = false;
    this.formMode = true;
    this.editMode = true;
  }
  //end
  save_UpdateStripCode(saveType) {
    //if (this.validateRole(this.stripCode)) {
    let obj;
    if (saveType == 'save') {
      obj = {
        "stripCode": this.stripCode,
        "expiryDate": this.expiryDate == null ? null : new Date(this.expiryDate - 1 * this.expiryDate.getTimezoneOffset() * 60 * 1000),
        "providerServiceMapID": this.data_service.provider_serviceMapID,
        "createdBy": this.createdBy
      }
      this.calibrationService.createCalibrationStrip(obj).subscribe((response) => {
        if (response.statusCode == 200) {
          this.edit_delete_save_SuccessHandeler('response', "save");
          this.redirectToMainPage();
          this.getCalibrationStrips(null);
        }
        
        else{
          this.alertService.alert(response.errorMessage);
        }
      }, err => {
        console.log(err, 'error');
        
          this.alertService.alert(err.errorMessage);
      });
      console.log('request object', this.stripCode, this.expiryDate);
    }
    else {
      obj = {
        "stripCode": this.stripCode,
        "expiryDate": this.expiryDate == null ? null : new Date(this.expiryDate),
        "providerServiceMapID": this.data_service.provider_serviceMapID,
        "createdBy": this.createdBy,
        "calibrationStripID": this.calibrationStripId,
        "deleted": false
      }
      this.updateCalibrationData(obj);
    }
    
  }

  updateCalibrationData(obj)
  {
    this.calibrationService.updateCalibrationStrip(obj).subscribe((response) => {
      if (response.statusCode == 200) {
        this.edit_delete_save_SuccessHandeler('response', "edit");
        this.redirectToMainPage();
        this.getCalibrationStrips(null);
      }
      
      else{
        this.alertService.alert(response.errorMessage);
      }
    }, err => {
      console.log(err, 'error');
    });
    console.log('request object', this.stripCode, this.expiryDate);
   
  }
  //}
  activateDeactivate(calibrationStripID, flag, stripCode) {
    let obj = {
      "calibrationStripID": calibrationStripID,
      "deleted": flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.alertService.confirm('Confirm', 'Are you sure you want to ' + this.confirmMessage + '?').subscribe((res) => {
      if (res) {
        console.log("obj", obj);
        this.calibrationService.deleteCalibrationStrip(obj).subscribe((response) => {
          if(response.statusCode == 200){
          console.log('data', response);
          this.edit_delete_save_SuccessHandeler('response', 'delete');
          this.getCalibrationStrips(stripCode);
        }
        else{
          this.alertService.alert(response.errorMessage);
        }
        }, err => {
          console.log(err, 'error');
        });
      }
    },
      (err) => {
        console.log(err, 'error');
      })
  }
  edit_delete_save_SuccessHandeler(response, choice) {
    if (choice == 'edit') {
      this.alertService.alert('Updated successfully', 'success');
    }
    else if (choice == 'save') {
      this.alertService.alert('Saved successfully', 'success');
    }
    else {
      this.alertService.alert(this.confirmMessage + 'd successfully', 'success');
    }
  }
  validateRole(stripcode) {
    var count = 0;
    for (let i = 0; i < this.searchresultarray.length; i++) {
      if ((this.searchresultarray[i].stripCode).trim().toUpperCase() === stripcode.trim().toUpperCase()) {
        count = count + 1;
      }
    }
    if (count > 0) {
      this.stripCodeExist = true;
      return false;
    }
    else {
      this.stripCodeExist = false;
      return true;
    }
  }
}
