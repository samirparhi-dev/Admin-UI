import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { FeedbackTypeService } from '../services/ProviderAdminServices/feedback-type-master-service.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-feedback-complaint-nature-master',
  templateUrl: './feedback-complaint-nature-master.component.html',
  styleUrls: ['./feedback-complaint-nature-master.component.css']
})
export class FeedbackComplaintNatureMasterComponent implements OnInit {
  filterednatureTypes: any = [];
  previous_state_id: any;
  previous_service_id: any;
  previous_feedbacktype: any;


  search_state: any;
  search_serviceline: any;
  search_feedbacktype: any;
  searchForm = true;
  showTable = false;
  serviceProviderID: any;
  states = [];
  servicelines = [];
  feedbackTypes = [];
  natureTypes = [];
  providerServiceMapID: any;
  feedbackTypeID: any;
  confirmMessage: any;
  objs = [];
  @ViewChild('searchCNForm') searchCNForm: NgForm;
  @ViewChild('addForm') addForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;
  natureExists = false;
  searchFeedbackNatureArray = [];
  msg = 'Complaint nature already exists';

  isNational = false;
  userID: any;


  feedbackNature: any;
  feedbackNatureDesc: any;

  constructor(private commonData: dataService,
    private _feedbackTypeService: FeedbackTypeService,
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
    this._feedbackTypeService.getStates(this.userID, serviceID, isNational)
      .subscribe((response) => {
        console.log("states", response);
        this.search_state = "";
        this.states = response;
        this.feedbackTypes = [];
        this.natureTypes = [];
        this.filterednatureTypes = [];

        if (isNational) {
          this.findFeedbackTypes(this.states[0].providerServiceMapID);
        }
      }, err => {
        console.log("Error", err);
        // this.alertService.alert(err, 'error');
      })
  }

  getServiceLinesfromSearch(userID) {
    this._feedbackTypeService.getServiceLines(userID)
      .subscribe((response) => {
        console.log("services", response);
        // this.search_serviceline = "";
        this.servicelines = response;
      }, err => {
        console.log("Error", err);
        // this.alertService.alert(err, 'error');
      })
  }


  findFeedbackTypes(providerServiceMapID) {
    this.search_feedbacktype = '';
    this.providerServiceMapID = providerServiceMapID;
    this._feedbackTypeService.getFeedbackTypes_nature({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      console.log("FeedbackTypes", response);
      this.feedbackTypes = response;
      this.natureTypes = [];
      this.filterednatureTypes = [];
    }, err => {
      console.log("Error", err);
      // this.alertService.alert(err, 'error');
    })
  }

  findFeedbackNature(feedbackTypeID) {
    this.feedbackTypeID = feedbackTypeID;
    var tempObj = {
      "feedbackTypeID": this.feedbackTypeID
    }
    this._feedbackTypeService.getFeedbackNatureTypes(tempObj)
      .subscribe((response) => {
        console.log("Feedback Nature Types", response);
        this.natureTypes = response;
        this.filterednatureTypes = response;
        this.showTable = true;
      }, err => {
        console.log("Error", err);
        // this.alertService.alert(err, 'error');
      })
  }

