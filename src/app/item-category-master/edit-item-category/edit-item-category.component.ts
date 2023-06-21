/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
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
