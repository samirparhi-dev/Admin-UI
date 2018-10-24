import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, } from '@angular/forms';

import { CommonServices } from '../../services/inventory-services/commonServices';
import { dataService } from '../../services/dataService/data.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';

import { StoreMappingService } from '../../services/inventory-services/store-mapping.service';

@Component({
  selector: 'app-view-store-mapping',
  templateUrl: './view-store-mapping.component.html',
  styleUrls: ['./view-store-mapping.component.css']
})
export class ViewStoreMappingComponent implements OnInit {

  storeSearchForm: FormGroup;
  providerID: string;
  createdBy: string;
  userID: string;
  providerServiceMapID: string;
  parkAndHub: any;
  vanAndSpoke: any;

  serviceLineList: [any];
  stateList: [any];
  storeList = [];
  filteredStoreList = [];

  mode = 'view';

  constructor(
    private fb: FormBuilder,
    private commonDataService: dataService,
    private storeMappingService: StoreMappingService,
    private commonServices: CommonServices,
    private dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.providerID = this.commonDataService.service_providerID;
    this.createdBy = this.commonDataService.uname;
    this.userID = this.commonDataService.uid;

    this.storeSearchForm = this.createStoreSearchForm();
    this.subscribeToServiceLineChange();
    this.subscribeToStateChange();
    this.getServiceLine(this.userID);
  }

  ngOnDestroy() {
    if (this.serviceLineSubs)
      this.serviceLineSubs.unsubscribe();
  }

  createStoreSearchForm() {
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
    this.storeSearchForm.controls['service'].valueChanges
      .subscribe(value => {
        if (value) {
          this.filteredStoreList = [];
          this.storeList = [];
          this.getState(this.userID, value);
        }
      })
  }

  stateSubs: any;
  getState(userID: string, service: any) {
    if (service.serviceID == 4) {
      this.parkAndHub = "Hub";
      this.vanAndSpoke = "Spoke";
    } else {
      this.parkAndHub = "Parking Place";
      this.vanAndSpoke = "Van";

    }
    this.stateSubs = this.commonServices.getStatesOnServices(userID, service.serviceID, false).
      subscribe(response => {
        this.stateList = response;
      }, (err) => {
        this.dialogService.alert(err, 'error')
        console.error("error in fetching states")
      });
  }

  subscribeToStateChange() {
    this.storeSearchForm.controls['state'].valueChanges
      .subscribe(value => {
        if (value && value.providerServiceMapID) {
          this.providerServiceMapID = value.providerServiceMapID;
          this.getAllStore(value.providerServiceMapID);
        }
      })
  }

  storeSubs: any;
  getAllStore(providerServiceMapID) {
    this.storeSubs = this.storeMappingService.getAllStore(providerServiceMapID).
      subscribe(response => {
        this.storeList = response;
        this.filteredStoreList = response;
        console.log('Store', this.storeList);
      }, (err) => {
        this.dialogService.alert(err, 'error')
        console.error("error in fetching store")
      });
  }

  filterStoreList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredStoreList = this.storeList.slice();
    } else {
      this.filteredStoreList = [];
      this.storeList.forEach((item) => {
        for (let key in item) {
          if (key == 'facilityName' || key == 'storeType' || key == 'parkingPlaceName' || key == 'vanName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              if (this.filteredStoreList.indexOf(item) == -1)
                this.filteredStoreList.push(item);
            }
          }

        }
      });
    }
  }

  deleteMapping(store) {
    this.dialogService.confirm('Confirm', "Are you sure you want to unmap?").subscribe((res) => {
      if (res) {
        let temp = Object.assign({}, {
          "createdBy": this.createdBy,
          "facilityID": store.facilityID,
          "parkingPlaceID": store.parkingPlaceID,
          "vanID": store.vanID
        })
        this.storeMappingService.deleteMapping(temp)
          .subscribe(response => {
            this.dialogService.alert("Unmapped successfully", 'success');
            this.getAllStore(this.providerServiceMapID);
          }, (err) => {
            this.dialogService.alert(err.errorMessage, 'error')
          });
      }
    });
  }


  otherDetails: any;
  switchToCreateMode() {
    debugger;
    this.otherDetails = Object.assign({}, this.storeSearchForm.value, { providerServiceMapID: this.providerServiceMapID, createdBy: this.createdBy })
    this.mode = 'create';
  }

  switchToViewMode() {
    this.mode = 'view';
    this.getAllStore(this.providerServiceMapID);
  }

  storeDetails: any;
  switchToUpdateMode(store) {
    this.storeDetails = Object.assign({}, { store }, { providerServiceMapID: this.providerServiceMapID, createdBy: this.createdBy })
    this.mode = 'update';
  }

  trackByFn(index, item) {
    return item.facilityID;
  }

}
