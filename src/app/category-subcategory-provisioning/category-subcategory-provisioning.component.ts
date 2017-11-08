import { Component, OnInit } from '@angular/core';
import { CategorySubcategoryService } from '../services/ProviderAdminServices/category-subcategory-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { EditCategorySubcategoryComponent } from './edit-category-subcategory/edit-category-subcategory.component';
@Component({
  selector: 'app-category-subcategory-provisioning',
  templateUrl: './category-subcategory-provisioning.component.html',
  styleUrls: ['./category-subcategory-provisioning.component.css']
})
export class CategorySubcategoryProvisioningComponent implements OnInit {

  serviceproviderID: any;
  well_being:boolean=false;
  showWellBeingFlag:boolean=false;
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
  searchChoice: number = 0;
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


  constructor(public commonDataService: dataService, public dialog: MdDialog, public CategorySubcategoryService: CategorySubcategoryService
    , private messageBox: ConfirmationDialogsService) {
    this.api_choice = '0';
    this.Add_Category_Subcategory_flag = true;
    this.showTable = true;
    this.serviceproviderID = this.commonDataService.service_providerID;
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
      }, (err) => {

      });
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
      }, (err) => {

      });
  }

  searchReqObjChange(choice) {
    console.log(choice, "search choice");
    if (choice == 1) {
      this.showCategoryTable = false;
    }
    else {
      this.showCategoryTable = true;
    }
  }

  // to get the details of category and subcategory
  getDetails(subService: any, providerServiceMap: any) {
    this.showDiv = true;
    this.getCategory(providerServiceMap, subService.subServiceID);
    this.getSubCategory(providerServiceMap, subService.subServiceID);

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
    obj['well_being'] = this.well_being;


    if (this.serviceList.length > 0) {
      this.serviceList.push(obj);
      this.serviceList = this.filterArray(this.serviceList);
    } else {
      this.serviceList.push(obj);
    }
    this.category_name = undefined;
    this.categorydesc = '';
    this.well_being=false;
  }

  checkSubService(sub_service_name)
  {
    if(sub_service_name==="Counselling Service")
    {
      this.showWellBeingFlag=true;
      this.well_being=false;
    }
    else
    {
      this.showWellBeingFlag=false;
    }
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

  // add category
  addNewCategory(providerServiceMapID) {
    let categoryObj = [];
    categoryObj = this.serviceList.map(function (item) {
      return {

        'categoryName': item.categoryName,
        'categoryDesc': item.categoryDesc,
        'subServiceID': item.subServiceID,
        'providerServiceMapID': item.providerServiceMapID,
        's104_CS_Type':item.well_being,
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

  editCategory(catObj: any) {
    const categoryObj = {};
    categoryObj['categoryID'] = catObj.categoryID;
    categoryObj['categoryName'] = catObj.categoryName;
    categoryObj['subService'] = this.sub_service.subServiceName;
    categoryObj['providerServiceMapId'] = catObj.providerServiceMapID;
    categoryObj['categoryDesc'] = catObj.categoryDesc;
    const dialogReff = this.dialog.open(EditCategorySubcategoryComponent, {
      height: '60%',
      width: '30%',
      disableClose: true,
      data: categoryObj

    });
    dialogReff.componentInstance.categoryType = true;
    dialogReff.afterClosed().subscribe((res) => {
      if (res) {
        ;
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
    const dialogReff = this.dialog.open(EditCategorySubcategoryComponent, {
      height: '60%',
      width: '30%',
      disableClose: true,
      data: categoryObj

    });
    dialogReff.componentInstance.subCategoryType = true;
    dialogReff.afterClosed().subscribe((res) => {
      if (res) {
        ;
        this.getSubCategory(subCatObj.providerServiceMapID, subCatObj.subServiceID);
      }

    });
    // console.log(subCatObj);
  }

  deleteRow(index) {
    this.serviceList.splice(index,1);
    if (this.serviceList.length === 0) {
      this.cateDisabled = 'false';
      this.category_name = '';
      this.categorydesc = '';
    }
  }

  deleteRowSubCat(index) {
    this.serviceSubCatList.splice(index,1);
  }
  deleteCategory(id: any, isActivate: boolean) {
    let confirmMessage;
    if (isActivate) {
      confirmMessage = 'Deactivate';
    } else {
      confirmMessage = 'Activate';
    }
    this.messageBox.confirm('Are you sure want to ' + confirmMessage + '?').subscribe((res) => {
      if (res) {
        this.CategorySubcategoryService.deleteCategory(id, isActivate)
          .subscribe((response) => {
            if (response) {
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
    this.messageBox.confirm('Are you sure want to ' + confirmMessage + '?').subscribe((res) => {
      if (res) {
        this.CategorySubcategoryService.deleteSubCategory(id, flag)
          .subscribe((response) => {
            if (response) {
              // console.log(response,"after delete");
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
      }, (err) => {

      });
    this.CategorySubcategoryService.getCategorybySubService(providerServiceMap, subService)
      .subscribe((response) => {
        if (response) {
          console.log(response, "subCategory");
          this.subCat = response.filter(function (item) {
            return item != null;
          });
          console.log(this.subCat);
        }
      }, (err) => {

      });
  }


  changeRequestObject(flag_value) {
    if (flag_value === "0") {
      this.Add_Category_Subcategory_flag = true;
      
      /*edited by diamond*/
      this.categoryExist=false;
      this.subCategoryExist=false;

      this.category_name="";
      this.categorydesc="";

      this.subcategory="";
      this.description="";

      this.well_being=false;
      /*editing ends*/

      // this.resetFields();

    }
    if (flag_value === "1") {
      this.Add_Category_Subcategory_flag = false;
      this.getCategory(this.service, this.sub_service.subServiceID);
      // this.resetFields();

      /*edited by diamond*/
      this.categoryExist=false;
      this.subCategoryExist=false;

      this.category_name="";
      this.categorydesc="";

      this.subcategory="";
      this.description="";
      /*editing ends*/
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
  hideTable() {
    this.showTable = false;
    this.searchForm = false;
  }

  hideForm() {
    this.showTable = true;
  }

  back() {
    this.searchForm = true;
    this.serviceList.length = 0;
    this.showTable = true;
    this.cateDisabled = 'false';
    this.getCategory(this.service, this.sub_service.subServiceID);
    this.getSubCategory(this.service, this.sub_service.subServiceID);

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
  checkCategory(categoryName: string) {
    let categoriesExist;
    if (categoryName) {
      categoriesExist = this.categories.filter(function (item) {
        return item.categoryName.toString().toLowerCase().trim() === categoryName.toString().toLowerCase().trim();
      });
    }
    if (categoriesExist!=undefined && categoriesExist.length > 0) {
      this.categoryExist = true;
    } else {
      this.categoryExist = false;
    }

  }
  checkSubCategory(subCategoryName: string, providerServiceMapId: any, subService: any, category: any) {
    if (subCategoryName && providerServiceMapId && subService && category) {
      let subCategoriesExist;
      this.CategorySubcategoryService.getCategorybySubService(providerServiceMapId, subService.subServiceID)
        .subscribe((response) => {
          if (response) {
            //  console.log(response, "subcat response");
            subCategoriesExist = response.filter((obj) => {
              if (obj) {
                return obj.categoryID === category.categoryID &&
                  obj.subCategoryName.toString().toLowerCase().trim() === subCategoryName.toString().toLowerCase().trim();
              }
            });
            if (subCategoriesExist!=undefined && subCategoriesExist.length > 0) {
              this.subCategoryExist = true;
            } else {
              this.subCategoryExist = false;
            }
          }
        }, (err) => {

        });
    }
  }
}


