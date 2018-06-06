import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, } from '@angular/forms';

import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { UomMasterService } from '../../services/inventory-services/uom-master.service';

@Component({
  selector: 'app-create-uom-master',
  templateUrl: './create-uom-master.component.html',
  styleUrls: ['./create-uom-master.component.css']
})
export class CreateUomMasterComponent implements OnInit {

  @Input('otherDetails')
  otherDetails: any;

  @Output('modeChange')
  modeChange = new EventEmitter();

  UOMMasterForm: FormGroup
  createdBy: string;
  providerServiceMapID: string;
  UOMMasterList = [];

  constructor(
    private fb: FormBuilder,
    private notificationService: ConfirmationDialogsService,
    private uomMasterService: UomMasterService) { }

  ngOnInit() {
    this.UOMMasterForm = this.createUOMMasterForm();
    if (this.otherDetails) {
      this.createdBy = this.otherDetails.createdBy;
      this.providerServiceMapID = this.otherDetails.providerServiceMapID;
      this.UOMMasterForm.patchValue({
        service: this.otherDetails.service.serviceName,
        state: this.otherDetails.state.stateName
      });
    }
  }

  createUOMMasterForm() {
    return this.fb.group({
      service: null,
      state: null,
      UOM: this.fb.group({
        uOMCode: null,
        uOMName: null,
        uOMDesc: null
      })
    })
  }

  addToUOMMasterList() {
    let temp = JSON.parse(JSON.stringify(this.UOMMasterForm.value));
    if (temp && temp.UOM && temp.UOM.uOMCode){
      this.UOMMasterList.push(temp.UOM);
      this.UOMMasterForm.controls['UOM'].reset();
    }
  }

  deleteFromUOMMasterList(i) {
    this.UOMMasterList.splice(i, 1);
  }

  submitUOMForm() {
    let temp = this.UOMMasterList.slice();
    temp.forEach(item => {
      item.createdBy = this.createdBy;
      item.providerServiceMapID = this.providerServiceMapID;
    })

    this.uomMasterService.postUOMMaster(temp)
      .subscribe(response => {
        console.log('UOM', response);
        if (response.length > 0){
          this.notificationService.alert("Created successfully", 'success');
          this.switchToViewMode();
        }
      }, (err) => {
        this.notificationService.alert(err, 'error');
        console.error("error in fetching uom masters")
      });
  }

  switchToViewMode() {
    this.modeChange.emit('view');
  }


}
