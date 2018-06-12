import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { StoreMappingService } from '../../services/inventory-services/store-mapping.service';
import { Jsonp } from '@angular/http/src/http';

@Component({
  selector: 'app-create-store-mapping',
  templateUrl: './create-store-mapping.component.html',
  styleUrls: ['./create-store-mapping.component.css']
})
export class CreateStoreMappingComponent implements OnInit {

  @Input('otherDetails')
  otherDetails: any;

  @Output('modeChange')
  modeChange = new EventEmitter();

  storeMappingForm: FormGroup;
  storeList = [];
  mainStoreList = [];
  subStoreList = [];
  parkingPlaceList = [];
  vanList = [];
  createdBy: any;
  providerServiceMapID: any;

  storeMappingList = [];
  previousParkingPlace: any;
  previousVan: any;

  constructor(
    private fb: FormBuilder,
    private notificationService: ConfirmationDialogsService,
    private storeMappingService: StoreMappingService) { }

  ngOnInit() {
    this.storeMappingForm = this.createStoreMappingForm();
    if (this.otherDetails) {
      this.createdBy = this.otherDetails.createdBy;
      this.providerServiceMapID = this.otherDetails.providerServiceMapID;
    }
    this.getAllStore(this.providerServiceMapID);
    this.subscribeToStoreSelectionChange();
    this.subscribeToMainStoreChange();
    this.subscribeToSubStoreChange();
  }

  storeSubs: any;
  getAllStore(providerServiceMapID) {
    this.storeSubs = this.storeMappingService.getAllStore(providerServiceMapID).
      subscribe(response => {
        this.storeList = response.filter(item => !item.deleted);
        this.getParkingPlace(this.providerServiceMapID);
      }, (err) => {
        this.notificationService.alert(err, 'error')
        console.error("error in fetching store")
      });
  }

  parkingSubs: any;
  getParkingPlace(providerServiceMapID) {
    this.parkingSubs = this.storeMappingService.getAllParkingPlace(providerServiceMapID).
      subscribe(response => {
        this.parkingPlaceList = response.filter(item => !item.facilityID);
      }, (err) => {
        this.notificationService.alert(err, 'error')
        console.error("error in fetching parking place")
      });
  }

  vanSubs: any;
  getVan(facilityID) {
    this.vanSubs = this.storeMappingService.getAllVan(facilityID).
      subscribe(response => {
        this.vanList = response.filter(item => !item.facilityID);
        if (this.vanList.length == 0)
          this.notificationService.alert("Van is not available in this parking place");
      }, (err) => {
        this.notificationService.alert(err, 'error')
        console.error("error in fetching van")
      });
  }

  switchToViewMode() {
    this.modeChange.emit('view');
  }

  subscribeToMainStoreChange() {
    let temp = this.storeMappingForm.controls['storeMapping'] as FormGroup;
    temp.controls['facilityName'].valueChanges
      .subscribe(value => {
        if (value && value.parkingPlaceID) {
          this.subStoreList = this.storeList.filter(item => item.mainFacilityID == value.facilityID && item.isMainFacility == false && !item.vanID);
          if (this.subStoreList.length == 0)
            this.notificationService.alert("All substore mapped");
        } else if (value && this.isMainFacility == false) {
          this.notificationService.alert("No Parking Place mapped");
        }
      })
  }

  subscribeToSubStoreChange() {
    let temp = this.storeMappingForm.controls['storeMapping'] as FormGroup;
    temp.controls['subFacilityName'].valueChanges
      .subscribe(value => {
        if (value) {
          this.getVan(value.mainFacilityID);
        }
      })
  }

  subscribeToStoreSelectionChange() {
    let temp = this.storeMappingForm.controls['storeMapping'] as FormGroup;
    temp.controls['isMainFacility'].valueChanges
      .subscribe(value => {
        if (value) {
          this.mainStoreList = this.storeList.filter(item => !item.parkingPlaceID && item.isMainFacility);
        } else {
          this.mainStoreList = this.storeList.slice();
        }
        this.resetForm();
      })
  }

  resetForm(facility?: any, subFacility?: any, parkingPlace?: any, van?: any) {
    let temp = this.storeMappingForm.controls['storeMapping'] as FormGroup;
    console.log('here', facility, subFacility);
    temp.patchValue({
      facilityID: facility && facility.facilityID || null,
      facilityName: facility && facility.facilityName || null,
      subFacilityID: subFacility && subFacility.facilityID || null,
      subFacilityName: subFacility && subFacility.facilityName || null,
      parkingPlaceID: parkingPlace && parkingPlace.parkingPlaceID || null,
      parkingPlaceName: parkingPlace && parkingPlace.parkingPlaceName || null,
      vanID: van && van.vanID || null,
      vanName: van && van.vanName || null
    });
  }

  createStoreMappingForm() {
    return this.fb.group({
      service: null,
      state: null,
      storeMapping: this.fb.group({
        isMainFacility: undefined,
        facilityID: undefined,
        facilityName: undefined,
        subFacilityID: undefined,
        subFacilityName: undefined,
        parkingPlaceID: undefined,
        parkingPlaceName: undefined,
        vanID: undefined,
        vanName: undefined
      })
    })
  }

  addToStoreMappingList() {
    let temp = JSON.parse(JSON.stringify(this.storeMappingForm.value.storeMapping));

    if (temp && temp.facilityName && this.isMainFacility) {
      temp.facilityID = temp.facilityName.facilityID;
      temp.facilityName = temp.facilityName.facilityName;
    }

    if (temp && temp.subFacilityName && !this.isMainFacility) {
      temp.facilityID = temp.subFacilityName.facilityID;
      temp.facilityName = temp.subFacilityName.facilityName;
      temp.subFacilityID = undefined;
      temp.subFacilityName = undefined;
    }

    if (temp && temp.parkingPlaceName) {
      temp.parkingPlaceID = temp.parkingPlaceName.parkingPlaceID;
      temp.parkingPlaceName = temp.parkingPlaceName.parkingPlaceName;
    }

    if (temp && temp.vanName) {
      temp.vanID = temp.vanName.vanID;
      temp.vanName = temp.vanName.vanName;
    }

    if (temp) {
      let arr = this.storeMappingList.filter(item => (temp.facilityID != undefined && item.facilityID == temp.facilityID) ||
        (temp.parkingPlaceID != undefined && item.parkingPlaceID == temp.parkingPlaceID) ||
        (temp.vanID != undefined && item.vanID == temp.vanID));
      if (arr.length == 0) {
        this.storeMappingList.push(temp);
      } else {
        this.notificationService.alert("Already added");
      }
      this.storeMappingForm.controls['storeMapping'].reset();
    }
  }

  deleteFromStoreList(i) {
    this.storeMappingList.splice(i, 1);
  }

  submitStoreMapping() {
    let temp = this.storeMappingList.slice();

    temp.forEach(item => {
      item.createdBy = this.createdBy;
    })
    console.log(JSON.stringify(temp, null, 4));
    this.storeMappingService.postStoreMapping(temp)
      .subscribe((response) => {
        if (response) {
          this.notificationService.alert("Created successfully", 'success');
          this.switchToViewMode();
        }
      }, err => {
        this.notificationService.alert(err, 'error');
      })
  }

  get isMainFacility() {
    return (<FormGroup>this.storeMappingForm.controls['storeMapping']).controls['isMainFacility'].value;
  }
}
