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
import { StoreSelfConsumptionServiceService } from 'app/services/inventory-services/store-self-consumption-service.service';
import { ItemFacilityMappingService } from 'app/services/inventory-services/item-facility-mapping.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-store-self-consumption',
  templateUrl: './store-self-consumption.component.html',
  styleUrls: ['./store-self-consumption.component.css']
})
export class StoreSelfConsumptionComponent implements OnInit {

  itemStockExit: any = [{}];
  itemsList: any;
  facilityID: any;
  providerServiceMapID: any;

  constructor(private consumptionService: StoreSelfConsumptionServiceService,
    private itemStoremappingService: ItemFacilityMappingService,
    private alertService: ConfirmationDialogsService) {
    this.facilityID = localStorage.getItem('inventoryService');
    if(this.facilityID==null || this.facilityID<=0){

    }
    this.providerServiceMapID = 1783;
    this.getItems(this.facilityID);
  }

  ngOnInit() {
  }
  getItems(facID) {
    this.consumptionService.getStoreItemsCall(facID).subscribe(response => {
      console.log('success while getting items', response);
      this.itemsList = response;
    }, err => {
      this.alertService.alert(err, 'error');
      console.log('err while getting services', err);
    })
  }

  addStock() {
    var stock = {}
    this.itemStockExit.push(stock);
  }

  removeStock(index) {
    this.itemStockExit.splice(index, 1)
  }

  filterItem(val: string) {
    if (val) {
      const filterValue = val.toLowerCase();
      return this.itemsList.filter(item => item.itemName.toLowerCase().startsWith(filterValue));
    }
  }

  displayFn(item?: any): string | undefined {
    return item ? item.itemName : undefined;
  }

  getBatch(item, i) {
    // var i=this.itemsList.indexOf(item);
    this.consumptionService.getItemBatchForStoreIDCall(item.itemID, this.facilityID).subscribe(response => {
      console.log('success while getting items batch', response);
      this.itemStockExit[i].batchSelection = response;
    }, err => {
      this.alertService.alert(err, 'error');
      console.log('err while getting services', err);
    })
  }

  saveSelfConsumption() {
    var checkoutOBj = []
    var stockID = []
    this.itemStockExit.every(function (element, index) {
      console.log(element, index)
      if (element.batchNo != null && element.batchNo.itemStockEntryID != null) {
        if (element.quantity != null && element.batchNo.quantityInHand >= element.quantity) {
          var indexofStock = stockID.indexOf(element.batchNo.itemStockEntryID);
          if (indexofStock > 0) {
            stockID.push(element.batchNo.itemStockEntryID);
            checkoutOBj.push(element);
          } else {
            this.alertService.alert("Two item cannot be of same Batch. Sl no(" + (index + 1) + " and " + (indexofStock + 1), 'error');
            return false;
          }


        } else {
          this.alertService.alert("Sl no " + (index + 1) + " quantity should be less than quantity in hand", 'error');
          return false;
        }
      } else {
        this.alertService.alert("Please select Batch for Sl No." + (index + 1), 'error');
        return false;
      }
      return true

    });
  }

  reset() {

  }
}
