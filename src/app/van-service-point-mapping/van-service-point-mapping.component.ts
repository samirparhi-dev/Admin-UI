import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { VanServicePointMappingService } from '../services/ProviderAdminServices/van-service-point-mapping.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-van-service-point-mapping',
  templateUrl: './van-service-point-mapping.component.html'
})
export class VanServicePointMappingComponent implements OnInit {
  showTable: boolean = false;
  userID: any;
  service: any;
  state: any;
  vanTypeID: any;
  parkingPlaceObj: any;
  obj: any;
  vanObj: any = {};
  createdBy: any;
  showVanServicePointMappings: any = true;
  data: any;
  providerServiceMapID: any;
  provider_states: any;
  provider_services: any;
  service_provider_id: any;
  editable: any = false;
  countryID: any;
  district: any;
  parking_place: any;
  zoneID: any;
  talukID: any;
  parkingPlaceID: any;
  parkAndHub: any;
  vanAndSpoke: any;
  code: any;
  codeType: any;
  serviceID: any;

  filteredVanTypes: any = [];
  availableVanNames: any = [];

  formBuilder: FormBuilder = new FormBuilder();
  MappingForm: FormGroup;

  /*arrays*/
  services: any = [];
  states: any = [];
  districts: any = [];
  parkingPlaces: any = [];
  availableVanTypes: any = [];
  availableVans: any = [];
  zones: any = [];
  taluks: any = [];

  @ViewChild('searForm1') searForm1: NgForm;
  @ViewChild('searchDistrictsForm') searchDistrictsForm: NgForm;

  constructor(public providerAdminRoleService: ProviderAdminRoleService,
    public commonDataService: dataService,
    public vanServicePointMappingService: VanServicePointMappingService,
    private alertMessage: ConfirmationDialogsService) {
    this.data = [];
    this.service_provider_id = this.commonDataService.service_providerID;
    this.countryID = 1; // hardcoded as country is INDIA
    this.serviceID = this.commonDataService.serviceIDMMU;
    this.createdBy = this.commonDataService.uname;

  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.MappingForm = this.formBuilder.group({
      mappings: this.formBuilder.array([])
    });
    this.getServiceLines();
  }

  getServiceLines() {
    this.vanServicePointMappingService.getServiceLinesNew(this.userID).subscribe((response) => {
      this.getServicesSuccessHandeler(response),
        (err) => {
          console.log("ERROR in fetching serviceline", err);
          // this.alertMessage.alert(err, 'error');
        }
    });
  }
  getServicesSuccessHandeler(response) {
    this.services = response;
  }
  getStates(value) {
    this.resetArrays();
    this.zones = [];
    this.parkingPlaces = [];
    if (value.serviceID == 4) {
      this.parkAndHub = "Hub";
      this.vanAndSpoke = "Spoke";
      this.code = "Spoke Code";
      this.codeType = "Spoke Type";

    } else {
      this.parkAndHub = "Parking Place";
      this.vanAndSpoke = "Van";
      this.code = "Vehicle No.";
      this.codeType = "Van Type";
    }
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.vanServicePointMappingService.getStatesNew(obj).
      subscribe((response) => {
        this.getStatesSuccessHandeler(response),
          (err) => {
            console.log("error in fetching states", err);
          }
        //this.alertMessage.alert(err, 'error');
      });

  }

