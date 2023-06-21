/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { VanSpokeMappingService } from '../services/ProviderAdminServices/van-spoke-mapping.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-van-spoke-mapping',
  templateUrl: './van-spoke-mapping.component.html',
  styleUrls: ['./van-spoke-mapping.component.css']
})
export class VanSpokeMappingComponent implements OnInit {
  mmuVanDetailsForm: FormGroup;
  tmSpokeDetailsForm: FormGroup;
  mappingForm: FormGroup;
  userID: any;
  servicelines = [];
  states = [];
  zones = [];
  parkingPlaces = [];
  servicepoints = [];
  vantypes = [];
  tm_servicelines = [];
  tm_states = [];
  tm_zones = [];
  tm_hubs = [];
  tm_servicepoints = [];
  tm_vantypes = [];
  tm_spokes = [];
  mmu_vans = [];
  vanSpokeMappedData = [];
  listVanSpokeMapping = [];
  filteredListVanSpokeMapping = [];
  availableVans = [];
  tempVanIDArray = [];
  enabletmSpokeDetailsForm: boolean = false;
  enableMappingForm: boolean = false;
  showListOfMapping: boolean = false;
  status: any;
  basedOnVanmappingCallApi: boolean = false;
  delete: boolean = false;

  constructor(
    private _dataService: dataService,
    private vanSpokeMappingService: VanSpokeMappingService,
    private fb: FormBuilder,
    private confirmationDialog: ConfirmationDialogsService) { }

