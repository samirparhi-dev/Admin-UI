import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { FeedbackTypeService } from '../services/ProviderAdminServices/feedback-type-master-service.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-feedback-type-master',
  templateUrl: './feedback-type-master.component.html',
  styleUrls: ['./feedback-type-master.component.css']
})
export class FeedbackTypeMasterComponent implements OnInit {
  feedbackNameExist: boolean = false;
  userID: any;
  previous_state_id: any;
  previous_service_id: any;
  feedbackDesc: any;
  feedbackName: any;

  search_state: any;
  search_serviceline: any;
  searchForm: boolean = true;
  showTable: boolean = false;
  serviceProviderID: any;
  states = [];
  servicelines = [];
  feedbackTypes = [];
  providerServiceMapID: any;
  confirmMessage: any;
  objs = [];
  @ViewChild('searchFTForm') searchFTForm: NgForm;
  @ViewChild('addForm') addForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;
  feedbackExists: boolean = false;
  isNational = false;
  searchFeedbackArray = [];
  msg = "Feedback Name already exists";

  constructor(private commonData: dataService,
    private FeedbackTypeService: FeedbackTypeService,
    private alertService: ConfirmationDialogsService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.serviceProviderID = this.commonData.service_providerID;
    this.userID = this.commonData.uid;
    this.getServiceLinesfromSearch(this.userID);

  }

  setIsNational(value) {
    this.isNational = value;
  }

  getStates(serviceID, isNational) {
    this.FeedbackTypeService.getStates(this.userID, serviceID, isNational)
      .subscribe((response) => {
        console.log("states", response);
        this.search_state = "";
        this.states = response;
        this.feedbackTypes = [];

        if (isNational) {
          this.findFeedbackTypes(this.states[0].providerServiceMapID);
        }
      }, (err) => this.alertService.alert(err, 'error'));
  }

  getServiceLinesfromSearch(userID) {
    this.FeedbackTypeService.getServiceLines(userID)
      .subscribe((response) => {
        console.log("services", response);
        // this.search_serviceline = "";
        this.servicelines = response;
      }, (err) => this.alertService.alert(err, 'error'));
  }

  findFeedbackTypes(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    this.FeedbackTypeService.getFeedbackTypes({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      console.log("FeedbackTypes", response);
      this.feedbackTypes = response;
      this.showTable = true;
    }, (err) => this.alertService.alert(err, 'error'));
  }

  clear() {
    this.searchFTForm.resetForm();
    this.servicelines = [];
    console.log("state", this.search_state);
    console.log("serviceLine", this.search_serviceline);
    this.feedbackTypes = [];
    this.showTable = false;
  }

