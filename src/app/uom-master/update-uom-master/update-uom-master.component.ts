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
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, } from '@angular/forms';

import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { UomMasterService } from '../../services/inventory-services/uom-master.service';

@Component({
  selector: 'app-update-uom-master',
  templateUrl: './update-uom-master.component.html',
  styleUrls: ['./update-uom-master.component.css']
})
export class UpdateUomMasterComponent implements OnInit {

  @Input('updateUOMValue')
  updateUOMValue: any;

  @Output('modeChange')
  modeChange = new EventEmitter();

  UOMMasterForm: FormGroup
  createdBy: string;
  providerServiceMapID: string;

  constructor(
    private fb: FormBuilder,
    private notificationService: ConfirmationDialogsService,
    private uomMasterService: UomMasterService) { }

  ngOnInit() {
    this.UOMMasterForm = this.createUOMMasterForm();
    if (this.updateUOMValue) {
      this.createdBy = this.updateUOMValue.createdBy;
      this.providerServiceMapID = this.updateUOMValue.providerServiceMapID;
      this.UOMMasterForm.patchValue(this.updateUOMValue);
    }
  }

  createUOMMasterForm() {
    return this.fb.group({
      UOM: this.fb.group({
        uOMID: null,
        uOMCode: { value: null, disabled: true },
        uOMName: { value: null, disabled: true },
        uOMDesc: null
      })
    })
  }

  updateUOMForm() {
    let temp = JSON.parse(JSON.stringify(this.UOMMasterForm.value));
    let UOMMaster = Object.assign({}, this.updateUOMValue.UOM, { uOMDesc: temp.UOM.uOMDesc, modifiedBy: this.createdBy, providerServiceMapID: this.providerServiceMapID })

    this.uomMasterService.updateUOMMaster(UOMMaster)
      .subscribe(response => {
        console.log('UOM', response);
        if (response) {
          this.notificationService.alert("Updated successfully", 'success');
          this.switchToViewMode();
        }
      }, (err) => {
        this.notificationService.alert(err.errorMessage, 'error')
        console.error("error in updating uom masters")
      });
  }

  switchToViewMode() {
    this.modeChange.emit('view');
  }

}