  ngOnInit() {
    this.userID = this._dataService.uid;
    this.initMmuForm();
    this.initTmForm();
    this.initMappingForm();
    this.getProviderMappedServiceline();
  }
  initMmuForm() {
    this.mmuVanDetailsForm = this.fb.group({
      mmu_serviceline: null,
      mmu_state: null,
      mmu_zone: null,
      mmu_parkingPlace: null,
      mmu_servicePoint: null,
      mmu_vantype: null
    })
  }
  initTmForm() {
    this.tmSpokeDetailsForm = this.fb.group({
      tm_serviceline: null,
      tm_state: null,
      tm_zone: null,
      tm_hub: null,
      tm_servicePoint: null,
      tm_vantype: null
    })
  }
  initMappingForm() {
    this.mappingForm = this.fb.group({
      mmu_van: null,
      tm_spoke: null
    })
  }
  getProviderMappedServiceline() {
    this.vanSpokeMappingService.getServiceLines(this.userID)
      .subscribe((serviceresponse) => {
        if (this.enabletmSpokeDetailsForm == true) {
          this.tm_servicelines = serviceresponse.filter(item => {
            if (item.serviceID == 4) {
              return item;
            }
          })
        } else {
          this.servicelines = serviceresponse.filter(item => {
            if (item.serviceID == 2) {
              return item;
            }
          })
        }
      }, err => {
        console.log(err);
      })

  }
  /*boolean Value -- differentiate mmu and tm fields for reset*/
  getProviderMappedStates(selectedServiceline, booleanValue) {
    console.log("selected", selectedServiceline)
    let obj = {
      'userID': this.userID,
      'serviceID': selectedServiceline.serviceID,
      'isNational': selectedServiceline.isNational
    }
    this.vanSpokeMappingService.getStates(obj)
      .subscribe((statesResponse) => {
        if (this.enabletmSpokeDetailsForm == true && booleanValue == true) {
          this.tm_states = statesResponse;
        } else {
          this.states = statesResponse;
        }
      }, err => {
        console.log(err);
      })

  }
  getProviderMappedZones(selectedState, booleanValue) {
    let reqObj = {
      'providerServiceMapID': selectedState.providerServiceMapID
    }
    this.vanSpokeMappingService.getZones(reqObj).subscribe((zonesResponse) => {
      if (this.enabletmSpokeDetailsForm == true && booleanValue == true) {
        this.tm_zones = zonesResponse;
      } else {
        this.zones = zonesResponse;
      }
    }, err => {
      console.log(err);
    })

  }
  getProviderMappedParkingPlace(selectedZone, selectedState, booleanValue) {
    let reqObj = {
      'zoneID': selectedZone.zoneID,
      'providerServiceMapID': selectedState.providerServiceMapID
    }
    this.vanSpokeMappingService.getParkingPlace(reqObj).subscribe((parkingPlaceResponse) => {
      if (this.enabletmSpokeDetailsForm == true && booleanValue == true) {
        this.tm_hubs = parkingPlaceResponse;
      } else {
        this.parkingPlaces = parkingPlaceResponse;
      }
    }, err => {
      console.log(err);
    })

  }
  getProviderMappedServicepoint(state, parkingplace, booleanValue) {
    let reqObj = {
      "stateID": state.stateID,
      "parkingPlaceID": parkingplace.parkingPlaceID,
      "serviceProviderID": this._dataService.service_providerID
    }
    this.vanSpokeMappingService.getServicepoints(reqObj).subscribe((servicepointResponse) => {
      if (this.enabletmSpokeDetailsForm == true && booleanValue == true) {
        this.tm_servicepoints = servicepointResponse;
      } else {
        this.servicepoints = servicepointResponse;
      }
    }, err => {
      console.log(err);
    })
  }
  getProviderMappedVanTypes(state, booleanValue) {
    let reqObj = {
      'providerServicemapID': state.providerServiceMapID
    }
    this.vanSpokeMappingService.getVanTypes(reqObj).subscribe((vantypeResponse) => {
      if (this.enabletmSpokeDetailsForm == true && booleanValue == true) {
        this.tm_vantypes = vantypeResponse;
      } else {
        this.vantypes = vantypeResponse;
      }
    }, err => {
      console.log(err);
    })

  }
  enableSpokeDetails() {
    if (this.enabletmSpokeDetailsForm) {
      this.showListOfMapping = false;
    } else {
      this.showListOfMapping = true;
    }
    this.getAllVanSpokeMappingData();
  }
  getAllVanSpokeMappingData() {
    let fetchObj = {
      "mmu_parkingplaceID": this.mmuVanDetailsForm.controls['mmu_parkingPlace'].value.parkingPlaceID,
      "mmu_servicePointId": this.mmuVanDetailsForm.controls['mmu_servicePoint'].value.servicePointID,
      "mmu_vanTypeID": this.mmuVanDetailsForm.controls['mmu_vantype'].value.vanTypeID
    }
    this.vanSpokeMappingService.getVanSpokeMapping(fetchObj).subscribe((fetchResponse) => {
      this.listVanSpokeMapping = fetchResponse.vanSpokeMappedDetails;
      this.filteredListVanSpokeMapping = fetchResponse.vanSpokeMappedDetails;
    }, err => {
      console.log(err);
    })
  }
  showForm() {
    this.showListOfMapping = false;
    this.enabletmSpokeDetailsForm = true;
    this.getProviderMappedServiceline();
  }
  getProviderMappedVansOrSpokes(state, parkingPlace, vanType, booleanValue) {
    let reqObj = {
      'providerServiceMapID': state.providerServiceMapID,
      'parkingPlaceID': parkingPlace.parkingPlaceID,
      'vanTypeID': vanType.vanTypeID
    }
    this.vanSpokeMappingService.getVansOrspoke(reqObj).subscribe((vansResponse) => {
      if (this.enabletmSpokeDetailsForm == true && booleanValue == true) {
        this.tm_spokes = vansResponse;
        this.enableMappingForm = true;
      } else {
        this.availableVans = [];
        this.mmu_vans = vansResponse;
        if (this.mmu_vans) {
          this.fetchUnmappedVans(this.mmu_vans);
        } else {
          console.log("vans are unavailable");
        }
      }
    })
  }
  fetchUnmappedVans(vanmasterData) {
    vanmasterData.forEach((filterUnmappedVans) => {
      if (!filterUnmappedVans.vanSpokeMapped) {
        this.availableVans.push(filterUnmappedVans);
      } else {
        console.log("Vans are already mapped to spoke");
      }
    })
    if (this.vanSpokeMappedData.length > 0) {
      this.vanSpokeMappedData.forEach((vanList) => {
        this.tempVanIDArray.push(vanList.mmu_VanID);
      });
    }
    let temp = [];
    this.availableVans.forEach((tempvanList) => {
      let index = this.tempVanIDArray.indexOf(tempvanList.vanID);
      if (index < 0) {
        temp.push(tempvanList);
      }
    });
    this.availableVans = temp.slice();
    this.tempVanIDArray = [];
  }
  addVanSpokeMapping(mmuData, tmData, mappingData) {
    console.log(mappingData, mmuData, tmData);
    let vanData = mappingData.mmu_van;
    vanData.forEach((van) => {
      let saveObj = {
        'mmu_StateID': mmuData.mmu_state.stateID,
        'mmu_StateName': mmuData.mmu_state.stateName,
        'mmu_ZoneID': mmuData.mmu_zone.zoneID,
        'mmu_ZoneName': mmuData.mmu_zone.zoneName,
        'mmu_parkingPlaceID': mmuData.mmu_parkingPlace.parkingPlaceID,
        'mmu_parkingPlaceName': mmuData.mmu_parkingPlace.parkingPlaceName,
        'mmu_servicePointID': mmuData.mmu_servicePoint.servicePointID,
        'mmu_servicePointName': mmuData.mmu_servicePoint.servicePointName,
        'mmu_vantypeID': mmuData.mmu_vantype.vanTypeID,
        'mmu_vantypeName': mmuData.mmu_vantype.vanTypeName,
        'tm_StateID': tmData.tm_state.stateID,
        'tm_StateName': tmData.tm_state.stateName,
        'tm_ZoneID': tmData.tm_zone.zoneID,
        'tm_ZoneName': tmData.tm_zone.zoneName,
        'tm_HubID': tmData.tm_hub.parkingPlaceID,
        'tm_HubName': tmData.tm_hub.parkingPlaceName,
        'tm_servicePointID': tmData.tm_servicePoint.servicePointID,
        'tm_servicepointname': tmData.tm_servicePoint.servicePointName,
        'tm_vanTypeID': tmData.tm_vantype.vanTypeID,
        'tm_vantypeName': tmData.tm_vantype.vanTypeName,
        'mmu_VanID': van.vanID,
        'mmu_vanName': van.vanName,
        'tm_SpokeID': mappingData.tm_spoke.vanID,
        'tm_spokeName': mappingData.tm_spoke.vanName,
        'createdBy': this._dataService.uname,
        'tm_ProviderServiceMapID': tmData.tm_state.providerServiceMapID,
        'mmu_ProviderServiceMapID': mmuData.mmu_state.providerServiceMapID
      }
      this.vanSpokeMappedData.push(saveObj);
      this.mappingForm.reset();
      this.availableVans = [];
    })
    this.fetchUnmappedVans(this.mmu_vans);
    console.log("mapped", this.vanSpokeMappedData)
  }
  saveVanSpokeMapping() {
    let vanSpokeMapping = {
      'vanSpokeMapping': this.vanSpokeMappedData
    }
    this.vanSpokeMappingService.saveMappingData(vanSpokeMapping).subscribe((saveResponse) => {
      this.confirmationDialog.alert("Saved Successfully", 'success');
      this.resetAllFormsdata();
      this.getAllVanSpokeMappingData();
    }, err => {
      console.log(err);
    })
  }
  resetAllFormsdata() {
    this.enabletmSpokeDetailsForm = false;
    this.enableMappingForm = false;
    this.showListOfMapping = true;
    this.tmSpokeDetailsForm.reset();
    this.mappingForm.reset();
    this.vanSpokeMappedData = [];
  }
  remove_vanSpokeMappedData(index) {
    this.vanSpokeMappedData.splice(index, 1);
    this.getProviderMappedVansOrSpokes(this.mmuVanDetailsForm.value.mmu_state, this.mmuVanDetailsForm.value.mmu_parkingPlace, this.mmuVanDetailsForm.value.mmu_vantype, false);
  }
  filterMappingList(searchTerm) {
    if (!searchTerm) {
      this.filteredListVanSpokeMapping = this.listVanSpokeMapping;
    } else {
      this.filteredListVanSpokeMapping = [];
      // this.listVanSpokeMapping.filter((filterVan) => )
      this.listVanSpokeMapping.forEach((item) => {
        for (let key in item) {
          if (key == 'mmu_vanName' || key == 'tm_spokeName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredListVanSpokeMapping.push(item); break;
            }
          }
        }
      });
    }
  }
  mappingStatus(mappedVanData, activeParkingPlace) {
    if (activeParkingPlace) {
      this.confirmationDialog.alert('Parking place is inactive');
    } else {
      let returnValue = this.listVanSpokeMapping.filter((filtermappedVan) => 
      mappedVanData.mmu_VanID === filtermappedVan.mmu_VanID && !filtermappedVan.deleted && mappedVanData.deleted
      );
      console.log(returnValue);
      if (returnValue.length > 0) {
        this.confirmationDialog.alert('Already van mapping exists');
      } else {
        if (mappedVanData.deleted) {
          this.status = 'Activate';
          this.delete = false;
        } else {
          this.status = 'Deactivate';
          this.delete = true;
        }

        this.confirmationDialog.confirm('Confirm', "Are you sure you want to " + this.status + "?").subscribe(response => {
          if (response) {
            let reqObj = Object.assign({}, mappedVanData, { 'deleted': this.delete })
            this.vanSpokeMappingService.updateMappingStatus({ 'vanSpokeDelete': reqObj }).subscribe((mappingStatusResponse) => {
              console.log(mappingStatusResponse, "mappingStatusResponse");
              this.confirmationDialog.alert(this.status + "d successfully", 'success');
              this.basedOnVanmappingCallApi = false;
              this.getAllVanSpokeMappingData();
              this.getProviderMappedVansOrSpokes(this.mmuVanDetailsForm.value.mmu_state, this.mmuVanDetailsForm.value.mmu_parkingPlace, this.mmuVanDetailsForm.value.mmu_vantype, false);
            }, err => {
              console.log(err);
            })
          } else {
            console.log("Can status remains same");
          }
        })
      } 
    }
  }

}