  editFeedback(feedbackObj) {
    console.log("feedbackObj", feedbackObj);
    let dialog_Ref = this.dialog.open(EditFeedbackModal, {
      width: '500px',
      disableClose: true,
      data: {
        'feedbackObj': feedbackObj,
        'feedbackTypes': this.feedbackTypes,
        'service': this.search_serviceline
      }
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.findFeedbackTypes(this.providerServiceMapID);
      }

    });
  }

  activeDeactivate(id, flag) {
    let obj = {
      "feedbackTypeID": id,
      "deleted": flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.alertService.confirm('Confirm', "Are you sure want you to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log("reqObj", obj);
        this.FeedbackTypeService.deleteFeedback(obj)
          .subscribe((res) => {
            this.alertService.alert(this.confirmMessage + "d successfully", 'success');
            this.findFeedbackTypes(this.providerServiceMapID);
          }, (err) => this.alertService.alert(err, 'error'));
      }
    },
      (err) => {
        console.log(err);
      })
  }
  back() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.changeTableFlag(true);
      }
    });
  }

  changeTableFlag(flag) {
    this.searchForm = flag;
    // this.previous_state_id=this.search_state;
    // this.previous_service_id=this.search_serviceline;
    if (flag === true) {
      this.objs = [];
    }
  }

  validateFeedback(feedback) {
    // console.log("check",feedback);
    this.feedbackExists = false;
    this.searchFeedbackArray = this.feedbackTypes.concat(this.objs);
    console.log("searchArray", this.searchFeedbackArray);
    let count = 0;
    for (var i = 0; i < this.searchFeedbackArray.length; i++) {
      if (feedback.toUpperCase() == this.searchFeedbackArray[i].feedbackTypeName.toUpperCase()) {
        // console.log("gotcha",feedback,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if (count > 0) {
      // console.log("error found");
      this.feedbackExists = true;
    }




  }

  saveFeedback() {
    // console.log("dataObj", obj);
    var tempArr = [];
    for (var i = 0; i < this.objs.length; i++) {
      var tempObj = {
        "feedbackTypeName": this.objs[i].feedbackTypeName,
        "feedbackDesc": this.objs[i].feedbackDesc,
        "providerServiceMapID": this.providerServiceMapID,
        "createdBy": "Admin"
      }

      if (this.objs[i].feedbackTypeName == "Generic Complaint") {
        tempObj['FeedbackTypeCode'] = 'GC';
      }
      else if (this.objs[i].feedbackTypeName == "Asha Complaints") {
        tempObj['FeedbackTypeCode'] = 'AC';
      }
      else if (this.objs[i].feedbackTypeName == "Epidemic Complaints") {
        tempObj['FeedbackTypeCode'] = 'EC';
      }
      else if (this.objs[i].feedbackTypeName == "Foodsafety Complaints") {
        tempObj['FeedbackTypeCode'] = 'FC';
      }
      tempArr.push(tempObj);
    }
    "FeedbackTypeCode"
    console.log("reqObj", tempArr);
    this.FeedbackTypeService.saveFeedback(tempArr)
      .subscribe((res) => {
        console.log("response", res);
        this.searchForm = true;
        this.alertService.alert("Saved successfully", 'success');
        this.previous_state_id = this.search_state;
        this.previous_service_id = this.search_serviceline;
        this.addForm.resetForm();
        this.objs = [];

        this.search_state = this.previous_state_id;
        this.search_serviceline = this.previous_service_id;

        this.findFeedbackTypes(this.providerServiceMapID);
      }, (err) => this.alertService.alert(err, 'error'));
  }

  add_obj(name, desc) {
    debugger;
    var tempObj = {
      "feedbackTypeName": name,
      "feedbackDesc": desc
    }
    console.log(tempObj);
    if (this.objs.length == 0) {
      var count = 0;
      for (let i = 0; i < this.feedbackTypes.length; i++) {
        if (this.feedbackTypes[i].feedbackTypeName.toUpperCase() === tempObj.feedbackTypeName.toUpperCase()) {
          count = count + 1;
        }
      }

      if (count == 0) {
        this.objs.push(tempObj);
        this.editForm.resetForm();
        //this.feedbackDesc = undefined;
        //this.feedbackName = undefined;
      }
      else {
        this.feedbackNameExist = true;
        this.alertService.alert("Already exists");
      }
    }
    else {
      var count = 0;
      for (let i = 0; i < this.objs.length; i++) {
        // console.log(this.feedbackTypes[i].feedbackTypeName,tempObj.feedbackTypeName);
        if (this.objs[i].feedbackTypeName.toUpperCase() === tempObj.feedbackTypeName.toUpperCase()) {
          count = count + 1;
        }
      }

      for (let i = 0; i < this.feedbackTypes.length; i++) {
        if (this.feedbackTypes[i].feedbackTypeName.toUpperCase() === tempObj.feedbackTypeName.toUpperCase()) {
          count = count + 1;
        }
      }

      if (count == 0) {
        this.objs.push(tempObj);
        this.editForm.resetForm();
      }
      else {
        //this.feedbackNameExist = true;
        this.alertService.alert("Already exists");
      }
    }



    // this.validateFeedback(name);
  }
  checkExistance() {
    this.feedbackNameExist = false;
  }

  remove_obj(index) {
    this.objs.splice(index, 1);
  }

}

@Component({
  selector: 'editFeedbackModal',
  templateUrl: './edit-feedback-type-dialog.html',
})
export class EditFeedbackModal {

  feedbackName: any;
  feedbackDesc: any;
  originalName: any;
  searchFeedbackArray = [];
  feedbackExists: boolean = false;
  msg = "Feedback Name already exists";

  service: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public FeedbackTypeService: FeedbackTypeService,
    public dialog_Ref: MdDialogRef<EditFeedbackModal>,
    private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
    console.log("update this data", this.data);
    this.feedbackName = this.data.feedbackObj.feedbackTypeName;
    this.originalName = this.data.feedbackObj.feedbackTypeName;
    this.feedbackDesc = this.data.feedbackObj.feedbackDesc;
    this.searchFeedbackArray = this.data.feedbackTypes;

    this.service = this.data.service;
  }

  update() {
    var tempObj = {
      "feedbackTypeID": this.data.feedbackObj.feedbackTypeID,
      "feedbackTypeName": this.feedbackName,
      "feedbackDesc": this.feedbackDesc,
      "modifiedBy": this.data.feedbackObj.createdBy
    }
    if (this.feedbackName == "Generic Complaint") {
      tempObj['FeedbackTypeCode'] = 'GC';
    }
    else if (this.feedbackName == "Asha Complaints") {
      tempObj['FeedbackTypeCode'] = 'AC';
    }
    else if (this.feedbackName == "Epidemic Complaints") {
      tempObj['FeedbackTypeCode'] = 'EC';
    }
    else if (this.feedbackName == "Foodsafety Complaints") {
      tempObj['FeedbackTypeCode'] = 'FC';
    }

    this.FeedbackTypeService.editFeedback(tempObj)
      .subscribe((res) => {
        this.dialog_Ref.close("success");
        this.alertService.alert("Updated successfully", 'success');
      }, (err) => this.alertService.alert(err, 'error'));

  }

  validateFeedback(feedback) {
    console.log("check", feedback);
    this.feedbackExists = false;
    console.log("searchArray", this.searchFeedbackArray);
    let count = 0;
    for (var i = 0; i < this.searchFeedbackArray.length; i++) {
      if (feedback.toUpperCase() === this.searchFeedbackArray[i].feedbackTypeName.toUpperCase() && feedback.toUpperCase() != this.originalName.toUpperCase()) {
        // console.log("gotcha",feedback,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if (count > 0) {
      // console.log("error found");
      this.feedbackExists = true;
    }
  }

}
