import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ZoneMasterService } from '../services/ProviderAdminServices/zone-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html'
})
export class ZoneComponent implements OnInit {

  filteredavailableZones: any = [];
  status: string;
  data: any;
  service: any;
  state: any;
  providerServiceMapID: any;
  provider_states: any;
  provider_services: any;
  service_provider_id: any;
  countryID: any;
  createdBy: any;
  userID: any;
  nationalFlag: any;
  zoneObj: any;
  zoneID: any;
  zoneName: any;
  zoneDesc: any;
  zoneHQAddress: any;
  districtID: any;
  talukID: any;
  branchID: any;
  editZoneValue: any;
  showTableFlag: boolean = false;
  zoneNameExist: any = false;
  editable: any = false;
  showZones: any = true;
  showListOfZones: boolean = true;
  disableSelection: boolean = false;
  bufferCount: any = 0;

  /*arrays*/
  states: any = [];
  services: any = [];
  districts: any = [];
  taluks: any = [];
  branches: any = [];
  zoneList: any = [];
  availableZoneNames: any = [];
  availableZones: any = [];


  @ViewChild('zoneForm') ZoneForm: NgForm;
  constructor(public providerAdminRoleService: ProviderAdminRoleService,
    public commonDataService: dataService,
    public zoneMasterService: ZoneMasterService,
    private alertMessage: ConfirmationDialogsService) {
    this.data = [];
    this.service_provider_id = this.commonDataService.service_providerID;
    this.countryID = 1; // hardcoded as country is INDIA
    this.createdBy = this.commonDataService.uname;
  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.getServiceLines();

  }
  getServiceLines() {
    // this.zoneMasterService.getServiceLines().subscribe(response => this.getServicesSuccessHandeler(response));
    this.zoneMasterService.getServiceLinesNew(this.userID).subscribe((response) => {
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
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.zoneMasterService.getStatesNew(obj).
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
  setProviderServiceMapID(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    this.getAvailableZones();

  }
  getAvailableZones() {
    this.zoneMasterService.getZones({ "providerServiceMapID": this.providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
  }

  getZonesSuccessHandler(response) {
    console.log("all zones", response);
    this.availableZones = response;
    this.filteredavailableZones = response;
    this.showTableFlag = true;
    for (let availableZone of this.availableZones) {
      this.availableZoneNames.push(availableZone.zoneName);
    }
  }

  showForm() {
    this.showListOfZones = false;
    this.showZones = false;
    this.disableSelection = true;
    this.showTableFlag = false;
  }
  //  Commented - for zone creation district, taluk and village fields are not required
  // getDistricts(state) {
  //   this.zoneMasterService.getDistricts(state.stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));

  // }
  // getDistrictsSuccessHandeler(response) {
  //   this.districts = response;
  //   if (this.editZoneValue != undefined) {
  //     if (this.districts) {
  //       let district = this.districts.filter((districtRes) => {
  //         if (this.editZoneValue.districtID == districtRes.districtID) {
  //           return districtRes;
  //         }
  //       })[0];
  //       if (district) {
  //         this.districtID = district;
  //         this.GetTaluks(district);
  //       }
  //     }

  //   }
  // }
  // GetTaluks(district) {
  //   this.zoneMasterService.getTaluks(district.districtID)
  //     .subscribe(response => {
  //       this.SetTaluks(response);
  //     }
  //     );
  // }
  // SetTaluks(response) {
  //   this.taluks = response;
  //   if (this.editZoneValue != undefined) {
  //     if (this.taluks) {
  //       let taluk = this.taluks.filter((talukRes) => {
  //         if (this.editZoneValue.districtBlockID == talukRes.blockID) {
  //           return talukRes;
  //         }
  //       })[0];
  //       if (taluk) {
  //         this.talukID = taluk;
  //         this.GetBranches(taluk);
  //       }
  //     }

  //   }
  // }

  // GetBranches(taluk) {
  //   this.zoneMasterService.getBranches(taluk.blockID)
  //     .subscribe(response => this.SetBranches(response));
  // }
  // SetBranches(response: any) {
  //   this.branches = response;
  //   if (this.editZoneValue != undefined) {
  //     if (this.branches) {
  //       let branch = this.branches.filter((branchRes) => {
  //         if (this.editZoneValue.districtBranchID == branchRes.districtBranchID) {
  //           return branchRes;
  //         }
  //       })[0];

  //       if (branch) {
  //         this.branchID = branch;

  //       }
  //     }

  //   }
  // }
  checkExistance(zoneName) {
    this.zoneNameExist = this.availableZoneNames.includes(zoneName);
    console.log(this.zoneNameExist);
  }
  addZoneToList(values) {
    this.zoneObj = {};
    this.zoneObj.countryID = this.countryID;
    this.zoneObj.zoneName = values.zoneName;
    this.zoneObj.zoneDesc = values.zoneDesc;
    this.zoneObj.stateID = this.state.stateID;
    this.zoneObj.stateName = this.state.stateName;

    // if (values.districtID != undefined) {
    //   this.zoneObj.districtID = values.districtID.districtID;
    //   this.zoneObj.districtName = values.districtID.districtName;
    // }
    // if (values.talukID != undefined && values.talukID != "") {
    //   this.zoneObj.districtBlockID = values.talukID.blockID;
    //   this.zoneObj.blockName = values.talukID.blockName;
    // }
    // if (values.branchID != undefined && values.branchID != "") {
    //   this.zoneObj.districtBranchID = values.branchID.districtBranchID;
    //   this.zoneObj.villageName = values.branchID.villageName;
    // }

    this.zoneObj.zoneHQAddress = values.zoneHQAddress;
    this.zoneObj.providerServiceMapID = this.providerServiceMapID;
    this.zoneObj.createdBy = this.createdBy;
    this.checkDuplicates(this.zoneObj);

  }
  checkDuplicates(zoneObj) {
    if (this.zoneList.length == 0) {
      this.zoneList.push(this.zoneObj);
      this.resetDropdowns();
    }
    else if (this.zoneList.length > 0) {
      for (let a = 0; a < this.zoneList.length; a++) {
        if (this.zoneList[a].zoneName === zoneObj.zoneName
          && this.zoneList[a].stateName === zoneObj.stateName
          && this.zoneList[a].zoneHQAddress === zoneObj.zoneHQAddress) {
          this.bufferCount = this.bufferCount + 1;
          console.log('Duplicate Combo Exists', this.bufferCount);
        }
      }
      if (this.bufferCount > 0) {
        this.alertMessage.alert("Already exists");
        this.bufferCount = 0;
        this.resetDropdowns();
      }
      else {
        this.zoneList.push(this.zoneObj);
        this.resetDropdowns();
      }
    }

  }
  resetDropdowns() {
    this.taluks = [];
    this.branches = [];
  }

  storezone() {
    let obj = { "zones": this.zoneList };
    this.zoneMasterService.saveZones(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

  successHandler(response) {
    this.zoneList = [];
    this.alertMessage.alert("Saved successfully", 'success');
    this.showList();
  }

  getServices(stateID) {
    this.providerAdminRoleService.getServices_filtered(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
  }

  remove_obj(index) {
    this.zoneList.splice(index, 1);
  }

  dataObj: any = {};
  updateZoneStatus(zone) {

    let flag = !zone.deleted;
    let status;
    if (flag === true) {
      status = "Deactivate";
      this.status = "Deactivate";
    }
    if (flag === false) {
      status = "Activate";
      this.status = "Activate";
    }

    this.alertMessage.confirm('Confirm', "Are you sure you want to " + status + "?").subscribe(response => {
      if (response) {

        this.dataObj = {};
        this.dataObj.zoneID = zone.zoneID;
        this.dataObj.deleted = !zone.deleted;
        this.dataObj.modifiedBy = this.createdBy;
        this.zoneMasterService.updateZoneStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

        zone.deleted = !zone.deleted;
      }

    });

  }
  updateStatusHandler(response) {
    console.log("Zone status changed");
    this.alertMessage.alert(this.status + "d successfully", 'success');

  }

  initializeObj() {
    this.zoneName = "";
    this.zoneDesc = "";
    this.zoneHQAddress = "";
    this.districtID = null;
    this.talukID = null;
    this.branchID = null;
  }
  editZoneData(zone) {
    this.editable = true;
    this.showZones = false;
    this.disableSelection = true;
    this.showListOfZones = false;
    this.editZoneValue = zone;
    // this.getDistricts(zone);   // commented - district, taluk and village data are not saved. 
    this.zoneID = zone.zoneID;
    this.zoneName = zone.zoneName
    this.zoneDesc = zone.zoneDesc;
    this.zoneHQAddress = zone.zoneHQAddress;

  }

  updateZoneData(zone) {
    this.dataObj = {};
    this.dataObj.zoneID = this.zoneID;
    this.dataObj.zoneName = this.zoneName;
    this.dataObj.zoneDesc = this.zoneDesc;
    this.dataObj.zoneHQAddress = this.zoneHQAddress;
    //this.dataObj.providerServiceMapID = zone.serviceID.split("-")[0];   
    this.dataObj.serviceID = this.service.serviceID;
    this.dataObj.stateID = this.state.stateID;

    // if (this.districtID != undefined) {
    //   this.dataObj.districtID = this.districtID.districtID;
    // }
    // if (this.talukID != undefined) {
    //   this.dataObj.districtBlockID = this.talukID.blockID;
    // }
    // if (this.branchID != undefined) {
    //   this.dataObj.districtBranchID = this.branchID.districtBranchID;
    // }
    this.dataObj.modifiedBy = this.createdBy;
    this.zoneMasterService.updateZoneData(this.dataObj).subscribe((response) => {
      console.log("updated response", response);
      this.updateHandler(response)
    });
  }

  updateHandler(response) {
    this.initializeObj();
    this.resetDropdowns();
    this.showList();
    this.editZoneValue = null;
    this.availableZoneNames = [];
    this.alertMessage.alert("Updated successfully", 'success');

  }

  showList() {
    this.getAvailableZones();
    this.showZones = true;
    this.editable = false;
    this.disableSelection = false;
    this.showListOfZones = true;
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredavailableZones = this.availableZones;
    } else {
      this.filteredavailableZones = [];
      this.availableZones.forEach((item) => {
        for (let key in item) {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredavailableZones.push(item); break;
          }
        }
      });
    }

  }
  back() {
    this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.ZoneForm.resetForm();
        this.zoneList = [];
        this.showList();

      }
    })
  }
}