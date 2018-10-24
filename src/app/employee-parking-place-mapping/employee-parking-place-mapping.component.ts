import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { EmployeeParkingPlaceMappingService } from '../services/ProviderAdminServices/employee-parking-place-mapping.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';

@Component({
    selector: 'app-employee-parking-place-mapping',
    templateUrl: './employee-parking-place-mapping.component.html'
})
export class EmployeeParkingPlaceMappingComponent implements OnInit {

    filteredavailableEmployeeParkingPlaceMappings: any = [];
    searchParkingPlaceID_edit: any;
    designationID_edit: any;
    editMode: boolean = false;
    userName: any;
    serviceline: any;
    userParkingPlaceMapID: any;
    formMode: boolean = false;
    tableMode: boolean = false;
    services_array: any = [];
    userID: any;
    createdBy: any;
    showEmployeeParkingPlaceMappings: any = true;
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    service_provider_id: any;
    editable: any = false;
    countryID: any;
    searchStateID: any;
    district: any;
    parking_Place: any;
    serviceID: any;
    parkAndHub: any;
    login_userID: any;

    formBuilder: FormBuilder = new FormBuilder();
    MappingForm: FormGroup;
    zoneID: any;
    talukID: any;
    zones: any = [];
    taluks: any = [];
    availableParkingPlaces: any = [];

