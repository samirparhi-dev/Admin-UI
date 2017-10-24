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
  constructor(private commonData: dataService,
    private message: ConfirmationDialogsService, public dialogRef: MdDialogRef<EditCategorySubcategoryComponent>,
    @Inject(MD_DIALOG_DATA) public data: any, private catService: CategorySubcategoryService) { }
  ngOnInit() {
    this.categoryObj = this.data;
    this.category_name = this.categoryObj.categoryName;
    this.subService = this.categoryObj.subService;
    this.categorydesc = this.categoryObj.categoryDesc;
    this.providerServiceMapId = this.categoryObj.providerServiceMapId;
    this.categoryID = this.categoryObj.categoryID;
    this.subCategoryID = this.categoryObj.subCategoryID;
    this.subCategory = this.categoryObj.subCategoryName;
    this.subCategoryDesc = this.categoryObj.subCategoryDesc;

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
        this.message.alert('Successfully Updated');
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
        this.message.alert('Successfully Updated');
        this.dialogRef.close(true);
      }
    }, (err) => { });
  }
}
