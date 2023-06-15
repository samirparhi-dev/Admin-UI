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
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdRadioChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ItemService } from '../services/inventory-services/item.service';
import { NgForm } from '@angular/forms';
import { ItemCategoryService } from '../services/inventory-services/item-category.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { EditItemCategoryComponent } from './edit-item-category/edit-item-category.component';
import { debug } from 'util';
@Component({
  selector: 'app-item-category-master',
  templateUrl: './item-category-master.component.html',
  styleUrls: ['./item-category-master.component.css']
})
export class ItemCategoryMasterComponent implements OnInit {

  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  services_array: any[];
  states_array: any[];

  codeExists: Boolean = false;
  itemsList = [];
  filteredItemList = [];
  edit_Serviceline : any;
  edit_State :any;
  edit_code:any;
  edit_name:any;
  edit_desc:any;
  itemCategoryID:any;
  create_filterTerm:string;

  editMode: boolean = false;
  showTableFlag: Boolean = false;
  showCreationForm: Boolean = false;
  tableMode: boolean = true;

  //Creations

  itemCategoryCode = null;
  itemCategoryName = null;
  itemCategoryDesc = null;
  forCreationObjects = [];

  state: any;
  serviceline: any;


  @ViewChild('searchForm') searchForm: NgForm;

  @ViewChild('categoryCreationForm') categoryCreationForm: NgForm;

  constructor(public commonservice: CommonServices, public commonDataService: dataService,
    public itemService: ItemService,
    public dialogService: ConfirmationDialogsService, private itemCategoryService: ItemCategoryService, public dialog: MdDialog) { }

  ngOnInit() {
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.createdBy = this.commonDataService.uname;
    console.log('this.createdBy', this.createdBy);
    this.getServices();
  }
  getServices() {
    this.commonservice.getServiceLines(this.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
        this.state = '';
        this.serviceline = '';
        this.providerServiceMapID = '';
      }
    })
  }
  getStates(service) {
    this.commonservice.getStatesOnServices(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
        this.state = '';
        this.providerServiceMapID = '';
      }
    })
  }
  setProviderServiceMapID(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    console.log(this.providerServiceMapID);
    console.log(this.state);
    console.log(this.serviceline);
    this.getAllItemCategories();
  }

  getAllItemCategories() {
    if (this.providerServiceMapID) {
      this.itemCategoryService.getAllItemCategory(this.providerServiceMapID).subscribe((res) => {
        if (res.statusCode == 200) {
          console.log(res.data);
          this.showTableFlag = true;
          this.itemsList = res.data;
          this.filteredItemList = res.data;

        }
      });
    }
  }

  back() {
    this.tableMode=true;
    this.showTableFlag = true;
    this.editMode=false;
    this.showCreationForm = false;
    this.forCreationObjects = [];
    this.getAllItemCategories();
    this.create_filterTerm='';
  }
  saveCategory() {
    this.itemCategoryService.saveNewCategory(this.forCreationObjects)
    .subscribe(res => {
      if (res.statusCode == 200) {
        console.log(res);
        this.dialogService.alert('Saved successfully', 'success');
        this.categoryCreationForm.reset();
        this.forCreationObjects = [];
        this.back();
      }
    })


  }
  removeRow(index) {
    this.forCreationObjects.splice(index,1);
  }

  addForCreation() {
    this.forCreationObjects.push({
      serviceName: this.serviceline.serviceName,
      stateName: this.state.stateName,
      itemCategoryCode: this.itemCategoryCode,
      itemCategoryName: this.itemCategoryName,
      itemCategoryDesc: this.itemCategoryDesc,
      createdBy: this.createdBy,
      providerServiceMapID : this.providerServiceMapID
    })
    this.categoryCreationForm.reset();

  }

  filterItemFromList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredItemList = this.itemsList;
    } else {
      this.filteredItemList = [];
      this.itemsList.forEach((item) => {
        for (let key in item) {
          if (key == 'itemCategoryCode' || key == 'itemCategoryName' || key == 'itemCategoryDesc') {
            const value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredItemList.push(item); break;
            }
          }
        }
      });
    }

  }

  activateDeactivate(categoryID, flag) {
    let confirmMessage
    if (flag) {
      confirmMessage = 'Deactivate';
    } else {
      confirmMessage = 'Activate';
    }
    this.dialogService.confirm('Confirm', 'Are you sure you want to ' + confirmMessage + '?').subscribe((res) => {
      if (res) {
        console.log('Deactivating or activating Obj', categoryID, flag);
        this.itemCategoryService.categoryActivationDeactivation(categoryID, flag)
          .subscribe((result) => {
            if (result.statusCode == 200) {
              console.log('Activation or deactivation response', result);
              this.dialogService.alert(`${confirmMessage}d successfully`, 'success');
              this.getAllItemCategories();
              this.create_filterTerm='';
            }
            // this.getAllItemsList(this.providerServiceMapID);
          }, (err) => this.dialogService.alert(err, 'error'))
      }
    },
      (err) => {
        console.log(err);
      })
  }
  editItem(itemlist) {
    console.log('Existing Data', itemlist);
    this.itemCategoryID=itemlist.itemCategoryID;
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.edit_code=itemlist.itemCategoryCode;
    this.edit_desc=itemlist.itemCategoryDesc;
    this.edit_name=itemlist.itemCategoryName;
    this.showEditForm();
  }
  updateItem(editformvalues)
  {
    const editObj={
      "itemCategoryID": this.itemCategoryID,
      "itemCategoryDesc": this.edit_desc,
      "providerServiceMapID": this.providerServiceMapID,
      "modifiedBy":  this.createdBy
    }
    this.itemCategoryService.editItemCategory(editObj).subscribe(response => {
      if (response) {
        this.back();
        console.log(response, 'after successful updation of Item category');
        this.dialogService.alert('Updated successfully', 'success');

      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  showEditForm() {
    this.tableMode = false;
    this.showCreationForm = false;
    this.editMode = true;
  }
  showForm() {
    this.tableMode = false;
    this.showTableFlag = false;
    this.showCreationForm = true;
    this.editMode = false;
  }

  checkCodeExistance(code) {
    this.itemService.confirmItemCodeUnique(code, 'Itemcategory', this.providerServiceMapID)
    .subscribe((res) => {
      if (res && res.statusCode == 200 && res.data) {
          console.log(res)
          console.log(res.data)
          console.log(res.data.response)
          // this.itemCodeExist = res.data.response;
          this.localCodeExists(code, res.data.response)
      }
    })
  }

  localCodeExists(code, returned) {
    let duplicateStatus = 0
    if (this.forCreationObjects.length > 0) {
      for (let i = 0; i < this.forCreationObjects.length; i++) {
        if (this.forCreationObjects[i].itemCategoryCode === code
        ) {
          duplicateStatus = duplicateStatus + 1;

        }
    }
  }
  if (duplicateStatus > 0 || returned == 'true') {
    this.codeExists = true;
  } else {
    this.codeExists = false;
  }

  }
}

