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
import { CommonServices } from 'app/services/inventory-services/commonServices';
import { StoreMappingService } from 'app/services/inventory-services/store-mapping.service';
import { Mainstroreandsubstore } from 'app/services/inventory-services/mainstoreandsubstore.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { dataService } from 'app/services/dataService/data.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expiry-date-alert-configuration',
  templateUrl: './expiry-date-alert-configuration.component.html',
  styleUrls: ['./expiry-date-alert-configuration.component.css']
})
export class ExpiryDateAlertConfigurationComponent implements OnInit {

  createdBy: string;
  serviceProviderID: string;
  providerServiceMapID: any;
  uid: string;

  mode: String;
  filterTerm: any;
  serviceline: any;
  state: any;

  services_array: any;
  states_array: any;
  itemCategory_array: any;
  filteredItemCategory_array: any;
  unmappedItemCategory: any;

  expiryAlertConfigList = [];

  constructor(
    public commonservice: CommonServices,
    private storeService: Mainstroreandsubstore,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;

    this.getServices();
  }

  getServices() {
    this.commonservice.getServiceLines(this.uid).subscribe(response => {
      if (response) {
        this.services_array = response;
      }
    })
  }

  getstates(service) {
    this.storeService.getStates(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        this.states_array = response;
      }
    })
  }

  getItemCategory(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;

    this.storeService.getItemCategory(providerServiceMapID).subscribe(response => {
      if (response) {

        this.unmappedItemCategory = response.filter(
          category => category.deleted != true && category.alertBeforeDays == undefined
        );

        this.itemCategory_array = response.filter(
          category => category.deleted != true && category.alertBeforeDays != undefined
        );

        this.filteredItemCategory_array = this.itemCategory_array.slice();
        this.mode = new String('view');
      }
    })
  }

  filterItemCategory(filterTerm) {
    if (!filterTerm) {
      this.filteredItemCategory_array = this.itemCategory_array.slice();
    }
    else {
      this.filteredItemCategory_array = this.itemCategory_array.filter((item) => {
        let flag = false;
        for (let key in item) {
          if (key == "itemCategoryCode" || key == "itemCategoryName" || key == "alertBeforeDays") {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(filterTerm.toLowerCase()) >= 0) {
              flag = true; break;
            }
          }
        }
        return flag;
      });
    }
  }

  itemCategory: any;
  alertBeforeDays: any;
  createExpiryAlertConfig() {
    if(this.unmappedItemCategory.length > 0) {
      this.mode = new String('create');
    } else {
      this.dialogService.alert("All item category mapped")
    }
  }

  viewExpiryAlertConfig(expiryAlertConfigForm?: FormGroup) {
    this.mode = new String('view');
    this.getItemCategory(this.providerServiceMapID);
    if (expiryAlertConfigForm) {
      expiryAlertConfigForm.reset();
    }
    this.resetExpiryAlertConfigList();
  }

  edit_itemCategory: any;
  edit_alertBeforeDays: any;
  editExpiryAlertConfig(expiryAlertConfig) {
    this.mode = new String('edit');

    this.edit_itemCategory = expiryAlertConfig.itemCategoryID;
    this.edit_alertBeforeDays = expiryAlertConfig.alertBeforeDays;
  }

  addToExpiryAlertConfigList(expiryAlertConfigForm: FormGroup) {
    let expiryAlertConfig = Object.assign({}, expiryAlertConfigForm.value);

    if (!(this.checkDuplicateExpiryAlertConfig(expiryAlertConfig))) {
      this.expiryAlertConfigList.push(expiryAlertConfig);
      expiryAlertConfigForm.reset();
    } else {
      this.dialogService.alert("Item expiry alert config is already added in list");
    }
  }

  checkDuplicateExpiryAlertConfig(expiryAlertConfig) {
    let temp = this.expiryAlertConfigList.filter(item => {
      return item.itemCategory.itemCategoryID == expiryAlertConfig.itemCategory.itemCategoryID;
    })

    return temp.length > 0 ? true : false;
  }

  removeFromExpiryAlertConfigList(index) {
    this.expiryAlertConfigList.splice(index, 1);
  }

  submitExpiryAlertConfig(expiryAlertConfigForm: FormGroup) {
    let temp = JSON.parse(JSON.stringify(this.expiryAlertConfigList));
    temp.map(item => {
      item.alertBeforeDays = item.alertBeforeDays ? +item.alertBeforeDays : undefined;
      item.itemCategoryID = item.itemCategory.itemCategoryID;
      item.itemCategory = undefined;
    });

    this.storeService.saveExpiryAlertConfig(temp).subscribe(response => {
      console.log(response);
      expiryAlertConfigForm.reset();
      this.viewExpiryAlertConfig();
    });
  }

  updateExpiryAlertConfig(expiryAlertConfigForm: FormGroup) {
    let temp = JSON.parse(JSON.stringify(expiryAlertConfigForm.value));
    temp.alertBeforeDays = temp.edit_alertBeforeDays ? +(temp.edit_alertBeforeDays) : undefined;
    temp.itemCategoryID = this.edit_itemCategory;
    temp.edit_alertBeforeDays = undefined;

    this.storeService.saveExpiryAlertConfig([temp]).subscribe(response => {
      console.log(response);
      expiryAlertConfigForm.reset();
      this.viewExpiryAlertConfig();
    });
  }

  resetExpiryAlertConfigList() {
    this.expiryAlertConfigList.length = 0;
  }

}