  getStatesSuccessHandeler(response) {
    this.states = response;

  }
  resetArrays() {
    this.searForm1.resetForm();
    this.taluks = [];
    this.availableVans = [];
    this.MappingForm = this.formBuilder.group({
      mappings: this.formBuilder.array([])
    });
  }
  setProviderServiceMapID(providerServiceMapID) {
    this.availableVanServicePointMappings = [];
    this.resetFieldsOnStateChange();
    this.providerServiceMapID = providerServiceMapID;
    this.getAvailableZones(this.providerServiceMapID);

  }
  getAvailableZones(providerServiceMapID) {
    this.vanServicePointMappingList = [];
    this.vanServicePointMappingService.getZones({ "providerServiceMapID": providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
  }
  getZonesSuccessHandler(response) {
    if (response != undefined) {
      for (let zone of response) {
        if (!zone.deleted) {
          this.zones.push(zone);
        }
      }
    }
  }
  getParkingPlaces(zoneID, providerServiceMapID) {
    this.resetArrays();
    let parkingPlaceObj = {
      "zoneID": zoneID,
      "providerServiceMapID": providerServiceMapID
    };
    this.vanServicePointMappingService.getParkingPlaces(parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
  }

  getParkingPlaceSuccessHandler(response) {
    this.parkingPlaces = response;
    this.reseArray();
    for (let parkingPlaces of this.parkingPlaces) {
      if (parkingPlaces.deleted) {
        const index: number = this.parkingPlaces.indexOf(parkingPlaces);
        if (index !== -1) {
          this.parkingPlaces.splice(index, 1);
        }
      }
    }
  }
  //   getDistricts(zoneID) {
  //     this.searForm1.resetForm();
  //     this.taluks = [];
  //     this.availableVans = [];
  //     this.MappingForm = this.formBuilder.group({
  //       mappings: this.formBuilder.array([])
  //     });
  //     this.vanServicePointMappingService.getDistricts(zoneID).subscribe(response => this.getDistrictsSuccessHandeler(response));

  //   }
  //   getDistrictsSuccessHandeler(response) {
  //     this.districts = response;
  //     this.availableVanServicePointMappings = [];
  //     this.reseArray();
  //   }
  //   GetTaluks(parkingPlaceID, districtID) {
  //     this.searForm1.resetForm();
  //     this.availableVans = [];
  //     let talukObj = {
  //         "parkingPlaceID": parkingPlaceID,
  //         "districtID": districtID
  //     }
  //     this.vanServicePointMappingService.getTaluks(talukObj)
  //         .subscribe(response => this.SetTaluks(response));
  // }
  // SetTaluks(response: any) {
  //     this.taluks = response;
  //     this.availableVanServicePointMappings = [];
  //     this.reseArray();
  //     this.getVanTypes();

  // }
  getVanTypes() {
    this.obj = {};
    this.obj.providerServiceMapID = this.providerServiceMapID;
    this.vanServicePointMappingService.getVanTypes(this.obj).subscribe(response => this.getVanTypesSuccessHandler(response));
  }

  getVanTypesSuccessHandler(response) {
    this.availableVanTypes = response;
    this.filteredVanTypes = [];
    this.availableVanTypes.filter((vanTypes) => {
      if (this.service.serviceName == "TM" && vanTypes.vanTypeID == 3) {
        this.filteredVanTypes.push(vanTypes);
      } else {
        if (this.service.serviceName == "MMU" && vanTypes.vanTypeID != 3)
          this.filteredVanTypes.push(vanTypes);
      }
    })
    this.availableVanServicePointMappings = [];
    this.reseArray();
  }

  getVans(providerServiceMapID, parkingPlaceID, vanTypeID) {
    this.MappingForm = this.formBuilder.group({
      mappings: this.formBuilder.array([])
    });
    this.vanObj = {};
    //this.vanObj.stateID = stateID;
    // this.vanObj.districtID = districtID;
    this.vanObj.parkingPlaceID = parkingPlaceID;
    this.vanObj.vanTypeID = vanTypeID;
    this.vanObj.providerServiceMapID = providerServiceMapID;
    this.vanServicePointMappingService.getVans(this.vanObj).subscribe(response => this.getVanSuccessHandler(response));

  }

  getVanSuccessHandler(response) {
    this.availableVans = response;
    this.vanID = undefined;
    this.reseArray();
    for (let availableVan of this.availableVans) {
      this.availableVanNames.push(availableVan.vanName);
    }
  }
  vanServicePointMappingSuccessHandler(response) {
    this.vanServicePointMappingList = [];
    this.alertMessage.alert("Mapping saved successfully", 'success');
  }

  getVanServicePointMappings(parkingPlaceID, vanID) {
    console.log("van service point mapping", parkingPlaceID, vanID);
    this.vanObj = {};
    // this.vanObj.stateID = stateID;
    // this.vanObj.districtID = districtID;
    this.vanObj.parkingPlaceID = parkingPlaceID;
    this.vanObj.vanID = vanID;
    this.vanObj.providerServiceMapID = this.providerServiceMapID;
    this.vanServicePointMappingService.getVanServicePointMappings(this.vanObj).subscribe(response => this.getVanServicePointMappingsSuccessHandler(response));
  }

  availableVanServicePointMappings: any = [];
  remainingMaps: any = [];
  reseArray() {
    let temp = this.MappingForm.controls['mappings'] as FormArray;
    temp.reset();
    temp.removeAt(0);
  }

  getVanServicePointMappingsSuccessHandler(response) {
    this.showTable = true;
    this.availableVanServicePointMappings = [];
    this.availableVanServicePointMappings = response;
    let temp = this.MappingForm.controls['mappings'] as FormArray;
    temp.reset();
    this.servicePointIDList = [];
    console.log('temp', temp);
    let tempLength = temp.length
    if (tempLength > 0) {
      for (let i = 0; i <= tempLength; i++) {
        temp.removeAt(0);
      }
    }

    let remainarray: any = [];

    for (var i = 0; i < this.availableVanServicePointMappings.length; i++) {
      if (this.availableVanServicePointMappings[i].vanID === undefined || this.availableVanServicePointMappings[i].vanID === null || this.vanID == this.availableVanServicePointMappings[i].vanID) {
        this.servicePointIDList.push(this.availableVanServicePointMappings[i].servicePointID);
        (temp).push(this.createItem(this.availableVanServicePointMappings[i]));
      } else {

        remainarray.push(this.availableVanServicePointMappings[i]);
      }
    }
    this.remainingMaps = remainarray;
    for (var i = 0; i < this.remainingMaps.length; i++) {
      if (this.servicePointIDList.indexOf(this.remainingMaps[i].servicePointID) == -1 || this.servicePointIDList.indexOf(this.remainingMaps[i].servicePointID) == null) {
        this.servicePointIDList.push(this.remainingMaps[i].servicePointID);
        (temp).push(this.createItem(this.remainingMaps[i]));
      }
    }

  }



  servicePointIDList: any = [];
  createItem(obj): FormGroup {

    let vanSession: any = "";
    let vanServicePointMapID: any;
    if (this.vanID == obj.vanID || obj.vanID == undefined) {
      vanSession = obj.vanSession;
      vanServicePointMapID = obj.vanServicePointMapID;
    }
    return this.formBuilder.group({
      vanServicePointMapID: vanServicePointMapID,
      vanID: this.vanID,
      servicePointID: obj.servicePointID,
      servicePointName: obj.servicePointName,
      districtID: obj.districtID,
      districtName: obj.districtName,
      blockID: obj.blockID,
      blockName: obj.blockName,
      vanSession: vanSession,
      providerServiceMapID: obj.providerServiceMapID,
      deleted: obj.deleted,
      isChanged: "",
      vanSession1: (vanSession == '1' || vanSession == '3'),
      vanSession2: (vanSession == '2' || vanSession == '3'),

    })

  }

  // servicePointObj: any;
  // getServicePoints(stateID, districtID, parkingPlaceID) {
  //     this.servicePointObj = {};
  //     this.servicePointObj.stateID = stateID;
  //     this.servicePointObj.districtID = districtID;
  //     this.servicePointObj.parkingPlaceID = parkingPlaceID;
  //     this.servicePointObj.serviceProviderID = this.service_provider_id;
  //     this.vanServicePointMappingService.getServicePoints(this.servicePointObj).subscribe(response => this.getServicePointSuccessHandler(response));

  // }

  // availableServicePoints: any;
  // getServicePointSuccessHandler(response) {
  //     this.availableServicePoints = response;
  // }

  vanID: any;
  selectedVan(van) {
    this.vanID = van.vanID,
      // this.district = van.districtID,
      this.parkingPlaceID = van.parkingPlaceID

  }

  vanServicePointMappingObj: any;
  vanServicePointMappingList: any = [];
  storeVanServicePointMapping() {
    console.log(this.MappingForm.value);
    let mappings = this.MappingForm.value.mappings;
    let mappingArray = <FormArray>this.MappingForm.controls.mappings;
    for (let i = 0; i < mappings.length; i++) {

      let mappingGroup = <FormGroup>(mappingArray).controls[i];

      console.log(mappingGroup.controls.vanSession1.touched);
      if ((mappingGroup.controls.vanSession1.touched || mappingGroup.controls.vanSession2.touched)) {
        this.vanServicePointMappingObj = {};
        this.vanServicePointMappingObj.vanServicePointMapID = mappings[i].vanServicePointMapID
        this.vanServicePointMappingObj.vanID = this.vanID;
        this.vanServicePointMappingObj.servicePointID = mappings[i].servicePointID;
        if (mappings[i].vanSession1) {
          this.vanServicePointMappingObj.vanSession = 1;
        }
        if (mappings[i].vanSession2) {
          this.vanServicePointMappingObj.vanSession = 2;
        }
        if (mappings[i].vanSession1 && mappings[i].vanSession2) {
          this.vanServicePointMappingObj.vanSession = 3;
        }
        this.vanServicePointMappingObj.providerServiceMapID = this.providerServiceMapID;

        this.vanServicePointMappingObj.createdBy = this.createdBy;

        this.vanServicePointMappingList.push(this.vanServicePointMappingObj);
      }
    }
    let obj = { "vanServicePointMappings": this.vanServicePointMappingList };
    this.vanServicePointMappingService.saveVanServicePointMappings(obj).subscribe(response => this.saveMappingSuccessHandler(response));
  }

  saveMappingSuccessHandler(response) {
    if (response.length > 0) {
      this.getVanServicePointMappings(this.parking_place.parkingPlaceID, this.vanID);
      this.alertMessage.alert("Mapping saved successfully", 'success');
    }
  }
  resetFieldsOnStateChange() {
    this.searchDistrictsForm.resetForm();
    this.searForm1.resetForm();
    this.zones = [];
    this.districts = [];
    this.parkingPlaces = [];
    this.taluks = [];
    this.availableVans = [];
    this.MappingForm = this.formBuilder.group({
      mappings: this.formBuilder.array([])
    });
  }
  resetFields() {
    this.searForm1.resetForm();
    this.availableVans = [];
    this.MappingForm = this.formBuilder.group({
      mappings: this.formBuilder.array([])
    });
  }
}