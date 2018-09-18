import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NatureOfCompaintCategoryMappingService } from '../services/ProviderAdminServices/nature-of-complaint-category-mapping.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-nature-of-complaint-category-mapping',
  templateUrl: './nature-of-complaint-category-mapping.component.html',
  styleUrls: ['./nature-of-complaint-category-mapping.component.css']
})
export class NatureOfComplaintCategoryMappingComponent implements OnInit {

  serviceline: any;
  state: any;
  feedbacktype: any;
  complaintType: any;
  category: any;
  userID: any;
  oldCategoryID: any;
  createdBy: any;
  showListOfCategorymapping: boolean = true;
  showTable: boolean = false;
  disableSelection: boolean = false;
  editable: any = false;
  createButton: boolean = false;
  editCategoryMappingValues: any;

  /*Arrays*/
  servicelines: any = [];
  states: any = [];
  feedbackTypes: any = [];
  natureTypes: any = [];
  mappings: any = [];
  categories: any = [];
  complaintCategoryMappingList: any = [];
  existingCategory: any = [];
  availableCategory: any = [];
  bufferArrayList: any = [];

  @ViewChild('categoryForm') categoryForm: NgForm;
  @ViewChild('searchForm') searchForm: NgForm;

  constructor(public commonDataService: dataService,
    public complaintMappingService: NatureOfCompaintCategoryMappingService,
    public dialog: MdDialog,
    private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.createdBy = this.commonDataService.uname;
    this.getServicelines();
  }

