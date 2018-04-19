import { Component, OnInit, ViewChild } from '@angular/core';
import { Mainstroreandsubstore } from '../services/inventory-services/mainstoreandsubstore.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-main-store-and-sub-store',
  templateUrl: './main-store-and-sub-store.component.html',
  styleUrls: ['./main-store-and-sub-store.component.css']
})
export class MainStoreAndSubStoreComponent implements OnInit {

  create_store: any;
  facilityID: any;
  edit_facilityName: any;
  edit_facilityType: any;
  edit_State: any;
  edit_Serviceline: any;
  edit_substore: boolean = false;
  edit_mainstore: any = false;
  edit_physicalLocation: any;
  edit_location: any;
  edit_facilityDiscription: any;
  edit_facilityCode: any;

  state: any;
  serviceline: any;
  storeType: string;
  facilityTypeID: any;
  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  mainStoreDropdownState: boolean = false;
  create_Main_Store_radiobutton: boolean = false;
  create_Sub_Store_radiobutton: boolean = false;

  providerServiceMapID: any;
  serviceProviderID: any;
  createdBy: any;

  states_array: any = [];
  storeType_array: any = [];
  availableFacilityCode: any = [];
  services_array: any = [];
  store_array: any = [];
  filteredstoresList: any = [];
  facilityType_array: any = [];
  storesList: any = [];
  bufferArray: any = [];

  @ViewChild('storeSearchForm') facilitySearchForm: NgForm;
  @ViewChild('storeAddForm') facilityAddForm: NgForm;
  @ViewChild('storeEditForm') faciliTypEditForm: NgForm;
  constructor(private storeService: Mainstroreandsubstore, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.getServices();
  }
  getServices() {
    this.storeService.getServices(this.serviceProviderID).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
      }
    })
  }
  getstates(service) {
    this.storeService.getStates(this.serviceProviderID, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }
  getAllStores(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    this.storeService.getAllStores(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All stores services success', response);
        this.storesList = response;
        this.filteredstoresList = response;
        for (let availableFacilityCode of this.storesList) {
          this.availableFacilityCode.push(availableFacilityCode.facilityCode);
        }
        this.getFacilityType();
      }
    })
  }
  getFacilityType() {
    //this.providerServiceMapID = providerServiceMapID;
    debugger;
    this.storeService.getAllActiveFacilities(this.providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All Facility Types services success', response);
        this.facilityType_array = response;
        this.getStoreType();
      }
    })
  }
  getStoreType() {
    //this.providerServiceMapID = providerServiceMapID;
    debugger;
    this.storeService.getStoreType(this.providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All Main stores services success', response);
        this.storeType_array = response;

      }
    })
  }
  filterstoreList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredstoresList = this.storesList;
    }
    else {
      this.filteredstoresList = [];
      this.storesList.forEach((item) => {
        for (let key in item) {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredstoresList.push(item); break;
          }
        }
      });
    }

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
    this.create_Main_Store_radiobutton = true;
    this.disbleDropdown(true);
  }
  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  activate(facilityTypeID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
      if (response) {
        const object = {
          "facilityTypeID": facilityTypeID,
          "deleted": false

        };

        // this.storeService.deleteStore(object)
        //   .subscribe(response => {
        //     if (response) {
        //       this.dialogService.alert('Store  activated successfully');
        //       this.getAllStores(this.providerServiceMapID);
        //     }
        //   },
        //     err => {
        //       console.log('error', err);
        //     });
      }
    });

  }
  deactivate(facilityTypeID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
      if (response) {
        const object = {
          "facilityTypeID": facilityTypeID,
          "deleted": true
        };

        // this.storeService.deleteStore(object)
        //   .subscribe(response => {
        //     if (response) {
        //       this.dialogService.alert('Store Deactivated successfully');
        //       this.getAllStores(this.providerServiceMapID);
        //     }
        //   },
        //     err => {
        //       console.log('error', err);
        //     });
      }
    });

  }
  add2bufferArray(formvalues) {
    debugger;
    this.resetDropdowns();
    console.log("form values", formvalues);
    const obj = {
      "serviceName": this.serviceline.serviceName,
      "stateName": this.state.stateName,
      "facilityName": formvalues.facilityName,
      "facilityDesc": formvalues.facilityDescription,
      "facilityCode": formvalues.facilityCode,
      "facilityTypeID": formvalues.facilityType.facilityTypeID,
      "location": formvalues.createlocation,
      "mainFacilityID": this.storeType === "MAIN" ? null : formvalues.store.mainFacilityID,
      "physicalLocation": formvalues.physicalLocation,
      "storeType": this.storeType,
      "status": "active",
      "isMainFacility": this.storeType === "MAIN" ? true : false,
      "createdBy": this.createdBy,
      "providerServiceMapID": this.providerServiceMapID
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
        if (this.bufferArray[i].facilityCode === object.facilityCode &&
          this.bufferArray[i].facilityName === object.facilityName
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
    this.storeService.saveStore(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of store');
        this.dialogService.alert('Store created successfully');
        this.resetDropdowns();
        this.showTable();
        this.getAllStores(this.providerServiceMapID);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  editFacility(editFormValues) {
    debugger;
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.facilityID = editFormValues.facilityID;
    this.edit_facilityType = editFormValues.facilityTypeID;
    this.edit_facilityName = editFormValues.facilityName;
    this.edit_facilityCode = editFormValues.facilityCode;
    this.edit_facilityDiscription = editFormValues.facilityDesc;//facilityTypeID
    this.edit_location = editFormValues.location;
    this.edit_physicalLocation = editFormValues.physicalLocation;
    editFormValues.storeType === "MAIN" ? this.edit_mainstore = true : this.edit_substore = true;
    this.showEditForm();
    console.log("edit form values", editFormValues)
  }
  updateFacilityType(editedFormValues) {
    debugger;
    const editObj = {
      "facilityID": this.facilityID,
      "facilityDesc": editedFormValues.facilityDescription,
      "ModifiedBy": this.createdBy
    }

    this.storeService.updateStore(editObj).subscribe(response => {
      if (response) {
        console.log(response, 'after successful updation of Store');
        this.dialogService.alert('Store updated successfully');
        this.resetDropdowns();
        this.showTable();
        this.getAllStores(this.providerServiceMapID);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }

  resetDropdowns() {
    this.edit_facilityDiscription = undefined;
  }
  disbleDropdown(value) {
    if (value) {
      this.storeType = "MAIN";
      this.create_store = undefined;
      this.create_Main_Store_radiobutton = true;
    }
    else {
      this.storeType = "SUB";
    }
    this.mainStoreDropdownState = value;
  }
  FacilityCodeExist: any = false;
  checkExistance(facilityCode) {
    debugger;
    this.FacilityCodeExist = this.availableFacilityCode.includes(facilityCode);
    console.log(this.FacilityCodeExist);
  }

}
