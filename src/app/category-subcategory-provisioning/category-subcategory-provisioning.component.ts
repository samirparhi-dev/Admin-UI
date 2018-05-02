import { Component, OnInit, ViewChild } from '@angular/core';
import { CategorySubcategoryService } from '../services/ProviderAdminServices/category-subcategory-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { EditCategorySubcategoryComponent } from './edit-category-subcategory/edit-category-subcategory.component';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-category-subcategory-provisioning',
  templateUrl: './category-subcategory-provisioning.component.html',
  styleUrls: ['./category-subcategory-provisioning.component.css']
})
export class CategorySubcategoryProvisioningComponent implements OnInit {

  serviceproviderID: any;
  well_being: boolean = false;
  showWellBeingFlag: boolean = false;

  selected_service_id: any;
  // ngmodels
  state: any;
  service: any;
  sub_service: any;
  showDiv: boolean = false;
  api_choice: any;
  subCat: any = [];
  // flags
  Add_Category_Subcategory_flag: boolean;
  showCategoryTable: boolean = true;
  showTable: boolean;
  searchChoice: any;
  states: any = [];
  serviceLines: any = [];
  subServices: any = [];
  serviceList: any = [];
  request_object: any;
  providerServiceMapID: number;
  categories: any = [];
  category_name: any;
  categorydesc: any;
  subcategory: any;
  description: any;
  filepath: any;
  data: any = [];
  searchForm: boolean = true;
  cateDisabled: string = 'false';
  createdBy: any;
  category_ID: any;
  serviceSubCatList: any = [];
  sub_serviceID: any;
  private items: Array<any>;
  hideButton: boolean = false;
  categoryExist: boolean = false;
  subCategoryExist: boolean = false;
  userID: any;
  nationalFlag: boolean;

  @ViewChild('form') form: NgForm
  constructor(public commonDataService: dataService, public dialog: MdDialog, public CategorySubcategoryService: CategorySubcategoryService
    , private messageBox: ConfirmationDialogsService) {
    this.api_choice = '0';
    this.searchChoice = '0';
    this.Add_Category_Subcategory_flag = true;
    this.showTable = true;
    this.serviceproviderID = this.commonDataService.service_providerID;
    this.createdBy = this.commonDataService.uname;

  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    //  this.getStates(); //commented on 12/4/18 w.r.t.1097 changes
    this.getServiceLines();
    this.cateDisabled = 'false';
  }

  // getStates() {
  //   this.CategorySubcategoryService.getStates(this.serviceproviderID)
  //     .subscribe((response) => {
  //       this.states = response;
  //     }, (err) => {
  //     });
  // } //commented on 12/4/18 w.r.t.1097 changes
  getServiceLines() {
    this.CategorySubcategoryService.getServiceLinesNew(this.userID).subscribe((response) => {
      this.successhandeler(response)
    }, (err) => this.messageBox.alert(err, 'error'));
  }
  successhandeler(res) {
    this.serviceLines = res.filter(function (item) {
      if (item.serviceID === 3 || item.serviceID === 1) {
        return item;
      }
    });
    //         this.subServices = [];
    //    this.serviceLines = res
  }
  // getServices(stateID: any) {
  //   this.service = undefined;
  //   this.CategorySubcategoryService.getServiceLines(this.serviceproviderID, stateID)
  //     .subscribe((response) => {
  //       this.serviceLines = response.filter(function (item) {
  //         if (item.serviceID === 3 || item.serviceID === 1) {
  //           return item;
  //         }
  //       });
  //       this.subServices = [];
  //     }, (err) => {

