import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DrugStrengthService } from '../services/ProviderAdminServices/drug-strength.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-drug-strength',
  templateUrl: './drug-strength.component.html',
  styleUrls: ['./drug-strength.component.css']
})
export class DrugStrengthComponent implements OnInit {

  createdBy: any;
  strength: any;
  strength_desc: any;
  drugStrengthID: any;
  confirmMessage: any;
  drugStrengthExist: any;

  /*Arrays*/
  drugStrength: any = [];
  drugStrengthList: any = [];
  availableStrengths: any = [];

  tableMode = true;
  formMode = false;
  editMode = false;

  @ViewChild('drugStrengthForm') drugStrengthForm: NgForm;

  constructor(public drugStrengthService: DrugStrengthService,
    public data_service: dataService,
    public alertService: ConfirmationDialogsService, ) { }

  ngOnInit() {
    this.createdBy = this.data_service.uname;
    this.getAllDrugStrength();
  }
  getAllDrugStrength() {
    this.drugStrengthService.getDrugStrength().subscribe(response => {
      if (response) {
        console.log("drug strength", response);
        this.drugStrength = response;
        for (let availableStrength of this.drugStrength) {
          this.availableStrengths.push(availableStrength.drugStrength);
        }
      }
    }, (err) => console.log('error', err));
  }

  checkStrengthAvailability(strength) {
    this.drugStrengthExist = this.availableStrengths.includes(strength);
    console.log("drugStrengthExist", this.drugStrengthExist);
  }

  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }

  add_object(formValue) {
    console.log("form values", formValue);
    let tempDrugStrengthObj = {
      'drugStrength': formValue.strength,
      'drugStrengthDesc': formValue.strength_desc,
      'createdBy': this.createdBy
    }
    this.checkDuplicates(tempDrugStrengthObj);
    this.drugStrengthForm.resetForm();
  }

  checkDuplicates(object) {
    let duplicateStatus = 0
    if (this.drugStrengthList.length === 0) {
      this.drugStrengthList.push(object);
    }
    else {
      for (let i = 0; i < this.drugStrengthList.length; i++) {
        if (this.drugStrengthList[i].drugStrength === object.drugStrength
        ) {
          duplicateStatus = duplicateStatus + 1;
        }
      }
      if (duplicateStatus === 0) {
        this.drugStrengthList.push(object);
      }
      else {
        this.alertService.alert("Already exists");
      }
    }
  }

  saveDrugStrength() {
    console.log('request object', this.drugStrengthList);
    this.drugStrengthService.saveDrugStrength(this.drugStrengthList).subscribe(response => this.successHandler(response), err => {
      console.log("error", err);
    });
  }

  successHandler(response) {
    this.drugStrengthList = [];
    this.alertService.alert('Saved successfully', 'success');
    this.redirectToMainPage();
  }

  remove_obj(index) {
    this.drugStrengthList.splice(index, 1);
  }

  back() {
    this.alertService.confirm('Confirm', 'Do you really want to cancel? Any unsaved data would be lost').subscribe(res => {
      if (res) {
        this.drugStrengthForm.resetForm();
        this.drugStrengthList = [];
        this.redirectToMainPage();

      }
    })
  }

  redirectToMainPage() {
    this.getAllDrugStrength();
    this.tableMode = true;
    this.formMode = false;
    this.drugStrengthForm.resetForm();
  }

  editDrugStrength(data) {
    console.log("edit values", data);
    this.editMode = true;
    this.tableMode = false;
    this.formMode = true;
    this.strength = data.drugStrength;
    this.strength_desc = data.drugStrengthDesc;
    this.drugStrengthID = data.drugStrengthID;
  }

  updateDrugStrength() {
    let updateDrugStrengthObj = {
      'drugStrengthID': this.drugStrengthID,
      'drugStrength': this.strength,
      'drugStrengthDesc': this.strength_desc,
      'modifiedBy': this.createdBy
    }
    this.drugStrengthService.updateDrugStrength(updateDrugStrengthObj).subscribe(updateResponse => this.updateSuccessHandler(updateResponse), err => {
      console.log("error", err);
    });
  }

  updateSuccessHandler(updateResponse) {
    this.alertService.alert('Updated successfully', 'success');
    this.redirectToMainPage();
  }

  activateDeactivate(drugStrengthID, flag) {
    let obj = {
      "drugStrengthID": drugStrengthID,
      "deleted": flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.alertService.confirm('Confirm', "Are you sure you want to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log("Deactivating or activating Obj", obj);
        this.drugStrengthService.drugStrengthActivationDeactivation(obj)
          .subscribe((res) => {
            console.log('Activation or deactivation response', res);
            this.alertService.alert(this.confirmMessage + "d successfully", 'success');
            this.getAllDrugStrength();
          }, (err) => console.log('error', err))
      }
    },
      (err) => {
        console.log(err);
      })
  }
}