  editFeedbackNature(feedbackObj) {
    console.log("feedbackObj", feedbackObj);
    let dialog_Ref = this.dialog.open(EditFeedbackNatureModal, {
      width: '500px',
      disableClose: true,
      data: {
        'feedbackObj': feedbackObj,
        'natureTypes': this.natureTypes
      }
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.alertService.alert('Updated successfully', 'success');
        this.findFeedbackNature(this.feedbackTypeID);
      }

    });
  }

  clear() {
    this.searchCNForm.resetForm();
    console.log("state", this.search_state);
    console.log("serviceLine", this.search_serviceline);
    this.natureTypes = [];
    this.filterednatureTypes = [];
    this.showTable = false;
  }

  activeDeactivate(id, flag) {
    let obj = {
      'feedbackNatureID': id,
      'deleted': flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.alertService.confirm('Confirm', 'Are you sure you want to ' + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log('reqObj', obj);
        this._feedbackTypeService.deleteFeedbackNatureType(obj)
          .subscribe((res) => {
            this.alertService.alert(this.confirmMessage + 'd successfully', 'success');
            this.findFeedbackNature(this.feedbackTypeID);
          },
            (err) => {
              console.log("Error", err);
              // this.alertService.alert(err, 'error');
            })
      }
    },
      (err) => {
        console.log("Error", err);
        // this.alertService.alert(err, 'error');
      })
  }

  changeTableFlag(flag) {
    this.searchForm = flag;
  }
  changeTableFlag1(flag) {
    this.searchForm = flag;
    this.feedbackNature = undefined;
    this.feedbackNatureDesc = undefined;
  }

  validateFeedbackNature(feedbackNature) {
    // console.log("check",feedbackNature);
    this.natureExists = false;
    // this.searchFeedbackNatureArray = this.natureTypes.concat(this.objs);
    console.log("searchArray", this.searchFeedbackNatureArray);
    let count = 0;
    for (var i = 0; i < this.natureTypes.length; i++) {
      if (feedbackNature.toUpperCase() === this.natureTypes[i].feedbackNature.toUpperCase()) {
        // console.log("gotcha",feedbacknature,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if (count > 0) {
      // console.log("error found");

      this.natureExists = true;

    }
  }

  saveComplaintNature() {
    // console.log("dataObj", obj);
    var tempArr = [];
    for (var i = 0; i < this.objs.length; i++) {
      var tempObj = {
        'feedbackNature': this.objs[i].feedbackNature,
        'feedbackNatureDesc': this.objs[i].feedbackNatureDesc,
        'feedbackTypeID': this.feedbackTypeID,
        'createdBy': this.commonData.uname
      }
      tempArr.push(tempObj);
    }

    console.log("reqObj", tempArr);
    this._feedbackTypeService.saveFeedbackNatureType(tempArr)
      .subscribe((res) => {
        console.log("response", res);
        this.searchForm = true;
        this.alertService.alert('Saved successfully', 'success');
        this.previous_state_id = this.search_state;
        this.previous_service_id = this.search_serviceline;
        this.previous_feedbacktype = this.search_feedbacktype;
        this.addForm.resetForm();
        this.objs = [];

        this.search_state = this.previous_state_id;
        this.search_serviceline = this.previous_service_id;
        this.search_feedbacktype = this.previous_feedbacktype;

        this.findFeedbackNature(this.feedbackTypeID);
      }, err => {
        // this.alertService.alert(err, 'error');
      })
  }

  add_obj(nature, desc) {
    var tempObj = {
      'feedbackNature': nature,
      'feedbackNatureDesc': desc
    }
    console.log(tempObj);
    // this.objs.push(tempObj);   
    this.validateFeedbackNature(nature);
    this.checkDuplicates(tempObj);
    //this.feedbackNature = null;
    // this.feedbackNatureDesc = null;
    this.natureExists = false;
    console.log("this.feedbackNature", this.feedbackNature);

  }
  back() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.changeTableFlag(true);

        this.objs = [];
        this.changeTableFlag(true);
      }
    });
  }
  checkDuplicates(tempObj) {
    debugger;
    let duplicateValue = 0;
    if (this.objs.length === 0) {
      this.objs.push(tempObj);
    }
    else {
      for (let i = 0; i < this.objs.length; i++) {
        if (this.objs[i].feedbackNature === tempObj.feedbackNature
        ) {
          duplicateValue = duplicateValue + 1;
        }
      }
      if (duplicateValue === 0) {
        this.objs.push(tempObj);
      }
      else {
        this.alertService.alert("Already exists");
      }
    }
  }


  remove_obj(index) {
    this.objs.splice(index, 1);
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filterednatureTypes = this.natureTypes;
    } else {
      this.filterednatureTypes = [];
      this.natureTypes.forEach((item) => {
        for (let key in item) {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filterednatureTypes.push(item); break;
          }
        }
      });
    }

  }

}

@Component({
  selector: 'editFeedbackNatureModal',
  templateUrl: './edit-feedback-nature-dialog.html',
})
export class EditFeedbackNatureModal {

  feedbackNature: any;
  feedbackNatureDesc: any;
  originalNature: any;
  searchFeedbackArray = [];
  natureExists: boolean = false;
  msg = "Complaint nature already exists";

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
    public _feedbackTypeService: FeedbackTypeService,
    public dialog_Ref: MdDialogRef<EditFeedbackNatureModal>,
    private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
    console.log("update this data", this.data);
    this.feedbackNature = this.data.feedbackObj.feedbackNature;
    this.originalNature = this.data.feedbackObj.feedbackNature;
    this.feedbackNatureDesc = this.data.feedbackObj.feedbackNatureDesc;
    this.searchFeedbackArray = this.data.natureTypes;
  }

  update() {
    var tempObj = {
      "feedbackNatureID": this.data.feedbackObj.feedbackNatureID,
      "feedbackNature": this.feedbackNature,
      "feedbackNatureDesc": this.feedbackNatureDesc,
      "modifiedBy": this.data.feedbackObj.createdBy
    }

    this._feedbackTypeService.editFeedbackNatureType(tempObj)
      .subscribe((res) => {
        this.dialog_Ref.close("success");
        // this.alertService.alert("Feedback Nature edited successfully");
      }, err => {
        this.alertService.alert(err, 'error');
      })

  }

  validateFeedback(feedbackNature) {
    console.log("check", feedbackNature);
    this.natureExists = false;
    console.log("searchArray", this.searchFeedbackArray);
    let count = 0;
    for (var i = 0; i < this.searchFeedbackArray.length; i++) {
      if (feedbackNature.toUpperCase() === this.searchFeedbackArray[i].feedbackNature.toUpperCase() && feedbackNature.toUpperCase() != this.originalNature.toUpperCase()) {
        // console.log("gotcha",feedbackNature,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if (count > 0) {
      // console.log("error found");
      this.natureExists = true;
    }
  }
}