  getServicelines() {
    this.complaintMappingService.getServiceLines(this.userID).subscribe((response) => {
      this.getServicesSuccessHandeler(response),
        (err) => {
          console.log("ERROR in fetching serviceline", err);
        }
    });
  }
  getServicesSuccessHandeler(response) {
    this.servicelines = response;
  }

  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.complaintMappingService.getStates(obj).subscribe((response) => {
      this.getStatesSuccessHandeler(response),
        (err) => {
          console.log("error in fetching states", err);
        }
    });

  }
  getStatesSuccessHandeler(response) {
    this.states = response;
    this.createButton = false;
  }

  getFeedbackTypes(providerServiceMapID) {
    this.mappings = [];
    this.searchForm.controls.complaintType.reset();
    this.complaintMappingService.getFeedbackTypes(providerServiceMapID).subscribe((response) => {
      this.feedbackTypes = response;
      this.createButton = false;
    }, err => {
      console.log("Error", err);
    })
  }

  getFeedbackNature(feedbackTypeID) {
    this.mappings = [];
    var tempObj = {
      "feedbackTypeID": feedbackTypeID
    }
    this.complaintMappingService.getFeedbackNatureTypes(tempObj)
      .subscribe((response) => {
        console.log("Feedback Nature Types", response);
        this.natureTypes = response;
        this.createButton = false;
      }, err => {
        console.log("Error", err);
      })
  }

  getComplaintTypeCategoryMapping(providerServiceMapID, feedbackNatureID) {
    let reqObj = {
      "providerServiceMapID": providerServiceMapID,
      "feedbackNatureID": feedbackNatureID
    }
    this.complaintMappingService.getMapping(reqObj)
      .subscribe((response) => {
        console.log("Mappings", response);
        this.mappings = response;
        this.showTable = true;
        this.createButton = true;
      }, err => {
        console.log("Error", err);
      })
  }

  showForm() {
    this.showTable = false;
    this.showListOfCategorymapping = false;
    this.disableSelection = true;
    this.getCategories(this.state.providerServiceMapID);
  }

  getCategories(providerServiceMapID) {
    this.complaintMappingService.getAllCategory(providerServiceMapID)
      .subscribe((response) => {
        console.log("Mappings", response);
        this.categories = response;
        if (this.categories) {
          this.checkExistance(providerServiceMapID);
        }
      }, err => {
        console.log("Error", err);
      })
  }

  checkExistance(providerServiceMapID) {
    this.complaintMappingService.filterMappedCategory(providerServiceMapID).subscribe((response) => {
      this.availableCategory = response;
      console.log("availableCategory", this.availableCategory);
      if (!this.editable) {
        if (this.complaintCategoryMappingList.length > 0) {
          this.complaintCategoryMappingList.forEach((complaintMappingList) => {
            this.bufferArrayList.push(complaintMappingList.categoryID);
          })
        }
        let bufferTemp = [];
        this.availableCategory.forEach((bufferCategory) => {
          let index = this.bufferArrayList.indexOf(bufferCategory.categoryID);
          if (index < 0) {
            bufferTemp.push(bufferCategory);
          }
        });
        this.availableCategory = bufferTemp.slice();
        this.bufferArrayList = [];
      }
      // on edit - populate the non mapped categories
      else {
        if (this.editCategoryMappingValues != undefined) {
          let tempCategory = this.categories.filter((categoryResponse) => {
            if (this.editCategoryMappingValues.categoryID == categoryResponse.categoryID && this.editCategoryMappingValues.feedbackNatureID == this.complaintType.feedbackNatureID) {
              return categoryResponse;
            }
          })[0];
          if (tempCategory) {
            this.category = tempCategory;
            this.availableCategory.push(tempCategory); // patching the mapped category in ng-model
          }
        }
      }
    });

  }

  addMappingObject(categoryValue) {
    let mappingObj = {
      "feedbackNatureID": this.complaintType.feedbackNatureID,
      "feedbackNature": this.complaintType.feedbackNature,
      "categoryName": categoryValue.categoryName,
      "categoryID": categoryValue.categoryID,
    }
    this.complaintCategoryMappingList.push(mappingObj);
    this.categoryForm.resetForm();
    this.checkExistance(this.state.providerServiceMapID);
  }

  remove_obj(index) {
    this.complaintCategoryMappingList.splice(index, 1);
    this.showForm();
  }

  saveCategoryMapping() {
    console.log("complaintCategoryMappingList", this.complaintCategoryMappingList);
    let tempObj = this.complaintCategoryMappingList;
    this.complaintMappingService.saveComplaintToCategoryMapping(tempObj).subscribe(response => this.successHandler(response));
  }
  successHandler(response) {
    this.alertService.alert("Mapping saved successfully", 'success');
    this.showList();
  }

  showList() {
    this.getComplaintTypeCategoryMapping(this.state.providerServiceMapID, this.complaintType.feedbackNatureID);
    this.showListOfCategorymapping = true;
    this.disableSelection = false;
    this.editable = false;
    this.complaintCategoryMappingList = [];
    this.categoryForm.resetForm();
  }

  back() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.showList();
      }
    })
  }

  editCategoryMapping(complaintMappingValue) {
    console.log("complaintMappingValue", complaintMappingValue);
    this.editable = true;
    this.showTable = false;
    this.disableSelection = true;
    this.showListOfCategorymapping = false;
    this.editCategoryMappingValues = complaintMappingValue;
    this.oldCategoryID = complaintMappingValue.categoryID;
    this.getCategories(complaintMappingValue.providerServiceMapID);
  }
  
  updateCategoryMapping(formValue) {
    let updateReqObj = {
      "oldCategoryID": this.oldCategoryID,
      "categoryID": formValue.category.categoryID,
      "categoryName": formValue.category.categoryName,
      "feedbackNatureID": this.complaintType.feedbackNatureID,
      "modifiedBy": this.createdBy
    }
    this.complaintMappingService.updateComplaintCategoryMapping(updateReqObj).subscribe((response) => {
      console.log("updated response", response);
      this.updateHandler(response)
    });
  }
  updateHandler(response) {
    this.alertService.alert("Updated successfully", 'success');
    this.editCategoryMappingValues = null;
    this.showList();
  }

  unmappingCategory(categoryID) {
    this.alertService.confirm('Confirm', "Are you sure you want to Unmap ?").subscribe(response => {
      if (response) {
        let unmapObj = {
          "categoryID": categoryID,
          "modifiedBy": this.createdBy
        }
        this.complaintMappingService.unmapCategory(unmapObj).subscribe((response) => {
          this.alertService.alert("Unmapped Successfully");
          this.getComplaintTypeCategoryMapping(this.state.providerServiceMapID, this.complaintType.feedbackNatureID);
        })
      }
    });
  }
}
