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
  edit_country: any;
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
  edit_state1: any;
  edit_serviceline: any;
  serviceline: any;
  uid: any;
  permnantstates_array: any = [];
  country_array: any = [];
  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  create_filterTerm: string;

  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  displayTable: boolean = false;
  countryCheck: boolean = false;

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
  @ViewChild('supplierAddForm') supplierAddForm: NgForm;

  constructor(private supplierService: SuppliermasterService, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    console.log(this.createdBy, "CreatedBy");
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.getServices();
    this.getAllCountry();
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
  getDistricts(stateID) {
    this.addressStateID = stateID;
    this.supplierService.getAllDistricts(this.addressStateID).subscribe(response => {
      this.getPermanentDistrictsSuccessHandler(response)
    }, (err) => console.log(err, 'error'));
  }
  getPermanentDistrictsSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.districts_array = response;
  }
  getAllStates(countryID) {
    debugger;
    if (countryID != 1) {
      this.countryCheck = true;
    }
    else {
      this.supplierService.getAllStates().subscribe(response => {
        this.getPermanentStatesSuccessHandler(response)
      }, (err) => console.log(err, 'error'));
    }
  }
  getPermanentStatesSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.permnantstates_array = response;
  }
  getAllCountry() {
    this.supplierService.getAllCountry().subscribe(response => {
      this.getCountrySuccessHandler(response)
    }, (err) => console.log(err, 'error'));
  }
  getCountrySuccessHandler(response) {
    console.log("Display all Country", response);
    this.country_array = response;
  }

  getAllSuppliers(providerServiceMapID) {
    debugger;
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.supplierService.getAllSuppliers(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All stores services success', response);
        this.supplierList = response;
        this.filteredsupplierList = response;
        this.displayTable = true;
        for (let availableSupplierCode of this.supplierList) {
          this.availableSupplierCode.push(availableSupplierCode.supplierCode);
        }

      }
    })
  }
  showTable() {
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.bufferArray = [];
    this.resetDropdowns();
    this.getAllSuppliers(this.providerServiceMapID);
    this.create_filterTerm = '';
    //this.filteredsupplierList = this.supplierList;
  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.countryCheck = false;
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
              this.create_filterTerm = '';
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
              this.create_filterTerm = '';
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
    //this.resetDropdowns();
    this.districts_array = [];
    console.log("form values", formvalues);
    const obj = {
      "serviceName": this.serviceline.serviceName,
      "stateName": formvalues.state.stateName,
      "supplierCode": formvalues.supplierCode,
      "supplierName": formvalues.supplierName,
      "supplierDesc": formvalues.supplierDesc,
      "contactPerson": formvalues.contactPerson,
      "drugLicenseNo": formvalues.drugLicense,
      "cST_GST_No": formvalues.cstNo,
      "tIN_No": formvalues.tinNo,
      "email": formvalues.primaryEmail,
      "status": "active",
      "phoneNo1": formvalues.primaryMobileNo,
      "phoneNo2": formvalues.emergencyContactNo,
      "createdBy": this.createdBy,
      "providerServiceMapID": this.providerServiceMapID,
      "addressLine1": formvalues.addressLine1,
      "addressLine2": formvalues.addressLine2,
      "districtID": formvalues.district,
      "stateID": formvalues.state.stateID,
      "pinCode": formvalues.pincode,
      "countryID": formvalues.country.countryID,
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
  saveSupplier() {
    debugger;
    console.log("object before saving the supplier", this.bufferArray);
    this.supplierService.saveSupplier(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of supplier');
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
    this.edit_serviceline = this.serviceline.serviceID;
    this.edit_state = this.state.stateID;
    this.getAllStates(editFormValues.countryID);
    this.getDistricts(editFormValues.stateID);
    this.supplierID = editFormValues.supplierID;
    this.edit_supplierCode = editFormValues.supplierCode;
    this.edit_supplierName = editFormValues.supplierName;
    this.edit_supplierDesc = editFormValues.supplierDesc;
    this.edit_contactPerson = editFormValues.contactPerson;
    this.edit_drugLicense = editFormValues.drugLicenseNo;//facilityTypeID
    this.edit_cstNo = editFormValues.cST_GST_No;
    this.edit_tinNo = editFormValues.tIN_No;
    this.edit_AddressLine1 = editFormValues.addressLine1;
    this.edit_AddressLine2 = editFormValues.addressLine2;
    this.edit_state1 = editFormValues.stateID;
    this.edit_Pincode = editFormValues.pinCode;
    this.edit_contactNo = editFormValues.phoneNo1;
    this.edit_emergencyContactNo = editFormValues.phoneNo2;
    this.edit_emailID = editFormValues.email;
    this.edit_district = editFormValues.districtID;
    this.edit_country = editFormValues.countryID;
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
    if (supplierCode) {
      this.supplierService.checkForUniqueSupplierCode(supplierCode, this.providerServiceMapID)
        .subscribe(response => {
          let temp = this.bufferArray.filter(item => item.supplierCode == supplierCode);
          if (response.response == 'true' || temp.length > 0) {
            this.SupplierCodeExist = true;
            this.supplierAddForm.controls['supplierCode'].setErrors({ unique: true });
          }
          else {
            this.SupplierCodeExist = false;
            this.supplierAddForm.controls['supplierCode'].setErrors(null);
          }
          console.log(response.response, temp.length, this.SupplierCodeExist);
        })
    }
  }
}
