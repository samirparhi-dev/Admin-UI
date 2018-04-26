import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { InstituteTypeMasterService } from '../services/ProviderAdminServices/institute-type-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-institute-type-master',
  templateUrl: './institute-type-master.component.html',
  styleUrls: ['./institute-type-master.component.css']
})
export class InstituteTypeMasterComponent implements OnInit {

  /*ngModels*/
  serviceProviderID: any;
  providerServiceMapID: any;
  state: any;
  service: any;

  instituteType: any;
  description: any;
  typeExists: any;
  userID: any;

  /*arrays*/
  states: any = [];
  services: any = [];
  searchInstituteTypeArray: any = [];
  searchResultArray: any = [];
  bufferArray: any = [];

  /*flags*/
  showTableFlag: boolean = false;
  showFormFlag: boolean = false;
  disableSelection: boolean = false;
  isNational = false;

  // @ViewChild ('searchFields') searchFields: NgForm;
  // @ViewChild ('entryField') entryField: NgForm;
  constructor(public _instituteTypeMasterService: InstituteTypeMasterService,
    public commonDataService: dataService,
    public dialog: MdDialog,
    public alertService: ConfirmationDialogsService) {

    this.serviceProviderID = this.commonDataService.service_providerID;
    this.userID = this.commonDataService.uid;

  }

  ngOnInit() {
    this.getServices(this.userID);
  }

  setIsNational(value) {
    this.isNational = value;
  }


  getServices(userID) {
    this._instituteTypeMasterService.getServices(userID)
      .subscribe(response => this.getServicesSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });
  }

  getServicesSuccessHandeler(response) {
    console.log("SERVICES", response);
    this.services = response.filter(function (item) {
      if (item.serviceID != 6) {
        return item;
      }
    });
  }

  getStates(serviceID, isNational) {
    this._instituteTypeMasterService.getStates(this.userID, serviceID, isNational)
      .subscribe(response => this.getStatesSuccessHandeler(response, isNational), err => {
        this.alertService.alert(err, 'error');
      });
  }

  getStatesSuccessHandeler(response, isNational) {
    this.state = '';
    console.log("STATE", response);
    this.states = response;
    if (isNational) {
      this.setProviderServiceMapID(this.states[0].providerServiceMapID);
    }
    else {
      this.searchResultArray = [];
    }
  }

  setProviderServiceMapID(providerServiceMapID) {
    console.log("providerServiceMapID", providerServiceMapID);
    this.providerServiceMapID = providerServiceMapID;
    this.search(providerServiceMapID);
  }

  search(providerServiceMapID) {
    this._instituteTypeMasterService.getInstituteType(providerServiceMapID)
      .subscribe(response => this.searchSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      })
  }

  searchSuccessHandeler(response) {
    if (response) {
      this.showTableFlag = true;
      this.searchResultArray = response;
    }
  }

  clear() {
    /*resetting the search fields*/
    this.state = "";
    this.service = "";
    this.providerServiceMapID = "";

    this.services = [];
    /*resetting the flag*/
    this.showTableFlag = false;
    /*resetting the search result array*/
    this.searchResultArray = [];
  }

  showForm() {
    this.showTableFlag = false;
    this.showFormFlag = true;

    this.disableSelection = true;
  }
  navigateToPrev() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.back();
      }
    })
  }
  back() {
    this.showTableFlag = true;
    this.showFormFlag = false;
    /*reset the input fields of the form*/
    //	this.instituteType="";
    this.description = "";
    this.bufferArray = [];

    this.disableSelection = false;
  }


  toggle_activate(institutionTypeID, isDeleted) {
    if (isDeleted === true) {
      this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
        if (response) {
          let obj = {
            "institutionTypeID": institutionTypeID,
            "deleted": isDeleted
          };

          this._instituteTypeMasterService.toggle_activate_InstituteType(obj)
            .subscribe(response => this.toggleActivateSuccessHandeler(response, "Deactivated"), err => {
              this.alertService.alert(err, 'error');
            })
        }
      });
    }

    if (isDeleted === false) {
      this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
        if (response) {
          let obj = {
            "institutionTypeID": institutionTypeID,
            "deleted": isDeleted
          };

          this._instituteTypeMasterService.toggle_activate_InstituteType(obj)
            .subscribe(response => this.toggleActivateSuccessHandeler(response, "Activated"), err => {
              this.alertService.alert(err, 'error');
            })
        }
      });
    }

  }

  toggleActivateSuccessHandeler(response, action) {
    console.log(response, "delete Response");
    if (response) {
      this.alertService.alert(action + " successfully", 'success')
      this.search(this.providerServiceMapID);
    }
  }

  add_obj(institute_type, description) {
    let obj = {

      "institutionType": institute_type,
      "institutionTypeDesc": description,
      "providerServiceMapID": this.providerServiceMapID,
      "createdBy": this.commonDataService.uname
    }

    if (this.bufferArray.length == 0 && (obj.institutionType != "" && obj.institutionType != undefined)) {
      this.bufferArray.push(obj);
    }
    else {
      let count = 0;
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (obj.institutionType === this.bufferArray[i].institutionType) {
          count = count + 1;
        }
      }
      if (count == 0 && (obj.institutionType != "" && obj.institutionType != undefined)) {
        this.bufferArray.push(obj);
      }
      else {
        this.alertService.alert("Already exists");
      }
    }
    // this.entryField.resetForm();

    /*resetting fields after entering in buffer array/or if duplicate exist*/
    this.instituteType = "";
    this.description = "";

  }

  removeObj(index) {
    this.bufferArray.splice(index, 1);
  }

  save() {
    this._instituteTypeMasterService.saveInstituteType(this.bufferArray)
      .subscribe(response => this.saveSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });
  }

  saveSuccessHandeler(response) {
    console.log("response", response);
    if (response) {
      this.alertService.alert("Saved successfully", 'success');
      this.back();
      this.search(this.providerServiceMapID);
    }
  }


  openEditModal(toBeEditedOBJ) {
    let dialog_Ref = this.dialog.open(EditInstituteType, {
      width: '500px',
      disableClose: true,
      data: toBeEditedOBJ
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.alertService.alert("Updated successfully", 'success')
        this.search(this.providerServiceMapID);
      }

    });

  }

}


@Component({
  selector: 'edit-institute-type',
  templateUrl: './edit-institute-type-modal.html'
})
export class EditInstituteType {

  instituteType: any;
  description: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public _instituteTypeMasterService: InstituteTypeMasterService,
    public commonDataService: dataService,
    public dialogReff: MdDialogRef<EditInstituteType>) { }

  ngOnInit() {
    console.log("dialog data", this.data);
    this.instituteType = this.data.institutionType;
    this.description = this.data.institutionTypeDesc;
  }


  update(edited_institute_type_name, edited_institute_type_description) {
    let obj = {

      "institutionTypeID": this.data.institutionTypeID,
      "institutionType": edited_institute_type_name,
      "institutionTypeDesc": edited_institute_type_description,
      "modifiedBy": this.commonDataService.uname

    }
    this._instituteTypeMasterService.editInstituteType(obj)
      .subscribe(response => this.updateSuccessHandeler(response), err => {
        console.log(err, 'Error');
      });
  }

  updateSuccessHandeler(response) {
    console.log(response, "edit response success");
    if (response) {
      this.dialogReff.close("success");
    }
  }
}
