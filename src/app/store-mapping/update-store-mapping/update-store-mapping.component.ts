import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { StoreMappingService } from '../../services/inventory-services/store-mapping.service';
import { Jsonp } from '@angular/http/src/http';

@Component({
  selector: 'app-update-store-mapping',
  templateUrl: './update-store-mapping.component.html',
  styleUrls: ['./update-store-mapping.component.css']
})
export class UpdateStoreMappingComponent implements OnInit {

  @Input("storeDetails")
  storeDetails: any;

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

  previousParkingPlace: any;
  previousVan: any;

  constructor(
    private fb: FormBuilder,
    private notificationService: ConfirmationDialogsService,
    private storeMappingService: StoreMappingService) { }

  ngOnInit() {
    this.storeMappingForm = this.createStoreMappingForm();
    if (this.storeDetails) {
      debugger;
      console.log(this.storeDetails);
      this.createdBy = this.storeDetails.createdBy;
      this.providerServiceMapID = this.storeDetails.providerServiceMapID;
      this.getAllStore(this.providerServiceMapID);
    }
  }

  patchStoreDetails(storeDetails) {
    if (storeDetails.parkingPlaceID) {
      let mainStore = this.storeList.filter(item => item.facilityID == storeDetails.facilityID);
      console.log(mainStore);
      this.storeMappingForm.patchValue({
        isMainFacility: storeDetails.isMainFacility,
        facilityID: storeDetails.facilityID,
        facilityName: mainStore[0],
      })
      this.getParkingPlace(this.providerServiceMapID, storeDetails);
    }

    if (storeDetails.vanID) {
      let mainStore = this.storeList.filter(item => item.facilityID == storeDetails.mainFacilityID);
      let subStore = this.storeList.filter(item => item.facilityID == storeDetails.facilityID);
      console.log(mainStore, subStore,storeDetails);

      this.storeMappingForm.patchValue({
        isMainFacility: storeDetails.isMainFacility,
        facilityID: storeDetails.mainFacilityID,
        facilityName: mainStore[0],
        subFacilityID: storeDetails.facilityID,
        subFacilityName: subStore[0],
      })
      this.getVan(storeDetails.mainFacilityID, storeDetails);
    }

  }

  storeSubs: any;
  getAllStore(providerServiceMapID) {
    this.storeSubs = this.storeMappingService.getAllStore(providerServiceMapID).
      subscribe(response => {
        this.storeList = response.filter(item => !item.deleted);
        this.patchStoreDetails(this.storeDetails.store);
      }, (err) => {
        this.notificationService.alert(err, 'error')
      });
  }

  parkingSubs: any;
  getParkingPlace(providerServiceMapID, storeDetails) {
    this.parkingSubs = this.storeMappingService.getAllParkingPlace(providerServiceMapID).
      subscribe(response => {
        this.previousParkingPlace = storeDetails.parkingPlaceID;
        let parkingPlace = response.filter(item => item.parkingPlaceID == storeDetails.parkingPlaceID);
        this.parkingPlaceList = response.filter(item => !item.facilityID || item.parkingPlaceID == storeDetails.parkingPlaceID);
        this.storeMappingForm.patchValue({
          parkingPlaceID: parkingPlace[0].parkingPlaceID,
          parkingPlaceName: parkingPlace[0]
        })
      }, (err) => {
        this.notificationService.alert(err, 'error')
      });
  }

  vanSubs: any;
  getVan(facilityID, storeDetail) {
    this.vanSubs = this.storeMappingService.getAllVan(facilityID).
      subscribe(response => {
        this.previousVan = storeDetail.vanID;
        let van = response.filter(item => item.vanID == storeDetail.vanID);
        this.vanList = response.filter(item => !item.facilityID || item.vanID == storeDetail.vanID);
        this.storeMappingForm.patchValue({
          vanID: van[0].vanID,
          vanName: van[0]
        })
      }, (err) => {
        this.notificationService.alert(err, 'error')
      });
  }

  createStoreMappingForm() {
    return this.fb.group({
      isMainFacility: { value: undefined, disabled: true },
      facilityID: undefined,
      facilityName: { value: undefined, disabled: true },
      subFacilityID: undefined,
      subFacilityName: { value: undefined, disabled: true },
      parkingPlaceID: undefined,
      parkingPlaceName: undefined,
      vanID: undefined,
      vanName: undefined
    })
  }

  updateStoreMapping() {
    debugger;
    let temp = JSON.parse(JSON.stringify(this.storeMappingForm.value));
    console.log(temp);
    if (temp && temp.parkingPlaceID) {
      temp.facilityID = temp.facilityID;
    }
    if (temp && temp.vanID) {
      temp.facilityID = temp.subFacilityID;
    }
    if (temp && temp.parkingPlaceName) {
      temp.parkingPlaceID = temp.parkingPlaceName.parkingPlaceID;
      temp.parkingPlaceName = temp.parkingPlaceName.parkingPlaceName;
      temp.vanID = undefined;
      temp.vanName = undefined;
    }
    if (temp && temp.vanName) {
      temp.vanID = temp.vanName.vanID;
      temp.vanName = temp.vanName.vanName;
      temp.parkingPlaceID = undefined;
      temp.parkingPlaceName = undefined;
    }

    temp.modifiedBy = this.createdBy;
    temp.subFacilityID = undefined;
    temp.subFacilityName = undefined;
    temp.isMainFacility=this.storeDetails.store.isMainFacility;

    if (this.previousParkingPlace) {
      temp.oldParkingPlaceID = this.previousParkingPlace;
      temp.oldVanID = undefined;
    }

    if (this.previousVan) {
      temp.oldVanID = this.previousVan;
      temp.oldParkingPlaceID = undefined;
    }

    console.log(JSON.stringify(temp, null, 4));

    this.storeMappingService.postStoreMapping([temp])
      .subscribe((response) => {
        if (response) {
          this.notificationService.alert("Updated successfully", 'success');
          this.switchToViewMode();
        }
      }, err => {
        this.notificationService.alert(err, 'error');
        console.log(err,"Error");
      })
  }

  switchToViewMode() {
    this.modeChange.emit('view');
  }

  get isMainFacility() {
    return this.storeMappingForm.controls['isMainFacility'].value;
  }

}
