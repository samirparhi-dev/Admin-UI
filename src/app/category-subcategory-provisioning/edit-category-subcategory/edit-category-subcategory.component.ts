import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { dataService } from './../../services/dataService/data.service'
import { ConfirmationDialogsService } from './../../services/dialog/confirmation.service';
import { CategorySubcategoryService } from '../../services/ProviderAdminServices/category-subcategory-master-service.service';
@Component({
  selector: 'app-edit-category-subcategory',
  templateUrl: './edit-category-subcategory.component.html',
  styleUrls: ['./edit-category-subcategory.component.css']
})
export class EditCategorySubcategoryComponent implements OnInit {
  categoryType: boolean = false;
  subCategoryType: boolean = false;
  subService: any;
  category_name: any;
  categorydesc: any;
  categoryObj: any;
  categoryID: any;
  subCategoryID: any;
  providerServiceMapId: any;
  subCategory: any;
  subCategoryDesc: any;


  categories:any=[];
  subcategories:any=[];

  categoryExist: boolean = false;
  subCategoryExist: boolean = false;

  existing_category_name:any;
  existing_subcategory_name:any;


  constructor(private commonData: dataService,
              private message: ConfirmationDialogsService, public dialogRef: MdDialogRef<EditCategorySubcategoryComponent>,
              @Inject(MD_DIALOG_DATA) public data: any, private catService: CategorySubcategoryService) { }
  ngOnInit() {
    console.log(this.data,"Modal window data");
    this.categoryObj = this.data.categoryObj;

    this.category_name = this.categoryObj.categoryName;
    this.subService = this.categoryObj.subService;
    this.categorydesc = this.categoryObj.categoryDesc;
    this.providerServiceMapId = this.categoryObj.providerServiceMapId;
    this.categoryID = this.categoryObj.categoryID;
    this.subCategoryID = this.categoryObj.subCategoryID;
    this.subCategory = this.categoryObj.subCategoryName;
    this.subCategoryDesc = this.categoryObj.subCategoryDesc;

    this.categories=this.data.categories;
    this.subcategories=this.data.subcategories;


    this.existing_category_name= this.categoryObj.categoryName;
    this.existing_subcategory_name=this.categoryObj.subCategoryName;

  }
  editCategory() {
    const catObj = {};
    catObj['categoryID'] = this.categoryID;
    catObj['categoryName'] = this.category_name;
    catObj['categoryDesc'] = this.categorydesc;
    catObj['modifiedBy'] = this.commonData.uname;
    ;
    this.catService.editCategory(catObj).subscribe((response) => {
      if (response) {
        this.message.alert('Successfully updated');
        this.dialogRef.close(true);
      }
    }, (err) => { });
  }
  editSubCategory() {
    const catObj = {};
    catObj['subCategoryID'] = this.subCategoryID;
    catObj['categoryID'] = this.categoryID;
    catObj['subCategoryName'] = this.subCategory;
    catObj['subCategoryDesc'] = this.subCategoryDesc;
    catObj['modifiedBy'] = this.commonData.uname;
    this.catService.editSubCategory(catObj).subscribe((response) => {
      if (response) {
        this.message.alert('Successfully updated');
        this.dialogRef.close(true);
      }
    }, (err) => { });
  }


  checkCategory(categoryName: string) {
    let categoriesExist;
    if (categoryName) {
      categoriesExist = this.categories.filter(function (item) {
        return item.categoryName.toString().toLowerCase().trim() === categoryName.toString().toLowerCase().trim();
      });
    }
    if (categoriesExist!=undefined && categoriesExist.length > 0 && categoriesExist[0].categoryName!=this.existing_category_name) {
      this.categoryExist = true;
    }
    else if(categoryName.trim().length==0)
    {
      this.categoryExist = true;
    }
    else {
      this.categoryExist = false;
    }

  }
  checkSubCategory(subCategoryName: string) {
    let subCategoriesExist;
    if (subCategoryName.trim().length>0) {
      debugger;
            //  console.log(response, "subcat response");
            subCategoriesExist = this.subcategories.filter((obj) => {

              return obj.categoryID === this.categoryID &&
              obj.subCategoryName.toString().toLowerCase().trim() === subCategoryName.toString().toLowerCase().trim();
            });
          }
          

         if (subCategoriesExist!=undefined && subCategoriesExist.length > 0 && subCategoriesExist[0].subCategoryName!=this.existing_subcategory_name) {
          this.subCategoryExist = true;
        }
          else if(subCategoryName.trim().length==0)
          {
            this.subCategoryExist = true;
          }
          else {
            this.subCategoryExist = false;
          }
        }


      }

      

