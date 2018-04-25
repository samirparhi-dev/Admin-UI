import { Component, OnInit, ViewChild } from '@angular/core';
import { SuppliermasterService } from '../services/inventory-services/suppliermaster.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.css']
})
export class SupplierMasterComponent implements OnInit {

  createButton: boolean = false;
  supplierID: any;
  state: any;
  edit_emergencyContactNo: any;
  edit_contactNo: any;
  edit_emailID: any;
  edit_Pincode: any;
  edit_district: any;
  edit_AddressLine2: any;
  edit_AddressLine1: any;
  edit_tinNo: any;
  edit_cstNo: any;
  edit_drugLicense: any;
  edit_contactPerson: any;
  edit_supplierDesc: any;
  edit_supplierName: any;
  edit_supplierCode: any;
  edit_state: any;
  edit_serviceline: any;
  serviceline: any;
  uid: any;
  emailPattern = /^[0-9a-z_.]+@[a-z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;


  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;

  addressStateID: any;
  createdBy: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  services_array: any = [];
  states_array: any = [];
  supplierList: any = [];
  filteredsupplierList: any = [];
  bufferArray: any = [];
  districts_array: any = [];
  availableSupplierCode: any = [];

  constructor(private supplierService: SuppliermasterService, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    console.log(this.createdBy, "CreatedBy");
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.getServices();
  }
  getServices() {
    this.supplierService.getServices(this.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
      }
    })
  }
  getstates(service) {
    debugger;
    this.supplierService.getStates(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }
  getDistricts(state) {
    this.addressStateID = state.stateID;
    this.supplierService.getAllDistricts(this.addressStateID).subscribe(response => {
      this.getPermanentDistrictsSuccessHandler(response)
    }, (err) => this.dialogService.alert(err, 'error'));
  }
  getPermanentDistrictsSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.districts_array = response;
  }
  getAllSuppliers(providerServiceMapID) {
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.supplierService.getAllSuppliers(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All stores services success', response);
        this.supplierList = response;
        this.filteredsupplierList = response;
        for (let availableSupplierCode of this.supplierList) {
          this.availableSupplierCode.push(availableSupplierCode.supplierCode);
        }

      }
    })
  }
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.resetDropdowns();
    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.resetDropdowns();
    }

  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }
  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  filtersupplierList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsupplierList = this.supplierList;
    }
    else {
      this.filteredsupplierList = [];
      this.supplierList.forEach((item) => {
        for (let key in item) {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredsupplierList.push(item); break;
          }
        }
      });
    }

  }
  activate(supplierID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
      if (response) {
        const object = {
          "supplierID": supplierID,
          "deleted": false

        };

        this.supplierService.deleteSupplier(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Activated successfully', 'success');
              this.getAllSuppliers(this.providerServiceMapID);
            }
          },
            err => {
              console.log('error', err);
            });
      }
    });

  }
  deactivate(supplierID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
      if (response) {
        const object = {
          "supplierID": supplierID,
          "deleted": true
        };

        this.supplierService.deleteSupplier(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Deactivated successfully', 'success');
              this.getAllSuppliers(this.providerServiceMapID);
            }
          },
            err => {
              console.log('error', err);
            });
      }
    });

  }
  add2buffer(formvalues) {
    debugger;
    this.resetDropdowns();
    console.log("form values", formvalues);
    const obj = {
      "serviceName": this.serviceline.serviceName,
      "stateName": formvalues.state.stateName,
      "supplierCode": formvalues.supplierCode,
      "supplierName": formvalues.supplierName,
      "supplierDesc": formvalues.supplierDesc,
      "contactPerson": formvalues.contactPerson,
      "drugLicenseNo": formvalues.drugLicense,
      "cST_GST_No ": formvalues.cstNo,
      "tIN_No": formvalues.tinNo,
      "email": formvalues.primaryEmail,
      "status": "active",
      "phoneNo1": formvalues.primaryMobileNo,
      "phoneNo2": formvalues.emergencyContactNo,
      "createdBy": this.createdBy,
      "providerServiceMapID": this.providerServiceMapID,
      // "supplierAddress": {
      "addressLine1": formvalues.addressLine1,
      "addressLine2": formvalues.addressLine2,
      "districtID": formvalues.district,
      "stateID": formvalues.state.stateID,
      "pinCode": formvalues.pincode,
      // }


    }
    this.checkDuplictes(obj);
  }
  checkDuplictes(object) {
    let duplicateStatus = 0
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }
    else {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].supplierCode === object.supplierCode &&
          this.bufferArray[i].supplierName === object.supplierName
        ) {
          duplicateStatus = duplicateStatus + 1;
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
  saveStores() {
    debugger;
    console.log("object before saving the store", this.bufferArray);
    this.supplierService.saveSupplier(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of store');
        this.dialogService.alert('Saved successfully', 'success');
        this.resetDropdowns();
        this.showTable();
        this.getAllSuppliers(this.providerServiceMapID);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  editsupplier(editFormValues) {
    debugger;
    this.edit_serviceline = this.serviceline;
    this.edit_state = this.state;
    this.supplierID = editFormValues.supplierID;
    this.edit_supplierCode = editFormValues.supplierCode;
    this.edit_supplierName = editFormValues.supplierName;
    this.edit_supplierDesc = editFormValues.supplierDesc;
    this.edit_contactPerson = editFormValues.contactPerson;
    this.edit_drugLicense = editFormValues.drugLicenseNo;//facilityTypeID
    this.edit_cstNo = editFormValues.cstNo;
    this.edit_tinNo = editFormValues.tIN_No;
    this.edit_AddressLine1 = editFormValues.addressLine1;
    this.edit_AddressLine2 = editFormValues.addressLine2;
    this.edit_district = editFormValues.district;
    this.edit_Pincode = editFormValues.pincode;
    this.edit_contactNo = editFormValues.phoneNo1;
    this.edit_emergencyContactNo = editFormValues.phoneNo2;
    this.edit_emailID = editFormValues.email;
    this.showEditForm();
    console.log("edit form values", editFormValues)
  }
  updatesupplier(editedFormValues) {
    debugger;
    const editObj = {
      "supplierID": this.supplierID,
      "supplierDesc": editedFormValues.supplierDesc,
      "ModifiedBy": this.createdBy
    }

    this.supplierService.updateSupplier(editObj).subscribe(response => {
      if (response) {
        console.log(response, 'after successful updation of Store');
        this.dialogService.alert('Updated successfully', 'success');
        this.resetDropdowns();
        this.showTable();
        this.getAllSuppliers(this.providerServiceMapID);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  resetDropdowns() {

  }
  SupplierCodeExist: any = false;
  checkExistance(supplierCode) {
    this.SupplierCodeExist = this.availableSupplierCode.includes(supplierCode);
    console.log(this.SupplierCodeExist);
  }
}
