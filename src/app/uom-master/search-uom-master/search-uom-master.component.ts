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
import { FormBuilder, FormArray, FormGroup, } from '@angular/forms';

import { CommonServices } from '../../services/inventory-services/commonServices';
import { dataService } from '../../services/dataService/data.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';

import { UomMasterService } from '../../services/inventory-services/uom-master.service';

@Component({
  selector: 'app-search-uom-master',
  templateUrl: './search-uom-master.component.html',
  styleUrls: ['./search-uom-master.component.css']
})
export class SearchUomMasterComponent implements OnInit {
  uomMasterSearchForm: FormGroup;
  providerID: string;
  createdBy: string;
  userID: string;
  providerServiceMapID: string;

  serviceLineList: [any];
  stateList: [any];
  UOMMasterList = [];
  filteredUOMMasterList = [];

  mode = 'view';

  constructor(
    private fb: FormBuilder,
    private commonDataService: dataService,
    private uomMasterService: UomMasterService,
    private commonServices: CommonServices,
    private dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.providerID = this.commonDataService.service_providerID;
    this.createdBy = this.commonDataService.uname;
    this.userID = this.commonDataService.uid;

    this.uomMasterSearchForm = this.createUOMMasterSearchForm();
    this.subscribeToServiceLineChange();
    this.subscribeToStateChange();
    this.getServiceLine(this.userID);
  }

  ngOnDestroy() {
    if (this.serviceLineSubs)
      this.serviceLineSubs.unsubscribe();
  }

  createUOMMasterSearchForm() {
    return this.fb.group({
      service: null,
      state: null
    })
  }

  serviceLineSubs: any;
  getServiceLine(userID: string) {
    this.serviceLineSubs = this.commonServices.getServiceLines(userID)
      .subscribe((response) => {
        this.serviceLineList = response;
      }, (err) => {
        this.dialogService.alert(err, 'error')
        console.error("error in fetching serviceLines");
      });
  }

  subscribeToServiceLineChange() {
    this.uomMasterSearchForm.controls['service'].valueChanges
      .subscribe(value => {
        if (value) {
          this.getState(this.userID, value);
        }
      })
  }

  stateSubs: any;
  getState(userID: string, service: any) {
    this.stateSubs = this.commonServices.getStatesOnServices(userID, service.serviceID, false).
      subscribe(response => {
        this.stateList = response;
      }, (err) => {
        this.dialogService.alert(err, 'error')
        console.error("error in fetching states")
      });
  }

  subscribeToStateChange() {
    this.uomMasterSearchForm.controls['state'].valueChanges
      .subscribe(value => {
        if (value && value.providerServiceMapID) {
          this.providerServiceMapID = value.providerServiceMapID;
          this.getUOMMaster(value.providerServiceMapID);
        }
      })
  }

  uomSubs: any;
  getUOMMaster(providerServiceMapID) {
    this.uomSubs = this.uomMasterService.getAllUOMMaster(providerServiceMapID).
      subscribe(response => {
        this.UOMMasterList = response;
        this.filteredUOMMasterList = response;
        console.log('UOM', this.UOMMasterList);
      }, (err) => {
        this.dialogService.alert(err, 'error')
        console.error("error in fetching uom masters")
      });
  }

  filterUOMMasterList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredUOMMasterList = this.UOMMasterList.slice();
    } else {
      this.filteredUOMMasterList = [];
      this.UOMMasterList.forEach((item) => {
        for (let key in item) {
          if (key == 'uOMCode' || key == 'uOMName' || key == 'uOMDesc') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              if (this.filteredUOMMasterList.indexOf(item) == -1)
                this.filteredUOMMasterList.push(item);
            }
          }

        }
      });
    }
  }

  activateDeactivateUOM(uomID, flag) {
    let confirmMessage;
    if (flag) {
      confirmMessage = 'Block';
    } else {
      confirmMessage = 'Unblock';
    }
    this.dialogService.confirm('Confirm', "Are you sure you want to " + confirmMessage + "?")
      .subscribe((res) => {
        if (res) {
          this.uomMasterService.toggleDeleted(uomID, flag)
            .subscribe(response => {
              this.dialogService.alert(confirmMessage + "ed successfully", 'success');
              this.getUOMMaster(this.providerServiceMapID);
            }, (err) => {
              console.error("error in fetching uom masters")
              this.dialogService.alert(err, 'error')
            });
        }
      });
  }


  otherDetails: any;
  switchToCreateMode() {
    this.otherDetails = Object.assign({}, this.uomMasterSearchForm.value, { providerServiceMapID: this.providerServiceMapID, createdBy: this.createdBy })
    this.mode = 'create';
  }

  switchToViewMode() {
    this.mode = 'view';
    this.getUOMMaster(this.providerServiceMapID);
  }

  updateUOMValue: any;
  switchToUpdateMode(UOM) {
    this.updateUOMValue = Object.assign({}, { UOM }, { providerServiceMapID: this.providerServiceMapID, createdBy: this.createdBy })
    this.mode = 'update';
  }

  trackByFn(index, item) {
    return item.uomID;
  }

}
