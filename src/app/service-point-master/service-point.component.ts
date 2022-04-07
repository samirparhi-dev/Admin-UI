import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { MdCheckbox, MdSelect } from '@angular/material';
@Component({
    selector: 'app-service-point',
    templateUrl: './service-point.component.html'
})
export class ServicePointComponent implements OnInit {

    areaHQAddress: any;
    districtID: any;
    servicePointID: any;
    talukID: any;
    servicePointName: string;
    servicePointDesc: string;
    serviceline: any;
    userID: any;
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    parking_Place: any;
    district: any;
    serviceID: any;
    createdBy: any;
    status: any;
    zoneID: any;
    editServicePointValue: any;
    note: string;
    parkAndHub: any;
    
    formMode: boolean = false;
    editMode: boolean = false;
    editable: any = false;
    showServicePoints: any = false;
    createButton: boolean = false;

    services_array: any = [];
    availableServicePoints: any = [];
    filteredavailableServicePoints: any = [];
    zones: any = [];
    parkingPlaces: any = [];
    availableServicePointNames: any = [];

    @ViewChild('servicePointForm1') servicePointForm1: NgForm;
    @ViewChild('servicePointForm2') servicePointForm2: NgForm;
    @ViewChild('resetform') resetform: NgForm;

    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public servicePointMasterService: ServicePointMasterService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;
        this.userID = this.commonDataService.uid;
    }

    ngOnInit() {
        this.getProviderServices();
    }
    getProviderServices() {
        this.servicePointMasterService.getServices(this.userID)
            .subscribe(response => {
                this.services_array = response;
            }, err => {
            });
    }
    getStates(serviceID) {
        if (serviceID == 4) {
            this.parkAndHub = "Hub";
          } else {
            this.parkAndHub = "Parking Place";
          }
        this.servicePointMasterService.getStates(this.userID, serviceID, false).
            subscribe(response => this.getStatesSuccessHandeler(response, false), err => {
            });
    }
    getStatesSuccessHandeler(response, isNational) {
        if (response) {
            console.log(response, 'Provider States');
            this.provider_states = response;
            this.availableServicePoints = [];
            this.filteredavailableServicePoints = [];
            this.createButton = false;
        }
    }
    setProviderServiceMapID(providerServiceMapID) {
        this.zones = [];
        // this.districts = [];
        this.parkingPlaces = [];
        this.filteredavailableServicePoints = [];
        console.log("providerServiceMapID", providerServiceMapID);
        this.providerServiceMapID = providerServiceMapID;
        this.getAvailableZones(this.providerServiceMapID);

    }
    getAvailableZones(providerServiceMapID) {
        this.servicePointMasterService.getZones({ "providerServiceMapID": providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
    }
    getZonesSuccessHandler(response) {
        this.createButton = false;
        this.parkingPlaces = [];
        // this.districts = [];
        // this.resetform.controls.district.reset();
        if (response != undefined) {
            for (let zone of response) {
                if (!zone.deleted) {
                    this.zones.push(zone);
                }
            }
        }
    }
    getAllParkingPlaces(zoneID, providerServiceMapID) {
        let parkingPlaceObj = {
            "zoneID": zoneID,
            "providerServiceMapID": providerServiceMapID
        };
        this.servicePointMasterService.getParkingPlaces(parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));

    }
    getParkingPlaceSuccessHandler(response) {
        this.parkingPlaces = response;
        this.createButton = false;
        for (let parkingPlaces of this.parkingPlaces) {
            if (parkingPlaces.deleted) {
                const index: number = this.parkingPlaces.indexOf(parkingPlaces);
                if (index !== -1) {
                    this.parkingPlaces.splice(index, 1);
                }
            }
        }
    }

    districts: any = [];
    getDistricts(zoneID) {
        this.servicePointMasterService.getDistricts(zoneID)
            .subscribe(districtResponse => this.getDistrictsSuccessHandeler(districtResponse));
    }
    getDistrictsSuccessHandeler(response) {
        console.log(response, "districts retrieved");
        this.districts = response;
        this.availableServicePoints = [];
        this.filteredavailableServicePoints = [];
        this.createButton = false;
        this.note = "* Note: District and Taluk are only for physical address purpose";
        if (this.editServicePointValue != undefined) {
            let editDistrict = this.districts.filter((districtResponse) => {
                if (this.editServicePointValue.districtID != undefined && this.editServicePointValue.districtID == districtResponse.districtID) {
                    return districtResponse;
                }
            })[0]
            if (editDistrict) {
                this.district = editDistrict;
            }
        }
    }

    getServicePoints(stateID, parkingPlaceID) {
        this.createButton = true;
        this.servicePointObj = {};
        this.servicePointObj.stateID = stateID;
        // this.servicePointObj.districtID = districtID;
        this.servicePointObj.parkingPlaceID = parkingPlaceID;
        this.servicePointObj.serviceProviderID = this.service_provider_id;
        this.servicePointMasterService.getServicePoints(this.servicePointObj).subscribe(response => this.getServicePointSuccessHandler(response));

    }

    getServicePointSuccessHandler(response) {
        this.showServicePoints = true;
        this.availableServicePoints = response;
        this.filteredavailableServicePoints = response;
        for (let availableServicePoint of this.availableServicePoints) {
            this.availableServicePointNames.push(availableServicePoint.servicePointName);
        }
    }

    showForm() {
        // this.servicePointForm.resetForm();
        this.showServicePoints = false;
        this.formMode = true;
        this.editMode = false;
        this.getDistricts(this.zoneID.zoneID);
    }
    taluks: any = [];
    GetTaluks(parkingPlaceID, districtID) {
        this.taluks = [];
        this.talukID = null;
        let talukObj = {
            "parkingPlaceID": parkingPlaceID,
            "districtID": districtID
        }
        this.servicePointMasterService.getTaluks(talukObj)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        response.filter((talukResponse) => {
            if (!talukResponse.deleted) {
                this.taluks.push(talukResponse);
            }
        });

        if (this.editServicePointValue != undefined) {
            let editTaluk = this.taluks.filter((talukResponse) => {
                if (this.editServicePointValue.districtBlockID == talukResponse.districtBlockID) {
                    return talukResponse;
                }
            })[0]
            if (editTaluk) {
                this.talukID = editTaluk;
            }
        }
    }

    // ** adding values ** //
    servicePointObj: any;
    servicePointList: any = [];
    addServicePointToList(values) {
        this.servicePointObj = {};
        this.servicePointObj.servicePointName = values.servicePointName.trim();
        this.servicePointObj.servicePointDesc = values.servicePointDesc.trim();
        this.servicePointObj.countryID = this.countryID;

        if (this.searchStateID != undefined) {
            this.servicePointObj.stateID = this.searchStateID.stateID;
            this.servicePointObj.stateName = this.searchStateID.stateName;
        }

        if (this.district != undefined) {
            this.servicePointObj.districtID = this.district.districtID;
            this.servicePointObj.districtName = this.district.districtName;
        }
        if (values.talukID != undefined) {
            this.servicePointObj.districtBlockID = values.talukID.districtBlockID;
            this.servicePointObj.districtBlockName = values.talukID.districtBlockName;
        }
        this.servicePointObj.servicePointHQAddress = values.areaHQAddress.trim();
        if (this.parking_Place != undefined) {
            this.servicePointObj.parkingPlaceID = this.parking_Place.parkingPlaceID;
            this.servicePointObj.parkingPlaceName = this.parking_Place.parkingPlaceName
        }
        this.servicePointObj.providerServiceMapID = this.searchStateID.providerServiceMapID;

        this.servicePointObj.createdBy = this.createdBy;
        this.checkDuplicates(this.servicePointObj)


    }
    //* checking duplicates in buffer */
    checkDuplicates(servicePointObj) {
        let count = 0
        if (this.servicePointList.length === 0) {
            this.servicePointList.push(this.servicePointObj);
        }
        else if (this.servicePointList.length > 0) {
            for (let i = 0; i < this.servicePointList.length; i++) {
                if (this.servicePointList[i].servicePointName === servicePointObj.servicePointName) {
                    count = count + 1;
                }
            }
            if (count === 0) {
                this.servicePointList.push(servicePointObj);
                count = 0;
            }
            else {
                this.alertMessage.alert("Already exists");
            }
        }
        console.log("servicePointList", this.servicePointList);

    }
    //* deleting rows from buffer */
    deleteRow(i) {
        this.servicePointList.splice(i, 1);
    }

    //* save method */
    storeServicePoints() {
        let obj = { "servicePoints": this.servicePointList };
        console.log(obj);
        this.servicePointMasterService.saveServicePoint(obj).subscribe(response => this.servicePointSuccessHandler(response));
    }

    servicePointSuccessHandler(response) {
        this.servicePointList = [];
        this.alertMessage.alert("Saved successfully", 'success');
        this.showList();
    }

    //* Activate and Deactivate method */
    dataObj: any = {};
    updateServicePointStatus(servicePoint) {
        let flag = !servicePoint.deleted;
        let vanString;
        if (flag === true) {
            vanString = "Deactivate";
            this.status = "Deactivate";
        }
        if (flag === false) {
            vanString = "Activate";
            this.status = "Activate";
        }


        this.alertMessage.confirm('Confirm', "Are you sure you want to " + vanString + "?").subscribe(response => {
            if (response) {
                this.dataObj = {};
                this.dataObj.servicePointID = servicePoint.servicePointID;
                this.dataObj.deleted = !servicePoint.deleted;
                this.dataObj.modifiedBy = this.createdBy;
                this.servicePointMasterService.updateServicePointStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

                servicePoint.deleted = !servicePoint.deleted;
            }
        });

    }
    updateStatusHandler(response) {
        if (this.status === "Deactivate")
            this.alertMessage.alert("Deactivated successfully", 'success');
        else
            this.alertMessage.alert("Activated successfully", 'success')
        console.log("Service Point status changed");
    }

    showList() {
        if (!this.editMode) {
            this.getServicePoints(this.searchStateID.stateID, this.parking_Place.parkingPlaceID);
            this.servicePointForm1.resetForm();
        }
        else {
            this.getServicePoints(this.searchStateID.stateID, this.parking_Place.parkingPlaceID);
            this.servicePointForm2.resetForm();
        }
        //this.servicePointForm.resetForm();
        this.showServicePoints = true;
        this.formMode = false;
        this.editMode = false;
        this.servicePointObj = [];
        this.servicePointList = [];
    }
    editservicePoint(spoint) {
        console.log("talukID", spoint);
        this.editMode = true;
        this.formMode = false;
        this.showServicePoints = false;
        this.editServicePointValue = spoint;
        this.providerServiceMapID = this.searchStateID.providerServiceMapID;
        this.servicePointID = spoint.servicePointID;
        this.servicePointName = spoint.servicePointName.trim();
        this.servicePointDesc = spoint.servicePointDesc.trim();
        this.parking_Place.parkingPlaceName = spoint.parkingPlaceName;
        this.areaHQAddress = spoint.servicePointHQAddress.trim();
        console.log("talukID", this.talukID);
        this.getDistricts(this.zoneID.zoneID);
        this.GetTaluks(spoint.parkingPlaceID, spoint.districtID);
    }
    updateServicePoints(formValues) {
        let obj = {
            "servicePointID": this.servicePointID,
            "servicePointName": formValues.servicePointName.trim(),
            "servicePointDesc": formValues.servicePointDesc.trim(),
            "providerServiceMapID": this.searchStateID.providerServiceMapID,
            "districtID": formValues.district ? formValues.district.districtID : formValues.district,
            "servicePointHQAddress": formValues.areaHQAddress.trim(),
            "districtBlockID": formValues.talukID ? formValues.talukID.districtBlockID : formValues.talukID,
            "modifiedBy": this.createdBy
        }

        this.servicePointMasterService.updateServicePoint(obj).subscribe(response => this.updateservicePointSuccessHandler(response));

    }
    updateservicePointSuccessHandler(response) {
        this.servicePointList = [];
        this.availableServicePointNames = [];
        this.editServicePointValue = null;
        this.showList();
        this.alertMessage.alert("Updated successfully", 'success');

    }

    /* db check of service name */
    servicePointNameExist: any = false;
    checkExistance(servicePointName) {
        this.servicePointNameExist = this.availableServicePointNames.includes(servicePointName);
        console.log(this.servicePointNameExist);
    }
    filterComponentList(searchTerm?: string) {
        if (!searchTerm) {
            this.filteredavailableServicePoints = this.availableServicePoints;
        } else {
            this.filteredavailableServicePoints = [];
            this.availableServicePoints.forEach((item) => {
                for (let key in item) {
                    if (key == 'districtName' || key == 'blockName' || key == 'servicePointName') {
                        let value: string = '' + item[key];
                        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                            this.filteredavailableServicePoints.push(item); break;
                        }
                    }
                }
            });
        }

    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.showList();
                this.editServicePointValue = null;
            }
        })
    }
}