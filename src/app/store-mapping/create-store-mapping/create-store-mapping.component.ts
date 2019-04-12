import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { StoreMappingService } from '../../services/inventory-services/store-mapping.service';
import { Jsonp } from '@angular/http/src/http';
import { isNullOrUndefined } from 'util';

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
  mainParkingPlaceList = [];
  parkingPlaceList = [];
  vanList = [];
  createdBy: any;
  providerServiceMapID: any;
  serviceID: any;
  parkAndHub: any;
  vanAndSpoke: any;

  storeMappingList = [];
  previousParkingPlace: any;
  previousVan: any;
  tempParkingPlaceName: any;

  constructor(
    private fb: FormBuilder,
    private notificationService: ConfirmationDialogsService,
    private storeMappingService: StoreMappingService) { }

  ngOnInit() {
    this.storeMappingForm = this.createStoreMappingForm();
    if (this.otherDetails) {
      this.createdBy = this.otherDetails.createdBy;
      this.providerServiceMapID = this.otherDetails.providerServiceMapID;
      this.serviceID = this.otherDetails.service.serviceID;
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
        console.log(response, "storelist")
        this.storeList = response.filter(item => !item.facilityDeleted);
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
        console.log(response, "Parkinglist")
        this.mainParkingPlaceList = response.filter(item => !item.deleted);
        this.parkingPlaceList = response.filter(item => !item.deleted);
      }, (err) => {
        this.notificationService.alert(err, 'error')
        console.error("error in fetching parking place")
      });
  }

  vanSubs: any;
  getVan(facilityID) {
    this.vanSubs = this.storeMappingService.getAllVan(facilityID).
      subscribe(response => {
        console.log(response, "Vanlist")
        this.vanList = response.filter(item => !item.facilityID && !item.deleted);
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
        if (this.serviceID == 4) {
          this.parkAndHub = "Hub";
          this.vanAndSpoke = "Spoke";
        } else {
          this.parkAndHub = "Parking Place";
          this.vanAndSpoke = "Van";
        }
        if (value && value.parkingPlaceID) {
          let temp = this.mainParkingPlaceList.filter(item => item.parkingPlaceID == value.parkingPlaceID);
          if (temp.length > 0)
            (<FormGroup>this.storeMappingForm.controls['storeMapping']).controls['parkingPlaceName'].setValue(temp[0]);

          this.subStoreList = this.storeList.filter(item => item.mainFacilityID == value.facilityID && item.isMainFacility == false && !item.vanID);
          if (this.subStoreList.length == 0)
            this.notificationService.alert("All substore mapped");
        } else if (value && this.isMainFacility == false) {
          this.notificationService.alert("No Parking Place mapped");
          (<FormGroup>this.storeMappingForm.controls['storeMapping']).controls['parkingPlaceName'].setValue(null);
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
          this.parkingPlaceList = this.mainParkingPlaceList.filter(item => !item.facilityID);
        } else {
          this.mainStoreList = this.storeList.filter(item => item.isMainFacility);
          this.parkingPlaceList = this.mainParkingPlaceList.slice();
        }
        this.resetForm();
      })
  }

  resetForm(facility?: any, subFacility?: any, parkingPlace?: any, van?: any) {
    let temp = this.storeMappingForm.controls['storeMapping'] as FormGroup;
    temp.controls['facilityID'].reset();
    temp.controls['facilityName'].reset();
    temp.controls['subFacilityID'].reset();
    temp.controls['subFacilityName'].reset();
    temp.controls['parkingPlaceID'].reset();
    temp.controls['parkingPlaceName'].reset();
    temp.controls['vanID'].reset();
    temp.controls['vanName'].reset();
  }

  checkValidity() {
    let temp = this.storeMappingForm.controls['storeMapping'].value;

    if (temp.isMainFacility) {
      if (temp.facilityName && temp.parkingPlaceName)
        return true;
      else
        return false;
    } else {
      if (temp.facilityName && temp.parkingPlaceName && temp.subFacilityName && temp.vanName)
        return true;
      else
        return false;
    }
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
    this.tempParkingPlaceName = undefined;
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

    if (temp && temp.parkingPlaceName && this.isMainFacility) {
      temp.parkingPlaceID = temp.parkingPlaceName.parkingPlaceID;
      temp.parkingPlaceName = temp.parkingPlaceName.parkingPlaceName;
    }

    if (temp && temp.vanName && !this.isMainFacility) {
      temp.vanID = temp.vanName.vanID;
      temp.vanName = temp.vanName.vanName;
      this.tempParkingPlaceName = temp.parkingPlaceName.parkingPlaceName;
      temp.parkingPlaceID = undefined;
      temp.parkingPlaceName = undefined;
    }

    if (temp) {
      let arr = this.storeMappingList.filter(item => (temp.facilityID != undefined && item.facilityID == temp.facilityID) ||
        (temp.parkingPlaceID != undefined && item.parkingPlaceID == temp.parkingPlaceID) ||
        (temp.vanID != undefined && item.vanID == temp.vanID));
      if (arr.length == 0) {
        if (this.tempParkingPlaceName != undefined) {
          temp.parkingPlaceName = this.tempParkingPlaceName;
        }
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
          this.notificationService.alert("Saved successfully", 'success');
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
