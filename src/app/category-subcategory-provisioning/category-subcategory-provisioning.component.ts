import { Component, OnInit } from '@angular/core';
import { CategorySubcategoryService } from '../services/ProviderAdminServices/category-subcategory-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-category-subcategory-provisioning',
  templateUrl: './category-subcategory-provisioning.component.html',
  styleUrls: ['./category-subcategory-provisioning.component.css']
})
export class CategorySubcategoryProvisioningComponent implements OnInit {

  serviceproviderID: any;
  // ngmodels
  state: any;
  service: any;
  sub_service: any;

  api_choice: any;

  // flags
  Add_Category_Subcategory_flag: boolean;
  showTable: boolean;
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
  private items: Array<any>;
  hideButton: boolean = false;

  constructor(public commonDataService: dataService, public CategorySubcategoryService: CategorySubcategoryService
    , private messageBox: ConfirmationDialogsService) {
    this.api_choice = '0';
    this.Add_Category_Subcategory_flag = true;
    this.showTable = true;
    this.serviceproviderID = this.commonDataService.service_providerID;
    // this.providerServiceMapID = this.commonDataService.provider_serviceMapID;
    this.createdBy = this.commonDataService.uname;

  }

  ngOnInit() {
    this.getStates();
    this.cateDisabled = 'false';
  }

  getStates() {
    this.CategorySubcategoryService.getStates(this.serviceproviderID)
      .subscribe((response) => {
        this.states = response;
      }, (err) => {
      });
  }

  getServices(stateID: any) {
    this.CategorySubcategoryService.getServiceLines(this.serviceproviderID, stateID)
      .subscribe((response) => {
        this.serviceLines = response;
      }, (err) => {

      });
  }

  getSubServices(items: any) {
    this.CategorySubcategoryService.getSubService(items.providerServiceMapID)
      .subscribe((response) => {
        this.subServices = response;
      }, (err) => {

      });

  }
  getDetails(subServiceID: any, providerServiceMapID: any) {
    this.CategorySubcategoryService.getCategorybySubService(providerServiceMapID, subServiceID)
      .subscribe((response) => {
        debugger;
        this.data = response;
      }, (err) => {

      });
  }

  hideTable() {
    this.showTable = false;
    this.searchForm = false;
  }

  hideForm() {
    this.showTable = true;
  }
  addNew(rowNumber: any) {

    if (this.api_choice === '0') {
      this.addNewCategoryRow();
    } else {
      this.addExistCategoryRow();
    }


  }
  addNewCategoryRow() {

    let obj = {};
    obj['categoryName'] = this.category_name;
    obj['categoryDesc'] = this.categorydesc;
    obj['subServiceID'] = this.sub_service.subServiceID;
    obj['subServiceName'] = this.sub_service.subServiceName;
    obj['providerServiceMapID'] = this.service;
    obj['createdBy'] = this.createdBy;

    if (this.serviceList.length > 0) {
      this.serviceList.push(obj);
      this.serviceList = this.filterArray(this.serviceList);
    } else {
      this.serviceList.push(obj);
    }
    // obj['subCategoryName'] = this.subcategory;
    // obj['desc'] = this.description;
    // obj['filePath'] = this.filepath;

    // if (this.serviceList.length > 0) {
    //   this.category_name = this.serviceList[this.serviceList.length - 1].categoryName;
    //   this.categorydesc = this.serviceList[this.serviceList.length - 1].categoryDesc;
    //   this.cateDisabled = 'true';
    // } else {
    //   this.cateDisabled = 'false';
    // }
    // this.subcategory = '';
    // this.description = '';
    // this.filepath = '';
    this.category_name = '';
    this.categorydesc = '';
  }
  addExistCategoryRow() {
    debugger
    let obj = {};
    obj['subServiceID'] = this.sub_service.subServiceID;
    obj['subServiceName'] = this.sub_service.subServiceName;
    obj['providerServiceMapID'] = this.service;
    obj['categoryName'] = this.category_ID.categoryName;
    obj['categoryID'] = this.category_ID.categoryID;
    obj['subCategoryName'] = this.subcategory;
    obj['desc'] = this.description;
    this.serviceSubCatList.push(obj);
    // if (this.serviceSubCatList.length > 0) {
    //   this.category_ID = this.serviceSubCatList[this.serviceSubCatList.length - 1].categoryName;
    // } else {
    //   this.cateDisabled = 'false';
    // }
    // this.subcategory = '';
    // this.description = '';
  }
  deleteRow(index) {
    this.serviceList.pop(index);
    if (this.serviceList.length === 0) {
      this.cateDisabled = 'false';
      this.category_name = '';
      this.categorydesc = '';
    }
  }
  changeRequestObject(flag_value) {
    if (flag_value === "0") {
      this.Add_Category_Subcategory_flag = true;
      // this.resetFields();

    }
    if (flag_value === "1") {
      this.Add_Category_Subcategory_flag = false;
      // this.resetFields();
    }
  }
  finalsave(service) {
    if (this.api_choice === "0") {
      this.addNewCategory(service);
    } else {
      this.addExistCategory();
    }
  }