    @ViewChild('resetform1') resetform1: NgForm;
    @ViewChild('searchForm') searchForm: NgForm;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public employeeParkingPlaceMappingService: EmployeeParkingPlaceMappingService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;
        this.login_userID = this.commonDataService.uid;

    }

    ngOnInit() {
        this.MappingForm = this.formBuilder.group({
            mappings: this.formBuilder.array([])
        });
        this.getProviderServices();
    }
    getProviderServices() {
        this.employeeParkingPlaceMappingService.getServices(this.login_userID)
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
        this.employeeParkingPlaceMappingService.getStates(this.login_userID, serviceID, false).
            subscribe(response => this.getStatesSuccessHandeler(response, false), err => {
            });
    }
    getStatesSuccessHandeler(response, isNational) {
        if (response) {
            console.log(response, 'Provider States');
            this.provider_states = response;
            this.availableEmployeeParkingPlaceMappings = [];
            this.filteredavailableEmployeeParkingPlaceMappings = [];
            // this.createButton = false;
        }
    }
    setProviderServiceMapID(providerServiceMapID) {
        this.zones = [];
        this.availableParkingPlaces = [];
        this.taluks = [];
        this.filteredavailableEmployeeParkingPlaceMappings = [];
        this.providerServiceMapID = providerServiceMapID;
        this.getAvailableZones(this.providerServiceMapID);

    }
    getAvailableZones(providerServiceMapID) {
        this.employeeParkingPlaceMappingService.getZones({ "providerServiceMapID": providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
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
    getAllParkingPlaces(zoneID, providerServiceMapID) {
        let parkingPlaceObj = {
            "zoneID": zoneID,
            "providerServiceMapID": providerServiceMapID
        };
        this.employeeParkingPlaceMappingService.getParkingPlaces(parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));

    }
    getParkingPlaceSuccessHandler(response) {
        this.availableParkingPlaces = response;
        this.availableEmployeeParkingPlaceMappings = [];
        this.filteredavailableEmployeeParkingPlaceMappings = [];
        for (let availableParkingPlaces of this.availableParkingPlaces) {
            if (availableParkingPlaces.deleted) {
                const index: number = this.availableParkingPlaces.indexOf(availableParkingPlaces);
                if (index !== -1) {
                    this.availableParkingPlaces.splice(index, 1);
                }
            }
        }
        if (this.editParkingPlaceValue != undefined) {
            let parkingPlaceUpdate = this.availableParkingPlaces.filter((parkingPlaceResponse) => {
                if (this.editParkingPlaceValue.parkingPlaceID == parkingPlaceResponse.parkingPlaceID) {
                    return parkingPlaceResponse;
                }
            })[0]
            if (parkingPlaceUpdate) {
                this.parking_Place = parkingPlaceUpdate;
            }
        }
    }
    designations: any;
    getDesignations() {
        this.employeeParkingPlaceMappingService.getDesignations().subscribe(response => this.getDesignationsSuccessHandeler(response));
    }
    getDesignationsSuccessHandeler(response) {
        this.filteredavailableEmployeeParkingPlaceMappings = [];
        this.designations = response;
        this.employeeParkingPlaceMappingList = [];
        console.log('designation', response);
    }
    showTable() {
        this.tableMode = true;
        this.formMode = false;
        this.editMode = false;

    }
    showForm() {
        this.tableMode = false;
        this.formMode = true;
        this.editMode = false;
        this.employeeParkingPlaceMappingList = [];
    }
    showEdit() {
        this.tableMode = false;
        this.formMode = false;
        this.editMode = true;
    }
    back() {
        this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.showTable();
                this.employeeParkingPlaceMappingList = [];
                this.getEmployeeParkingPlaceMappings(this.searchStateID, this.designationID.designationID);
            }
        });
    }



    employeeObj: any = {};
    getEmployeeParkingPlaceMappings(searchStateID, designationID) {
        this.userID = null;
        this.employeeObj = {};
        this.employeeObj.providerServiceMapID = searchStateID.providerServiceMapID;
        this.employeeObj.parkingPlaceID = this.parking_Place.parkingPlaceID == undefined ? this.parking_Place : this.parking_Place.parkingPlaceID;
        this.employeeObj.designationID = designationID;
        this.employeeParkingPlaceMappingService.getEmployees(this.employeeObj).subscribe(response => this.getEmployeeParkingPlaceMappingsSuccessHandler(response));
    }
    availableEmployeeParkingPlaceMappings: any = [];
    remainingMaps: any = [];
    getEmployeeParkingPlaceMappingsSuccessHandler(response) {

        this.tableMode = true;
        this.availableEmployeeParkingPlaceMappings = [];
        this.filteredavailableEmployeeParkingPlaceMappings = [];
        this.availableEmployeeParkingPlaceMappings = response;
        this.filteredavailableEmployeeParkingPlaceMappings = response;


    }
    parkingPlaceID: any;
    selectedParkingPlace(parkingPlace, providerServiceMapID, designationID) {
        this.parkingPlaceID = parkingPlace;
        this.getUsernames(providerServiceMapID, designationID);
    }

    parkingPlaceIDList: any = [];

    getUsernames(providerServiceMapID, designationID) {
        console.log('this.userID', this.userID);
        let userObj = {
            "providerServiceMapID": providerServiceMapID,
            "designationID": designationID
        }
        this.employeeParkingPlaceMappingService.getUsernames(userObj).subscribe(response => this.getuserNamesSuccessHandeler(response));
    }
    userNames: any = [];
    bufferEmployeeArray: any = [];
    getuserNamesSuccessHandeler(response) {
        this.userNames = response;
        console.log('userNames', response);
        if (!this.editable) {
            if (this.employeeParkingPlaceMappingList.length > 0) {
                this.employeeParkingPlaceMappingList.forEach((employeeParkingMap) => {
                    this.bufferEmployeeArray.push(employeeParkingMap.userID)
                });
            }
            let bufferTemp = [];
            this.userNames.forEach((username) => {
                let index = this.bufferEmployeeArray.indexOf(username.userID);
                if (index < 0) {
                    bufferTemp.push(username);
                }
            });
            this.userNames = bufferTemp.slice();
            this.bufferEmployeeArray = [];
        }

        if (this.editParkingPlaceValue != undefined) {
            let userNameUpdate = this.userNames.filter((userResponse) => {
                if (this.editParkingPlaceValue.userID == userResponse.userID && this.editParkingPlaceValue.designationID == this.designationID.designationID) {
                    return userResponse;
                }
            })[0]
            if (userNameUpdate) {
                this.userID = userNameUpdate;
                this.userNames.push(userNameUpdate);
            }
        }
    }

    deleteRow(i) {
        this.employeeParkingPlaceMappingList.splice(i, 1);
        this.getUsernames(this.searchStateID.providerServiceMapID, this.designationID.designationID);
    }

    addParkingPlaceMapping(objectToBeAdded: any, role) {
        console.log(objectToBeAdded, "FORM VALUES");
        const parkingObj = {
            'stateID': this.searchStateID.stateID,
            'stateName': this.searchStateID.stateName,
            'serviceName': this.serviceline.serviceName,
            'userID': objectToBeAdded.userID.userID,
            'userName': objectToBeAdded.userID.userName,
            'parkingPlaceID': this.parking_Place.parkingPlaceID,
            'parkingPlaceName': this.parking_Place.parkingPlaceName,
            'designationID': this.designationID.designationID,
            'designationName': this.designationID.designationName,
            'providerServiceMapID': this.searchStateID.providerServiceMapID,
            'createdBy': this.createdBy
        };
        console.log(parkingObj);
        this.employeeParkingPlaceMappingList.push(parkingObj);
        this.getUsernames(this.searchStateID.providerServiceMapID, this.designationID.designationID);
    }

    checkDBDuplicates(parkingObj) {
        let dbcount = 0;

        for (let a = 0; a < this.availableEmployeeParkingPlaceMappings.length; a++) {
            if (this.formMode) {
                if (this.availableEmployeeParkingPlaceMappings[a].providerServiceMapID === parseInt(this.searchStateID.providerServiceMapID)
                    && this.availableEmployeeParkingPlaceMappings[a].parkingPlaceID === parseInt(this.parking_Place.parkingPlaceID)
                    && this.availableEmployeeParkingPlaceMappings[a].designationID === parseInt(this.designationID.designationID)
                    && this.availableEmployeeParkingPlaceMappings[a].userID === parseInt(this.userID.userID)) {
                    dbcount = 1;
                }
            }
            else {
                if (this.availableEmployeeParkingPlaceMappings[a].providerServiceMapID === parseInt(this.searchStateID.providerServiceMapID)
                    && this.availableEmployeeParkingPlaceMappings[a].parkingPlaceID === parseInt(this.parking_Place)
                    && this.availableEmployeeParkingPlaceMappings[a].designationID === parseInt(this.designationID)
                    && this.availableEmployeeParkingPlaceMappings[a].userID === parseInt(this.userID)) {
                    dbcount = 1;
                }
            }
        }

        if (dbcount === 1)
            return false;
        else {
            dbcount = 0;
            return true;

        }
    }

    designationID: any;

    employeeID: any;
    selectedEmployee(employee) {
        this.employeeID = employee.employeeID
    }

    employeeParkingPlaceMappingObj: any;
    employeeParkingPlaceMappingList: any = [];
    saveParkingMpping() {
        let obj = { "userParkingPlaceMaps": this.employeeParkingPlaceMappingList };
        this.employeeParkingPlaceMappingService.saveEmployeeParkingPlaceMappings(obj).subscribe(response => this.saveMappingSuccessHandler(response));
    }

    saveMappingSuccessHandler(response) {
        if (response.length > 0) {
            this.alertMessage.alert(" Mapping saved successfully", 'success');
            this.getEmployeeParkingPlaceMappings(this.searchStateID, this.designationID.designationID);
            this.showTable();
        }
    }
    editParkingPlaceValue: any;
    editParkingPlace(parkingPlaceItem) {
        this.showEdit();
        this.editParkingPlaceValue = parkingPlaceItem;
        this.userParkingPlaceMapID = parkingPlaceItem.userParkingPlaceMapID
        this.providerServiceMapID = parkingPlaceItem.providerServiceMapID,
            this.parking_Place.parkingPlaceName = parkingPlaceItem.parkingPlaceName,
            this.designationID.designationName = parkingPlaceItem.designationName,
            this.getAllParkingPlaces(this.zoneID.zoneID, parkingPlaceItem.providerServiceMapID);
        let emp = { userID: parkingPlaceItem.userID, userName: parkingPlaceItem.userName };
        this.userNames = [emp];
        this.userID = emp

    }
    updateParkingPlace() {
        const parkingObj = {
            'userID': this.userID.userID,
            'parkingPlaceID': this.parking_Place.parkingPlaceID,
            'providerServiceMapID': this.searchStateID.providerServiceMapID,
            'userParkingPlaceMapID': this.userParkingPlaceMapID,
            'modifiedBy': this.createdBy
        };

        if (this.checkDBDuplicates(parkingObj)) {
            // this.employeeParkingPlaceMappingList.push(parkingObj);
            this.employeeParkingPlaceMappingService.updateEmployeeParkingPlaceMappings(parkingObj).subscribe(response => this.updateParkingPlaceSuccessHandler(response));
        }
        else {
            this.alertMessage.alert("Already Mapped");
        }
    }
    updateParkingPlaceSuccessHandler(response) {
        this.alertMessage.alert(" Mapping updated successfully", 'success');
        this.showTable();
        this.getEmployeeParkingPlaceMappings(this.searchStateID, this.designationID.designationID);
        // this.editMode = false;;

    }
    filterComponentList(searchTerm?: string) {
        if (!searchTerm) {
            this.filteredavailableEmployeeParkingPlaceMappings = this.availableEmployeeParkingPlaceMappings;
        } else {
            this.filteredavailableEmployeeParkingPlaceMappings = [];
            this.availableEmployeeParkingPlaceMappings.forEach((item) => {
                for (let key in item) {
                    if (key == 'userName') {
                        let value: string = '' + item[key];
                        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                            this.filteredavailableEmployeeParkingPlaceMappings.push(item); break;
                        }
                    }
                }
            });
        }

    }
    resetDesignation() {
        this.resetform1.controls.designationID.reset();
    }
    activate(userLangID, userexist) {
        if (userexist) {
            this.alertMessage.alert("User is inactive");
        }
        else {
            this.alertMessage.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
                if (response) {
                    const object = {
                        'userParkingPlaceMapID': userLangID,
                        'deleted': false
                    };

                    this.employeeParkingPlaceMappingService.DeleteEmpParkingMapping(object)
                        .subscribe(response => {
                            if (response.statusCode == 200) {
                                this.alertMessage.alert('Activated successfully', 'success');
                                /* refresh table */
                                this.getEmployeeParkingPlaceMappings(this.searchStateID, this.designationID.designationID);
                            }
                        },
                            err => {
                                console.log('error', err.errorMessage);
                                this.alertMessage.alert(err.errorMessage, 'error');
                            });
                }
            });
        }

    }
    deactivate(userLangID) {
        this.alertMessage.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
            if (response) {
                const object = { 'userParkingPlaceMapID': userLangID, 'deleted': true };

                this.employeeParkingPlaceMappingService.DeleteEmpParkingMapping(object)
                    .subscribe(response => {
                        if (response) {
                            this.alertMessage.alert('Deactivated successfully', 'success');
                            /* refresh table */
                            this.getEmployeeParkingPlaceMappings(this.searchStateID, this.designationID.designationID);
                        }
                    },
                        err => {
                            console.log('error', err);
                            //this.alertService.alert(err, 'error');
                        });
            }
        });

    }
}