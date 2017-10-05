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
  showDiv: boolean = false;
  api_choice: any;
  subCat: any = [];
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
        this.subServices = [];
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
  // to get the details of category and subcategory
  getDetails(subService: any, providerServiceMap: any) {
    ;
    this.showDiv = true;
    this.getCategory(providerServiceMap, subService.subServiceID);
    this.CategorySubcategoryService.getCategory(providerServiceMap, subService.subServiceID)
      .subscribe((response) => {
        ;
        if (response) {
          this.data = response.filter(function (item) {
            return item.categoryID !== null && item.categoryName !== null;
          });
        }
      }, (err) => {

      });

    this.CategorySubcategoryService.getCategorybySubService(providerServiceMap, subService.subServiceID)
      .subscribe((response) => {
        if (response) {
          this.subCat = response;
        }
      }, (err) => {

      });
  }

  // to refresh the category after deletion
  refeshCategory(subService: any, providerServiceMap: any) {
    this.showDiv = true;
    this.CategorySubcategoryService.getCategory(providerServiceMap, subService)
      .subscribe((response) => {
        ;
        if (response) {
          this.data = response.filter(function (item) {
            return item.categoryID !== null && item.categoryName !== null;
          });
          this.categories = response;
        }
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
    this.category_name = undefined;
    this.categorydesc = '';
  }
  addExistCategoryRow() {
    let obj = {};
    obj['subServiceID'] = this.sub_service.subServiceID;
    obj['subServiceName'] = this.sub_service.subServiceName;
    obj['providerServiceMapID'] = this.service;
    obj['categoryName'] = this.category_ID.categoryName;
    obj['categoryID'] = this.category_ID.categoryID;
    obj['subCategoryName'] = this.subcategory;
    obj['desc'] = this.description;
    obj['createdBy'] = this.createdBy;
    if (this.serviceSubCatList.length > 0) {
      this.serviceSubCatList.push(obj);
      this.serviceSubCatList = this.filterSubCatArray(this.serviceSubCatList);
    } else {
      this.serviceSubCatList.push(obj);
    }
    this.subcategory = undefined;
    this.description = ''
  }
  deleteRow(index) {
    this.serviceList.pop(index);
    if (this.serviceList.length === 0) {
      this.cateDisabled = 'false';
      this.category_name = '';
      this.categorydesc = '';
    }
  }
  deleteRowSubCat(index) {
    this.serviceSubCatList.pop(index);
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

  // final save to save category and sub category
  finalsave(service) {
    if (this.api_choice === "0") {
      this.addNewCategory(service);
    } else {
      this.addSubCategory(service);
    }
  }
  // add category
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

    this.CategorySubcategoryService.saveCategory(categoryObj)
      .subscribe((response) => {
        if (response) {
          if (response.length > 0) {
            this.messageBox.alert('Successfully Created');
            this.serviceList.length = [];
            this.getCategory(providerServiceMapID, this.sub_service);
          }
        }
      }, (err) => {

      });
  }

  // add sub category 
  addSubCategory(providerServiceMapID) {
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
          this.messageBox.alert('Successfully Created');
          this.serviceSubCatList.length = [];
          //  this.getDetails(this.sub_service, providerServiceMapID);
        }
      }, (err) => {

      });
  }
  back() {
    this.searchForm = true;
    this.serviceList.length = 0;
    this.showTable = true;
    this.cateDisabled = 'false';
    ;
    this.getCategory(this.service, this.sub_service.subServiceID);

  }
  getCategory(providerserviceMapId: any, subServiceID: any) {
    this.CategorySubcategoryService.getCategory(providerserviceMapId, subServiceID)
      .subscribe((response) => {
        if (response) {
          this.categories = response;
          this.data = response;
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
              this.refeshCategory(response.subServiceID, response.providerServiceMapID);
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
  filterSubCatArray(array: any) {
    const o = {};
    return array = array
      .filter((thing, index, self) => self
        .findIndex((t) => {
          return t.categoryID === thing.categoryID
            && t.subCategoryName === thing.subCategoryName && t.subServiceID === thing.subServiceID;
        }) === index)
  }
}