  addNewCategory(providerServiceMapID) {

    let categoryObj = [];
    categoryObj = this.serviceList.map(function (item) {
      return {

        'categoryName': item.categoryName,
        'categoryDesc': item.categoryDesc,
        'subServiceID': item.subServiceID,
        'providerServiceMapID': item.providerServiceMapID,
        'createdBy': item.createdBy
      }
    })
    // categoryObj['subcatArray'] = this.serviceList.map(function (item) {
    //   return {
    //     'subCategoryName': item.subCategoryName,
    //     'subCategoryDesc': item.desc,
    //     'subCatFilePath': item.filePath
    //   }
    // })

    this.CategorySubcategoryService.saveCategory(categoryObj)
      .subscribe((response) => {
        if (response) {
          if (response.length > 0) {
            this.messageBox.alert('Successfully Created');
            // this.searchForm = true;
            this.serviceList.length = 0;
            // this.showTable = true;
            // this.api_choice = 1;
            // this.changeRequestObject(this.api_choice);
            this.getDetails(this.sub_service, providerServiceMapID);
          }
        }
      }, (err) => {

      });
  }

  addExistCategory() {

    const categoryObj = {};
    categoryObj['categoryID'] = this.category_ID.categoryID;
    categoryObj['subcatArray'] = this.serviceList.map(function (item) {
      return {
        'subCategoryName': item.subCategoryName,
        'subCategoryDesc': item.desc,
        'subCatFilePath': item.filePath
      }
    })
    categoryObj['createdBy'] = this.createdBy;
    this.CategorySubcategoryService.saveExistCategory(categoryObj)
      .subscribe((response) => {
        if (response.length > 0) {
          this.messageBox.alert('Successfully Created');
        }
        this.searchForm = true;
        this.serviceList.length = 0;
        this.showTable = true;
      }, (err) => {

      });
  }
  back() {
    this.searchForm = true;
    this.serviceList.length = 0;
    this.showTable = true;
    this.cateDisabled = 'false';

  }
  getCategory(providerserviceMapId: any, subServiceID: any) {
    this.CategorySubcategoryService.getCategory(providerserviceMapId, subServiceID)
      .subscribe((response) => {
        if (response) {
          debugger;
          this.categories = response;
        }
      }, (err) => {

      });
  }
  editCategory(id: any) {

  }
  deleteCategory(id: any) {
    this.messageBox.confirm('Are you sure want to delete?').subscribe((res) => {
      if (res) {
        this.CategorySubcategoryService.deleteCategory(id)
          .subscribe((response) => {
            if (response) {
              debugger;
              this.getDetails(response.subServiceID, response.providerServiceMapID);
            }
          }, (err) => {

          });
      }
    }, (err) => { });

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
        .findIndex((t) => { return t.categoryName === thing.categoryName && t.subServiceID === thing.subServiceID; }) === index)
  }

}