  //     });
  // }  //commented on 12/4/18 w.r.t.1097 change
  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.CategorySubcategoryService.getStatesNew(obj).
      subscribe(response => this.getStatesSuccessHandeler(response, value),
        (err) => this.messageBox.alert(err, 'error'));
  }
  getStatesSuccessHandeler(response, value) {

    this.states = response;
    if (value.isNational) {
      this.nationalFlag = value.isNational;
      this.getSubServices(value.isNational);
    }
    else {
      this.nationalFlag = value.isNational;
      //   this.getSubServices(value.isNational)
    }
  }

  getSubServices(value) {
    this.sub_service = undefined;


    if (value == true) {

      this.servicesGetting(this.states[0].providerServiceMapID);
    }
    else if (value == 'get') {
      this.servicesGetting(this.state.providerServiceMapID);
    }


  }
  servicesGetting(proServiceMapID) {
    this.CategorySubcategoryService.getSubService(proServiceMapID)
      .subscribe((response) => {
        this.showWellBeingFlag = false;
        if (this.selected_service_id === 1) {
          this.subServices = response.filter(function (item) {
            if (item.subServiceName.toUpperCase() === "Information Service".toUpperCase() ||
              item.subServiceName.toUpperCase() === "Counselling Service".toUpperCase()) {
              return item;
            }
          });
        }
        else {
          this.subServices = response.filter(function (item) {
            if (item.subServiceName.toUpperCase() !== "Blood Request".toUpperCase()) {
              return item;
            }
          });
        }

        console.log(this.subServices, "The array after filter");

      }, (err) => this.messageBox.alert(err, 'error'));
  }
  getCategory(providerserviceMapId: any, subServiceID: any) {
    this.providerServiceMapID = providerserviceMapId;
    this.sub_serviceID = subServiceID;
    this.CategorySubcategoryService.getCategory(providerserviceMapId, subServiceID)
      .subscribe((response) => {
        if (response) {
          this.categories = response.filter(function (item) {
            return item.deleted !== true;
          });
          this.data = response;
        }
      }, (err) => this.messageBox.alert(err, 'error'));
  }
  getSubCategory(providerserviceMapId: any, subServiceID: any) {
    this.providerServiceMapID = providerserviceMapId;
    this.sub_serviceID = subServiceID;
    this.CategorySubcategoryService.getCategorybySubService(providerserviceMapId, subServiceID)
      .subscribe((response) => {
        if (response) {
          //  console.log(response, "subcat response");
          this.subCat = response.filter((obj) => {
            return obj !== null;
          });
        }
      }, (err) => this.messageBox.alert(err, 'error'));
  }

  // searchReqObjChange(choice) {
  //   console.log(choice, "search choice");
  //   if (choice == 1) {
  //     this.showCategoryTable = false;
  //   }
  //   else {
  //     this.showCategoryTable = true;
  //   }
  // }
    searchReqObjChange(choice) {
    console.log(choice, "search choice");
    if (choice == 1) {
      this.showCategoryTable = false;
    }
    else {
      this.showCategoryTable = true;
    }
  }
  callgetDetails(subService: any, providerServiceMap: any) {
    if (this.nationalFlag) {
      this.getDetails(subService);
    }
  }
  // to get the details of category and subcategory
  getDetails(subService: any) {
    this.showDiv = true;
    if (this.nationalFlag) {
      this.getCategory(this.states[0].providerServiceMapID, subService.subServiceID);
      this.getSubCategory(this.states[0].providerServiceMapID, subService.subServiceID);
    }
    else {
      this.getCategory(this.state.providerServiceMapID, subService.subServiceID);
      this.getSubCategory(this.state.providerServiceMapID, subService.subServiceID);
    }

  }

  addNew(rowNumber: any) {
    debugger;
    if (this.searchChoice === '0') {
      this.addNewCategoryRow();
    } else {
      this.addExistCategoryRow();
    }
    this.form.resetForm();
    this.well_being = false;

  }

  addNewCategoryRow() {
    let obj = {};
    obj['categoryName'] = this.category_name;
    obj['categoryDesc'] = this.categorydesc;
    obj['subServiceID'] = this.sub_service.subServiceID;
    obj['subServiceName'] = this.sub_service.subServiceName;
    if (this.nationalFlag) {
      obj['providerServiceMapID'] = this.states[0].providerServiceMapID;
    }
    else {
      obj['providerServiceMapID'] = this.state.providerServiceMapID;
    }
    obj['createdBy'] = this.createdBy;
    obj['well_being'] = this.well_being;
    let count = 0;
    for (let a = 0; a < this.serviceList.length; a++) {
      if (this.serviceList[a].categoryName.toLowerCase().trim() === obj['categoryName'].toLowerCase().trim()
        && this.serviceList[a].subServiceID === obj['subServiceID']) {
        count = count + 1;
      }
      // this.serviceList.push(obj);
      // this.serviceList = this.filterArray(this.serviceList);
    } if (count === 0) {
      this.serviceList.push(obj);
    }
    else {
      this.messageBox.alert('Already exists');
    }
    this.category_name = undefined;
    this.categorydesc = '';
    this.well_being = false;
  }

  checkSubService(service, sub_service_name) {
    debugger;
    console.log(service, sub_service_name, 'service and subservice name');
    if ((sub_service_name.toUpperCase() === 'Counselling Service'.toUpperCase() && service === 3) ||
      (sub_service_name.toUpperCase() === 'Psychiatrist'.toUpperCase() && service === 3)) {
      this.showWellBeingFlag = true;
      this.well_being = false;
    }
    else {
      this.showWellBeingFlag = false;
    }
  }

  addExistCategoryRow() {
    let obj = {};
    obj['subServiceID'] = this.sub_service.subServiceID;
    obj['subServiceName'] = this.sub_service.subServiceName;
    if (this.nationalFlag) {
      obj['providerServiceMapID'] = this.states[0].providerServiceMapID;
    }
    else {
      obj['providerServiceMapID'] = this.state.providerServiceMapID;
    }
    obj['categoryName'] = this.category_ID.categoryName;
    obj['categoryID'] = this.category_ID.categoryID;
    obj['subCategoryName'] = this.subcategory;
    obj['desc'] = this.description;
    obj['createdBy'] = this.createdBy;
    // if (this.serviceSubCatList.length > 0) {
    //   this.serviceSubCatList.push(obj);
    //   this.serviceSubCatList = this.filterSubCatArray(this.serviceSubCatList);
    // } else {
    //   this.serviceSubCatList.push(obj);
    // }
    let count = 0;
    for (let a = 0; a < this.serviceSubCatList.length; a++) {
      if (this.serviceSubCatList[a].categoryID === obj['categoryID'] &&
        this.serviceSubCatList[a].subCategoryName.toLowerCase().trim() === obj['subCategoryName'].toLowerCase().trim()
        && this.serviceSubCatList[a].subServiceID === obj['subServiceID']) {
        count = count + 1;
      }
      // this.serviceList.push(obj);
      // this.serviceList = this.filterArray(this.serviceList);
    } if (count === 0) {
      this.serviceSubCatList.push(obj);
    }
    else {
      this.messageBox.alert('Already exists');
    }
    this.subcategory = undefined;
    this.description = ''
  }

  // add category
  addNewCategory() {
    let categoryObj = [];
    categoryObj = this.serviceList.map(function (item) {
      return {

        'categoryName': item.categoryName,
        'categoryDesc': item.categoryDesc,
        'subServiceID': item.subServiceID,
        'providerServiceMapID': item.providerServiceMapID,
        's104_CS_Type': item.well_being,
        'createdBy': item.createdBy
      }
    })

    this.CategorySubcategoryService.saveCategory(categoryObj)
      .subscribe((response) => {
        if (response) {
          if (response.length > 0) {
            this.messageBox.alert('Saved successfully', 'success');
            this.serviceList.length = [];
            if (this.nationalFlag) {
              this.getCategory(this.states[0].providerServiceMapID, this.sub_service.subServiceID);

            }
            else {
              this.getCategory(this.state.providerServiceMapID, this.sub_service.subServiceID);

            }
          }
        }
      }, (err) => this.messageBox.alert(err, 'error'));
  }

  // add sub category
  addSubCategory() {
    let subCategoryObj = [];
    subCategoryObj = this.serviceSubCatList.map(function (item) {
      return {

        'subCategoryName': item.subCategoryName,
        'subCategoryDesc': item.desc,
        'categoryID': item.categoryID,
        'providerServiceMapID': item.providerServiceMapID,
        'subServiceID': item.subServiceID,
        'createdBy': item.createdBy
      }
    })

    this.CategorySubcategoryService.saveSubCategory(subCategoryObj)
      .subscribe((response) => {
        if (response.length > 0) {
          this.messageBox.alert('Saved successfully', 'success');
          this.serviceSubCatList.length = [];
          //  this.getDetails(this.sub_service, providerServiceMapID);
        }
      }, (err) => {

      });
  }

  editCategory(catObj: any) {

    const categoryObj = {};
    categoryObj['categoryID'] = catObj.categoryID;
    categoryObj['categoryName'] = catObj.categoryName;
    categoryObj['subService'] = this.sub_service.subServiceName;
    categoryObj['providerServiceMapId'] = catObj.providerServiceMapID;
    categoryObj['categoryDesc'] = catObj.categoryDesc;

    let object = {
      "categoryObj": categoryObj,
      "isCategory": true,
      "isSubCategory": false,
      "categories": this.categories,
      "subcategories": this.subCat
    }
    const dialogReff = this.dialog.open(EditCategorySubcategoryComponent, {
      height: '350px',
      width: '500px',
      disableClose: true,
      data: object

    });
    dialogReff.componentInstance.categoryType = true;
    dialogReff.afterClosed().subscribe((res) => {
      if (res) {
        this.getCategory(catObj.providerServiceMapID, catObj.subServiceID);
      }

    });
  }

  editSubCategory(subCatObj) {
    const categoryObj = {};
    categoryObj['categoryID'] = subCatObj.categoryID;
    categoryObj['categoryName'] = subCatObj.categoryName;
    categoryObj['subService'] = this.sub_service.subServiceName;
    categoryObj['providerServiceMapId'] = subCatObj.providerServiceMapID;
    // categoryObj['categoryDesc'] = subCatObj.categoryDesc;
    categoryObj['subCategoryID'] = subCatObj.subCategoryID;
    categoryObj['subCategoryName'] = subCatObj.subCategoryName;
    categoryObj['subCategoryDesc'] = subCatObj.subCategoryDesc;

    let object = {
      "categoryObj": categoryObj,
      "isCategory": false,
      "isSubCategory": true,
      "categories": this.categories,
      "subcategories": this.subCat
    }

    const dialogReff = this.dialog.open(EditCategorySubcategoryComponent, {
      height: '400px',
      width: '500px',
      disableClose: true,
      data: object

    });
    dialogReff.componentInstance.subCategoryType = true;
    dialogReff.afterClosed().subscribe((res) => {
      if (res) {

        this.getSubCategory(subCatObj.providerServiceMapID, subCatObj.subServiceID);
      }

    });
    // console.log(subCatObj);
  }

  deleteRow(index) {
    this.serviceList.splice(index, 1);
    if (this.serviceList.length === 0) {
      this.cateDisabled = 'false';
      this.category_name = '';
      this.categorydesc = '';
    }
  }

  deleteRowSubCat(index) {
    this.serviceSubCatList.splice(index, 1);
  }
  deleteCategory(id: any, isActivate: boolean) {
    let confirmMessage;
    if (isActivate) {
      confirmMessage = 'Deactivate';
    } else {
      confirmMessage = 'Activate';
    }
    this.messageBox.confirm('Confirm', 'Are you sure want to ' + confirmMessage + '?').subscribe((res) => {
      if (res) {
        this.CategorySubcategoryService.deleteCategory(id, isActivate)
          .subscribe((response) => {
            if (response) {
              this.messageBox.alert(confirmMessage + "d successfully", 'success');
              this.refeshCategory(response.subServiceID, response.providerServiceMapID);
            }
          }, (err) => {

          });
      }
    }, (err) => { });

  }

  deleteSubCategory(id, flag) {
    let confirmMessage;
    if (flag) {
      confirmMessage = 'Deactivate';
    } else {
      confirmMessage = 'Activate';
    }
    this.messageBox.confirm('Confirm', 'Are you sure want to ' + confirmMessage + '?').subscribe((res) => {
      if (res) {
        this.CategorySubcategoryService.deleteSubCategory(id, flag)
          .subscribe((response) => {
            if (response) {
              // console.log(response,"after delete");
              this.messageBox.alert(confirmMessage + "d successfully", 'success');
              this.refeshCategory(this.sub_serviceID, this.providerServiceMapID);
            }
          }, (err) => {

          });
      }
    }, (err) => { });
  }

  // to refresh the category after deletion
  refeshCategory(subService: any, providerServiceMap: any) {
    this.showDiv = true;
    this.CategorySubcategoryService.getCategory(providerServiceMap, subService)
      .subscribe((response) => {
        if (response) {
          this.data = response.filter(function (item) {
            return item.categoryID !== null && item.categoryName !== null;
          });
          this.categories = response.filter(function (item) {
            return item.deleted !== true;
          });
        }
      }, (err) => this.messageBox.alert(err, 'error'));

    this.CategorySubcategoryService.getCategorybySubService(providerServiceMap, subService)
      .subscribe((response) => {
        if (response) {
          console.log(response, "subCategory");
          this.subCat = response.filter(function (item) {
            return item != null;
          });
          console.log(this.subCat);
        }
      }, (err) => this.messageBox.alert(err, 'error'));
  }


  changeRequestObject(flag_value) {
    debugger;
    if (flag_value === "0") {
      this.Add_Category_Subcategory_flag = true;

      /*edited by diamond*/
      this.categoryExist = false;
      this.subCategoryExist = false;

      this.category_name = "";
      this.categorydesc = "";

      this.subcategory = "";
      this.description = "";

      this.well_being = false;
      /*editing ends*/

      // this.resetFields();

    }
    if (flag_value === "1") {
      this.Add_Category_Subcategory_flag = false;
      if (this.nationalFlag) {
        this.getCategory(this.states[0].providerServiceMapID, this.sub_service.subServiceID);

      }
      else {
        this.getCategory(this.state.providerServiceMapID, this.sub_service.subServiceID);

      }
      // this.resetFields();

      /*edited by diamond*/
      this.categoryExist = false;
      this.subCategoryExist = false;

      this.category_name = "";
      this.categorydesc = "";

      this.subcategory = "";
      this.description = "";
      /*editing ends*/
    }
  }
  // final save to save category and sub category
  finalsave() {
    if (this.searchChoice === "0") {
      this.addNewCategory();
    } else {
      this.addSubCategory();
    }
  }
  hideTable() {
    this.showTable = false;
    this.searchForm = false;
    this.changeRequestObject(this.searchChoice);
  }

  hideForm() {
    this.showTable = true;
  }

  back() {
    this.messageBox.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.searchForm = true;
        this.serviceList.length = 0;
        this.serviceSubCatList = [];
        this.showTable = true;
        this.cateDisabled = 'false';
        if (this.nationalFlag) {
          this.getCategory(this.states[0].providerServiceMapID, this.sub_service.subServiceID);
          this.getSubCategory(this.states[0].providerServiceMapID, this.sub_service.subServiceID);

        }
        else {
          this.getCategory(this.state.providerServiceMapID, this.sub_service.subServiceID);
          this.getSubCategory(this.state.providerServiceMapID, this.sub_service.subServiceID);

        }

      }
    })
  }

  filterTable(response: any) {
    this.data = this.data.filter(function (item) {
      return item.subCategoryID !== response.subCategoryID && item.categoryID !== response.categoryID;
    });
  }
  resetFields() {
    this.state = '';
    this.service = '';
    this.sub_service = '';
    this.category_name = '';
    this.categorydesc = '';
    this.subcategory = '';
    this.description = '';
    this.filepath = '';
    this.category_ID = '';
    this.cateDisabled = 'false';

  }
  filterArray(array: any) {
    const o = {};
    return array = array
      .filter((thing, index, self) => self
        .findIndex((t) => {
          return t.categoryName.toLowerCase().trim() === thing.categoryName.toLowerCase().trim()
            && t.subServiceID === thing.subServiceID;
        }) === index)
  }

  filterSubCatArray(array: any) {
    const o = {};
    return array = array
      .filter((thing, index, self) => self
        .findIndex((t) => {
          return t.categoryID === thing.categoryID
            && t.subCategoryName.toLowerCase().trim() === thing.subCategoryName.toLowerCase().trim()
            && t.subServiceID === thing.subServiceID;
        }) === index)
  }

  checkCategory(event) {
    let categoryName = event.target.value;
    let categoriesExist;
    if (categoryName && categoryName != "") {
      console.log(categoryName, 'categoryName here');
      console.log("categories", this.categories);

      categoriesExist = this.categories.filter(function (item) {
        return item.categoryName.toString().toLowerCase().trim() === categoryName.toString().toLowerCase().trim();
      });
    }
    console.log("category", this.categoryExist, 'ca5tegories', categoriesExist);

    if (categoriesExist != undefined && categoriesExist.length > 0) {
      this.categoryExist = true;
    }
    else if (categoryName.trim().length == 0) {
      this.categoryExist = false;

    }
    else {
      this.categoryExist = false;
    }

  }
  checkSubCategory(subCategoryName: string, providerServiceMapId: any, subService: any, category: any) {
    if (subCategoryName && subService && category) {
      let subCategoriesExist;
      let pServiceMapID
      if (this.nationalFlag) {
        pServiceMapID = this.states[0].providerServiceMapID;
      }
      else {
        pServiceMapID = this.state.providerServiceMapID;
      }
      this.CategorySubcategoryService.getCategorybySubService(pServiceMapID, subService.subServiceID)
        .subscribe((response) => {
          if (response) {
              console.log(response, "subcat response");
            subCategoriesExist = response.filter((obj) => {
              if (obj) {
                return obj.categoryID === category.categoryID &&
                  obj.subCategoryName.toString().toLowerCase().trim() === subCategoryName.toString().toLowerCase().trim();
              }
            });
            if (subCategoriesExist != undefined && subCategoriesExist.length > 0) {
              this.subCategoryExist = true;
            }
            else if (subCategoryName.trim().length == 0) {
              this.categoryExist = true;
            }
            else {
              this.subCategoryExist = false;
            }
          }
        }, (err) => this.messageBox.alert(err, 'error'));
    }
  }
}


