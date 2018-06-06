import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ItemCategoryService } from '../../services/inventory-services/item-category.service';
import { NgForm } from '@angular/forms';
import { dataService } from '../../services/dataService/data.service';

@Component({
  selector: 'app-edit-item-category',
  templateUrl: './edit-item-category.component.html',
  styleUrls: ['./edit-item-category.component.css']
})
export class EditItemCategoryComponent implements OnInit {

  code: any;
  name: any;
  desc: any;
  id: any;
  modifiedBy: any;
  providerServiceMapID: any;

  @ViewChild('editCategoryCreationForm') editCategoryCreationForm: NgForm;

  constructor(@Inject(MD_DIALOG_DATA) public data, public dialog: MdDialog,
    public itemCategoryService: ItemCategoryService, public commonDataService: dataService,
    public dialogRef: MdDialogRef<EditItemCategoryComponent>) {

    }

  ngOnInit() {
    this.modifiedBy = this.commonDataService.uname;
    this.getData();
  }
  getData() {
    this.code = this.data.item.itemCategoryCode;
    this.name = this.data.item.itemCategoryName;
    this.desc = this.data.item.itemCategoryDesc;
    this.id = this.data.item.itemCategoryID;
    this.providerServiceMapID = this.data.providerServiceMapID;
  }
  update() {
    console.log(this.data)
    const reqObj = {
      itemCategoryID: this.id,
      itemCategoryDesc: this.desc,
      providerServiceMapID: this.providerServiceMapID,
      modifiedBy:  this.modifiedBy
    }
    this.itemCategoryService.editItemCategory(reqObj)
    .subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.dialogRef.close('success');
      }
  })

  }

}
