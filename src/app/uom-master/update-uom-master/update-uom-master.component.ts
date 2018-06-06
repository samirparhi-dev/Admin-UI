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
        uOMCode: null,
        uOMName: null,
        uOMDesc: null
      })
    })
  }

  updateUOMForm() {
    let temp = JSON.parse(JSON.stringify(this.UOMMasterForm.value));
    let UOMMaster = Object.assign({}, temp.UOM, { modifiedBy: this.createdBy, providerServiceMapID: this.providerServiceMapID })

    this.uomMasterService.updateUOMMaster(UOMMaster)
      .subscribe(response => {
        console.log('UOM', response);
        if (response){
          this.notificationService.alert("Updated successfully", 'success');
          this.switchToViewMode();
        }
      }, (err) => {
        this.notificationService.alert(err, 'error')
        console.error("error in updating uom masters")
      });
  }

  switchToViewMode() {
    this.modeChange.emit('view');
  }

}
