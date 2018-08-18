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
    searchDistrictID_edit: any;
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
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableEmployeeNames: any = [];
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    searchParkingPlaceID: any;
    serviceID: any;
    formBuilder: FormBuilder = new FormBuilder();
    MappingForm: FormGroup;
    zoneID: any;
    talukID: any;
    zones: any = [];
    taluks: any = [];

    @ViewChild('resetform1') resetform1: NgForm;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public employeeParkingPlaceMappingService: EmployeeParkingPlaceMappingService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;
        this.userID = this.commonDataService.uid;

    }

    ngOnInit() {
        this.MappingForm = this.formBuilder.group({
            mappings: this.formBuilder.array([])
        });
        //this.getStates();
        // this.getStatesByServiceID();
        this.getDesignations();
        this.getProviderServices();
    }
    getProviderServices() {
        this.employeeParkingPlaceMappingService.getServices(this.userID)
            .subscribe(response => {
                this.services_array = response;
            }, err => {
            });
    }
    getStates(serviceID) {
        this.employeeParkingPlaceMappingService.getStates(this.userID, serviceID, false).
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
        this.districts = [];
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
    GetTaluks(parkingPlaceID: number) {
        this.resetDesignation();
        this.filteredavailableEmployeeParkingPlaceMappings = [];
        this.employeeParkingPlaceMappingService.getTaluks(parkingPlaceID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }
    getDesignations() {
        this.employeeParkingPlaceMappingService.getDesignations().subscribe(response => this.getDesignationsSuccessHandeler(response));
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
        this.userID = undefined;
        this.employeeParkingPlaceMappingList = [];

    }
    showEdit() {
        this.tableMode = false;
        this.formMode = false;
        this.editMode = true;
    }
    back() {
        this.showTable();
        this.employeeParkingPlaceMappingList = [];

    }

    designations: any;
    getDesignationsSuccessHandeler(response) {
        this.designations = response;
        this.employeeParkingPlaceMappingList = [];
        console.log('designation', response);
    }

    // getEmployeeParkingPlaceMappings(stateID,districtID,parkingPlaceID){
    //     this.employeeObj = {};
    //     this.employeeObj.stateID = stateID;
    //     this.employeeObj.districtID = districtID;
    //     this.employeeObj.parkingPlaceID = parkingPlaceID;
    //     //this.employeeParkingPlaceMappingService.getEmployeeParkingPlaceMappings(this.employeeObj).subscribe(response => this.getEmployeeParkingPlaceMappingsSuccessHandler(response));
    // }

    employeeObj: any = {};
    getEmployeeParkingPlaceMappings(searchStateID, districtID, designationID) {
        this.employeeObj = {};
        this.employeeObj.providerServiceMapID = searchStateID.providerServiceMapID;
        //  this.employeeObj.stateID = searchStateID.stateID;
        this.employeeObj.districtID = districtID;
        this.employeeObj.parkingPlaceID = this.searchParkingPlaceID.parkingPlaceID == undefined ? this.searchParkingPlaceID : this.searchParkingPlaceID.parkingPlaceID;
        // this.employeeObj.m_user = {};
        this.employeeObj.designationID = designationID;
        this.employeeParkingPlaceMappingService.getEmployees(this.employeeObj).subscribe(response => this.getEmployeeParkingPlaceMappingsSuccessHandler(response));

    }

    parkingPlaceID: any;
    selectedParkingPlace(parkingPlace) {
        this.parkingPlaceID = parkingPlace;
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
    parkingPlaceIDList: any = [];

    getUsernames(designationID) {
        this.employeeParkingPlaceMappingService.getUsernames(designationID, this.service_provider_id).subscribe(response => this.getuserNamesSuccessHandeler(response));
    }
    userNames: any = [];
    getuserNamesSuccessHandeler(response) {
        this.userNames = response;
        console.log('userNames', response);
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
                            if (response) {
                                this.alertMessage.alert('Activated successfully', 'success');
                                /* refresh table */
                                this.getEmployeeParkingPlaceMappings(this.searchStateID, this.searchDistrictID.districtID, this.designationID.designationID);
                            }
                        },
                            err => {
                                console.log('error', err);
                                // this.alertService.alert(err, 'error');
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
                            this.getEmployeeParkingPlaceMappings(this.searchStateID, this.searchDistrictID.districtID, this.designationID.designationID);
                        }
                    },
                        err => {
                            console.log('error', err);
                            //this.alertService.alert(err, 'error');
                        });
            }
        });

    }
    deleteRow(i) {
        this.employeeParkingPlaceMappingList.splice(i, 1);
    }

    addParkingPlaceMapping(objectToBeAdded: any, role) {
        console.log(objectToBeAdded, "FORM VALUES");
        const parkingObj = {
            'stateID': this.searchStateID.stateID,
            'stateName': this.searchStateID.stateName,
            'serviceName': this.serviceline.serviceName,
            'userID': objectToBeAdded.userID.userID,
            'userName': objectToBeAdded.userID.userName,
            'parkingPlaceID': this.searchParkingPlaceID.parkingPlaceID,
            'parkingPlaceName': this.searchParkingPlaceID.parkingPlaceName,
            'districtID': this.searchDistrictID.districtID,
            'districtName': this.searchDistrictID.districtName,
            'designationID': this.designationID.designationID,
            'designationName': this.designationID.designationName,
            'providerServiceMapID': this.searchStateID.providerServiceMapID,
            'createdBy': this.createdBy
        };
        console.log(parkingObj);
        this.checkDuplicates(parkingObj);
    }
    checkDuplicates(parkingObj) {
        let count = 0;

        if (this.employeeParkingPlaceMappingList.length == 0) {
            if (this.checkDBDuplicates(parkingObj)) {
                this.employeeParkingPlaceMappingList.push(parkingObj);
            }
            else {
                this.alertMessage.alert("Already Mapped");
            }

        }
        else {
            for (let a = 0; a < this.employeeParkingPlaceMappingList.length; a++) {
                if (this.employeeParkingPlaceMappingList[a].providerServiceMapID === parseInt(this.searchStateID.providerServiceMapID)
                    && this.employeeParkingPlaceMappingList[a].districtID === parseInt(this.searchDistrictID.districtID)
                    && this.employeeParkingPlaceMappingList[a].parkingPlaceID === parseInt(this.searchParkingPlaceID.parkingPlaceID)
                    && this.employeeParkingPlaceMappingList[a].designationID === parseInt(this.designationID.designationID)
                    && this.employeeParkingPlaceMappingList[a].userID === parseInt(this.userID.userID)) {
                    count = 1;
                }
            }
            if (count === 1) {
                this.alertMessage.alert("Already Exists");
            }
            else {

                if (this.checkDBDuplicates(parkingObj)) {
                    this.employeeParkingPlaceMappingList.push(parkingObj);
                    count = 0;
                }
                else {
                    this.alertMessage.alert("Already Mapped");
                }
            }

        }

    }
    checkDBDuplicates(parkingObj) {
        let dbcount = 0;

        for (let a = 0; a < this.availableEmployeeParkingPlaceMappings.length; a++) {
            if (this.formMode) {
                if (this.availableEmployeeParkingPlaceMappings[a].providerServiceMapID === parseInt(this.searchStateID.providerServiceMapID)
                    && this.availableEmployeeParkingPlaceMappings[a].districtID === parseInt(this.searchDistrictID.districtID)
                    && this.availableEmployeeParkingPlaceMappings[a].parkingPlaceID === parseInt(this.searchParkingPlaceID.parkingPlaceID)
                    && this.availableEmployeeParkingPlaceMappings[a].designationID === parseInt(this.designationID.designationID)
                    && this.availableEmployeeParkingPlaceMappings[a].userID === parseInt(this.userID.userID)) {
                    dbcount = 1;
                }
            }
            else {
                if (this.availableEmployeeParkingPlaceMappings[a].providerServiceMapID === parseInt(this.searchStateID.providerServiceMapID)
                    && this.availableEmployeeParkingPlaceMappings[a].districtID === parseInt(this.searchDistrictID)
                    && this.availableEmployeeParkingPlaceMappings[a].parkingPlaceID === parseInt(this.searchParkingPlaceID)
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
    districts: any = [];
    getDistricts(zoneID) {
        this.availableParkingPlaces = [];
        this.taluks = [];
        this.resetDesignation();
        this.employeeParkingPlaceMappingService.getDistricts(zoneID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        console.log(response, "districts retrieved");
        this.districts = response;
        this.availableEmployeeParkingPlaceMappings = [];
        this.filteredavailableEmployeeParkingPlaceMappings = [];
    }

    parkingPlaceObj: any;
    getParkingPlaces(stateID, districtID) {
        this.taluks = [];
        this.resetDesignation();
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.employeeParkingPlaceMappingService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
    }

    availableParkingPlaces: any;
    getParkingPlaceSuccessHandler(response) {
        this.resetform1.controls.designationID.reset();
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
    }

    employeeID: any;
    selectedEmployee(employee) {
        this.employeeID = employee.employeeID
    }

    employeeParkingPlaceMappingObj: any;
    employeeParkingPlaceMappingList: any = [];
    saveParkingMpping() {
        // console.log(this.MappingForm.value);
        // let mappings = this.MappingForm.value.mappings;
        // let mappingArray = <FormArray>this.MappingForm.controls.mappings;
        // for (let i = 0; i < mappings.length; i++) {

        //     let mappingGroup = <FormGroup>(mappingArray).controls[i];
        //     console.log(mappingGroup.controls.userMapped.touched);
        //     if ((mappingGroup.controls.userMapped.touched)) {
        //         //if(mappings[i].userMapped || mappings[i].userParkingPlaceMapID!= undefined){
        //         this.employeeParkingPlaceMappingObj = {};
        //         this.employeeParkingPlaceMappingObj.userParkingPlaceMapID = mappings[i].userParkingPlaceMapID
        //         this.employeeParkingPlaceMappingObj.userID = mappings[i].userID;
        //         this.employeeParkingPlaceMappingObj.parkingPlaceID = this.parkingPlaceID;
        //         this.employeeParkingPlaceMappingObj.stateID = mappings[i].stateID;
        //         this.employeeParkingPlaceMappingObj.districtID = mappings[i].districtID;
        //         this.employeeParkingPlaceMappingObj.providerServiceMapID = this.providerServiceMapID;

        //         this.employeeParkingPlaceMappingObj.createdBy = this.createdBy;
        //         this.employeeParkingPlaceMappingObj.deleted = !mappings[i].userMapped;
        //         this.employeeParkingPlaceMappingList.push(this.employeeParkingPlaceMappingObj);
        //     }
        // }
        let obj = { "userParkingPlaceMaps": this.employeeParkingPlaceMappingList };
        this.employeeParkingPlaceMappingService.saveEmployeeParkingPlaceMappings(obj).subscribe(response => this.saveMappingSuccessHandler(response));
    }

    saveMappingSuccessHandler(response) {
        if (response.length > 0) {
            this.alertMessage.alert(" Mapping saved successfully", 'success');
            this.getEmployeeParkingPlaceMappings(this.searchStateID, this.searchDistrictID.districtID, this.designationID.designationID);
            this.showTable();
        }
    }
    editParkingPlace(parkingPlaceItem) {
        this.showEdit();
        this.userParkingPlaceMapID = parkingPlaceItem.userParkingPlaceMapID
        this.providerServiceMapID = parkingPlaceItem.providerServiceMapID,
            this.searchDistrictID_edit = parkingPlaceItem.districtID,
            this.searchParkingPlaceID_edit = parkingPlaceItem.parkingPlaceID,
            this.designationID_edit = parkingPlaceItem.designationID,
            this.userID = parkingPlaceItem.userID
        //  this.getUsername(this.designationID.designationID);

    }
    getUsername(designationID) {

        this.employeeParkingPlaceMappingService.getUserNames(designationID, this.service_provider_id).
            subscribe(response => this.getUserNameSuccessHandeler(response), err => {
            });

    }
    getUserNameSuccessHandeler(response) {
        if (response) {
            console.log(response, 'user names based on designation');
            this.userName = response;
        }
    }

    updateParkingPlace(objectToBeAdded) {
        const parkingObj = {
            'userID': objectToBeAdded.userID,
            'parkingPlaceID': this.searchParkingPlaceID_edit,
            'districtID': this.searchDistrictID_edit,
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
        this.getEmployeeParkingPlaceMappings(this.searchStateID, this.searchDistrictID_edit, this.designationID_edit);
        // this.editMode = false;;



    }
    filterComponentList(searchTerm?: string) {
        if (!searchTerm) {
            this.filteredavailableEmployeeParkingPlaceMappings = this.availableEmployeeParkingPlaceMappings;
        } else {
            this.filteredavailableEmployeeParkingPlaceMappings = [];
            this.availableEmployeeParkingPlaceMappings.forEach((item) => {
                for (let key in item) {
                    let value: string = '' + item[key];
                    if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                        this.filteredavailableEmployeeParkingPlaceMappings.push(item); break;
                    }
                }
            });
        }

    }
    resetDesignation() {
        this.resetform1.controls.designationID.reset();
    }

}