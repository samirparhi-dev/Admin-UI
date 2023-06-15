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
import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { Mainstroreandsubstore } from '../services/inventory-services/mainstoreandsubstore.service';
import { dataService } from '../services/dataService/data.service';
import { isNullOrUndefined } from 'util';
import { CommonServices } from '../services/inventory-services/commonServices';

@Component({
  selector: 'app-item-issue-method-config',
  templateUrl: './item-issue-method-config.component.html',
  styleUrls: ['./item-issue-method-config.component.css']
})
export class ItemIssueMethodConfigComponent implements OnInit {

  object: any = [];
  ItemIssue_array: any = [];
  itemCategory_array: any = [];
  bufferArray:any=[];
  filterItemCategory:any=[];
  filteredItemCategory_array: any = [];
  providerServiceMapID: any;
  states_array: any = [];
  services_array: any = [];
  serviceProviderID: any;
  create_filterTerm:string;
  createdBy: any;
  category: any;
  itemIssue: any;
  state: any;
  serviceline: any;
  uid: any;
  edit_Serviceline:any;
  edit_State:any;
  edit_category:any;
  edit_itemIssue:any;
  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  displayTable:boolean=false;
  createButton:boolean=false;
  constructor(public commonservice: CommonServices,private storeService: Mainstroreandsubstore, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid
    this.setItemIssue();
    this.getServices();
  }
  setItemIssue(){
    this.ItemIssue_array = [
      { value: 1, Name: 'First In First Out' },
      { value: 2, Name: 'First Expiry First Out' },
      { value: 3, Name: 'Last In First Out' }
    ];
  }

  getServices() {
    this.commonservice.getServiceLines(this.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
      }
    })
  }
  getstates(service) {
    this.storeService.getStates(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }
  getItemCategory(providerServiceMapID) {
    debugger;
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.storeService.getItemCategory(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All Item Categories success based on service', response);
        this.itemCategory_array = response.filter(
          category => category.deleted != true && category.issueType != undefined
        );
        this.filteredItemCategory_array=this.itemCategory_array;
        this.filterItemCategory=response.filter(
          category => category.issueType == undefined && category.deleted != true
        );
        this.displayTable = true;
        this.setItemIssue();
      }
    })
  }
  editIssueType(editformvalues) {
    debugger
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.edit_category=editformvalues.itemCategoryID;
    this.edit_itemIssue=editformvalues.issueType;
    this.showEditForm();
  }
  showEditForm() {
    debugger;
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  showForm() {
    debugger;
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }
  getIssueType(itemCategoryID)
  {
    debugger;
    var item=this.itemCategory_array.filter(
      category => category.itemCategoryID == itemCategoryID
    );
    var issueType=this.ItemIssue_array.filter(
      itemissue => itemissue.Name == item[0].issueType
    );
    this.itemIssue=issueType;
  }
  filterItemIssueList(searchTerm?: string) {
    debugger;
    if (!searchTerm) {
      this.filteredItemCategory_array = this.itemCategory_array;
    }
    else {
      this.filteredItemCategory_array = [];
      this.itemCategory_array.forEach((item) => {
        for (let key in item) {
          if (key == "issueType" || key == "itemCategoryCode" || key == "itemCategoryName") {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredItemCategory_array.push(item); break;
            }
          }
        }
      });
    }

  }
  updateConfig(editvalue)
  {
  debugger;
  const obj = {
  "issueType": editvalue.itemissue,
  "itemCategoryID": this.edit_category,
  "providerServiceMapID": this.providerServiceMapID
   }  
   this.object.push(obj);
    debugger;
    this.storeService.saveItemIssueConfig(this.object).subscribe(response => {
      if (response) {
        this.dialogService.alert("Updated successfully", 'success');
        this.showTable();
      }
    }) 
  }
  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }
  add2buffer(formvalues) {
    debugger;
    const obj={
      "itemCategoryName":formvalues.itemcategory.itemCategoryName,
      "issueType":formvalues.itemissue.Name,
      'providerServiceMapID': this.providerServiceMapID,
      "itemCategoryID": this.category.itemCategoryID
    }
    this.checkDuplictes(obj);
  }
  checkDuplictes(object) {
    debugger;
    let duplicateStatus = 0
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }
    else {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].itemCategoryName == object.itemCategoryName) {
          duplicateStatus = duplicateStatus + 1;
          this.dialogService.alert("Item Category is already added in list");
        }
      }
      if (duplicateStatus === 0) {
        this.bufferArray.push(object);
      }
    }
  }
  saveConfig() {
    // const obj = {
    //   "issueType": this.itemIssue.Name,
    //   "itemCategoryID": this.category.itemCategoryID,
    //   "providerServiceMapID": this.providerServiceMapID
    // }
    // this.object.push(obj);
    // debugger;
    this.storeService.saveItemIssueConfig(this.bufferArray).subscribe(response => {
      if (response) {
        this.dialogService.alert("Saved successfully", 'success');
        this.showTable();
      }
    })
  }
  showTable() {
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.bufferArray = [];
    this.displayTable = true;
    this.getItemCategory(this.providerServiceMapID);
   // this.countryCheck = false;
    this.create_filterTerm = '';
  }

}
