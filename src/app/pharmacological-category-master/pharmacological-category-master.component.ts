import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PharmacologicalMasterService } from '../services/inventory-services/pharmacological-category-service';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-pharmacological-category-master',
  templateUrl: './pharmacological-category-master.component.html',
  styleUrls: ['./pharmacological-category-master.component.css']
})
export class PharmacologicalCategoryMasterComponent implements OnInit {
  createButton: boolean = false;
  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  services_array: any = [];
  states_array: any = [];
  pharmacologicalList: any = [];
  filteredPharmacologicalList: any = [];
  availablepharmacologicalCode: any = [];
  bufferArray: any = [];
  edit_pharmaName: any;
  edit_pharmaDesc: any;
  edit_pharmaCode: any;
  pharmCategoryID: any;
  confirmMessage: any;
  state: any;
  edit_State: any;
  serviceline: any;
  edit_Serviceline: any;

  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  displayTable: boolean = false;
  @ViewChild('PharmaAddForm') PharmaAddForm: NgForm;

  constructor(public commonservice: CommonServices, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService, private pharmacologicalService: PharmacologicalMasterService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    console.log(this.createdBy, "CreatedBy");
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.getServices();
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
    debugger;
    this.commonservice.getStatesOnServices(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }
  getAllPharmacology(providerServiceMapID) {
    debugger
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.pharmacologicalService.getAllPharmacologyList(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All stores services success', response);
        this.pharmacologicalList = response;
        this.filteredPharmacologicalList = response;
        this.displayTable = true;
        for (let availablepharmacologicalCode of this.pharmacologicalList) {
          this.availablepharmacologicalCode.push(availablepharmacologicalCode.pharmCategoryCode);
        }
      }
    })
  }
  add2buffer(formvalues) {
    debugger;
    console.log("form values", formvalues);
    const obj = {
      "pharmCategoryCode": formvalues.pharmaCode,
      "pharmCategoryName": formvalues.pharmaName,
      "pharmCategoryDesc": formvalues.pharmaDesc,
      'providerServiceMapID': this.providerServiceMapID,
      'createdBy': this.createdBy
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
        if (this.bufferArray[i].pharmCategoryCode == object.pharmCategoryCode &&
          this.bufferArray[i].pharmCategoryName == object.pharmCategoryName
        ) {
          duplicateStatus = duplicateStatus + 1;
          this.dialogService.alert("Pharmacology is already added in list");
        }
      }
      if (duplicateStatus === 0) {
        this.bufferArray.push(object);
      }
    }
  }
  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }
  savePharmacology() {
    debugger;
    console.log("object before saving the pharmacology", this.bufferArray);
    this.pharmacologicalService.savePharmacology(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of pharmacology');
        this.dialogService.alert('Saved successfully', 'success');
        this.showTable();
        this.getAllPharmacology(this.providerServiceMapID);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  filterPharmacologicalList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredPharmacologicalList = this.pharmacologicalList;
    }
    else {
      this.filteredPharmacologicalList = [];
      this.pharmacologicalList.forEach((item) => {
        for (let key in item) {
          if (key == "pharmCategoryCode" || key == "pharmCategoryName" || key == "pharmCategoryDesc") {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredPharmacologicalList.push(item); break;
            }
          }
        }
      });
    }

  }
  editPharm(editformvalues) {
    debugger;
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.pharmCategoryID = editformvalues.pharmacologyCategoryID;
    this.edit_pharmaCode = editformvalues.pharmCategoryCode;
    this.edit_pharmaName = editformvalues.pharmCategoryName;
    this.edit_pharmaDesc = editformvalues.pharmCategoryDesc;
    this.showEditForm();
  }
  updatepharmacology(editformvalues) {
    debugger;
    const editObj = {
      "pharmCategoryDesc": editformvalues.pharmaDesc,
      "ModifiedBy": this.createdBy,
      "pharmacologyCategoryID": this.pharmCategoryID
    }
    this.pharmacologicalService.updatePharmacology(editObj).subscribe(response => {
      if (response) {
        this.showTable();
        this.getAllPharmacology(this.providerServiceMapID);
        console.log(response, 'after successful updation of Pharmacology');
        this.dialogService.alert('Updated successfully', 'success');

      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  activateDeactivate(pharmaCategoryID, flag) {
    debugger;
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.dialogService.confirm('Confirm', "Are you sure you want to " + this.confirmMessage + "?").subscribe(response => {
      if (response) {
        const object = {
          "pharmacologyCategoryID": pharmaCategoryID,
          "deleted": flag
        };
        this.pharmacologicalService.deletePharmacology(object)
          .subscribe((res) => {
            if (res.response != undefined) {
              this.dialogService.alert(res.response, 'error');
            }
            else {
              this.dialogService.alert(this.confirmMessage + "d successfully", 'success');
              this.getAllPharmacology(this.providerServiceMapID);

            }

          }, (err) => {
            console.log("error", err);
          });
      }
    });

  }
  showForm() {
    debugger;
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }
  showEditForm() {
    debugger;
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  showTable() {
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.bufferArray = [];
    this.displayTable = true;
    this.filteredPharmacologicalList = this.pharmacologicalList;
    // this.getAllPharmacology(this.providerServiceMapID);
  }

  PharmaCodeExist: any = false;
  checkExistance(pharmaCode) {
    if (pharmaCode) {
      this.pharmacologicalService.checkForUniquePharmacolgyCategory(pharmaCode, this.providerServiceMapID)
        .subscribe(response => {
          let temp = this.bufferArray.filter(item => item.pharmCategoryCode == pharmaCode);
          if (response.response == 'true' || temp.length > 0) {
            this.PharmaCodeExist = true;
            this.PharmaAddForm.controls["pharmaCode"].setErrors({ unique: true });
          } else {
            this.PharmaCodeExist = false;
            this.PharmaAddForm.controls["pharmaCode"].setErrors(null);
          }
          console.log(response.response, this.PharmaCodeExist, temp.length);
        })
    }
  }
}
