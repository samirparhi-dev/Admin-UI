import { Component, OnInit } from '@angular/core';
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
    userID: any;
    service: any;
    state: any;
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
    availableVanNames: any = [];
    countryID: any;
    searchStateID: any;
    searchDistrictID: any;
    searchParkingPlaceID: any;
 
    serviceID: any;
    formBuilder: FormBuilder = new FormBuilder();
    MappingForm: FormGroup;

    /*arrays*/
    services: any = [];
    states: any = [];
    districts: any = [];
    availableParkingPlaces: any = [];    
    availableVanTypes: any = [];
    availableVans: any = [];

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
    setProviderServiceMapID(providerServiceMapID) {
        debugger;
        console.log("providerServiceMapID", providerServiceMapID);
        this.providerServiceMapID = providerServiceMapID;
        this.getDistricts(this.state);
       

    }
    getDistricts(state) {
        debugger;
        this.vanServicePointMappingService.getDistricts(state.stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));

    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
        console.log("this.districts ", this.districts );
        
       
    }

    getParkingPlaces(stateID, districtID) {
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.vanServicePointMappingService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
    }

  
    getParkingPlaceSuccessHandler(response) {
        this.availableParkingPlaces = response;
        for (let availableParkingPlaces of this.availableParkingPlaces) {
            if (availableParkingPlaces.deleted) {
                const index: number = this.availableParkingPlaces.indexOf(availableParkingPlaces);
                if (index !== -1) {
                    this.availableParkingPlaces.splice(index, 1);
                }
            }
        }
        this.getVanTypes();
    }
    
    getVanTypes() {
        this.obj = {};
        this.obj.providerServiceMapID = this.providerServiceMapID;
        this.vanServicePointMappingService.getVanTypes(this.obj).subscribe(response => this.getVanTypesSuccessHandler(response));
    }

    getVanTypesSuccessHandler(response) {
        this.availableVanTypes = response;
    }

    getVans(stateID, districtID, parkingPlaceID, vanTypeID) {
        this.vanObj = {};
        this.vanObj.stateID = stateID;
        this.vanObj.districtID = districtID;
        this.vanObj.parkingPlaceID = parkingPlaceID;
        this.vanObj.vanTypeID = vanTypeID;
        this.vanObj.serviceProviderID = this.service_provider_id;
        this.vanServicePointMappingService.getVans(this.vanObj).subscribe(response => this.getVanSuccessHandler(response));

    }
   
    getVanSuccessHandler(response) {
        this.availableVans = response;
        for (let availableVan of this.availableVans) {
            this.availableVanNames.push(availableVan.vanName);
        }
    }
    vanServicePointMappingSuccessHandler(response) {
        this.vanServicePointMappingList = [];
        this.alertMessage.alert("Mapping saved successfully", 'success');
    }

    getVanServicePointMappings(stateID, districtID, parkingPlaceID) {
        console.log("van service point mapping",stateID, districtID, parkingPlaceID );
        
        this.vanObj = {};
        this.vanObj.stateID = stateID;
        this.vanObj.districtID = districtID;
        this.vanObj.parkingPlaceID = parkingPlaceID;
        this.vanObj.serviceProviderID = this.service_provider_id;
        this.vanServicePointMappingService.getVanServicePointMappings(this.vanObj).subscribe(response => this.getVanServicePointMappingsSuccessHandler(response));
    }

    availableVanServicePointMappings: any = [];
    remainingMaps: any = [];
    getVanServicePointMappingsSuccessHandler(response) {
        this.availableVanServicePointMappings = [];
        this.availableVanServicePointMappings = response;

        this.MappingForm = this.formBuilder.group({
            mappings: this.formBuilder.array([])
        });
        this.servicePointIDList = [];

        for (var i = 0; i < this.availableVanServicePointMappings.length; i++) {

            if (this.availableVanServicePointMappings[i].vanID == undefined || this.vanID == this.availableVanServicePointMappings[i].vanID) {
                this.servicePointIDList.push(this.availableVanServicePointMappings[i].servicePointID);
                (<FormArray>this.MappingForm.get('mappings')).push(this.createItem(this.availableVanServicePointMappings[i]));
            } else {
                this.remainingMaps.push(this.availableVanServicePointMappings[i]);
            }

        }
        for (var i = 0; i < this.remainingMaps.length; i++) {
            if (this.servicePointIDList.indexOf(this.remainingMaps[i].servicePointID) == -1) {
                this.servicePointIDList.push(this.remainingMaps[i].servicePointID);
                (<FormArray>this.MappingForm.get('mappings')).push(this.createItem(this.remainingMaps[i]));
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
            vanSession: vanSession,
            providerServiceMapID: obj.providerServiceMapID,
            deleted: obj.deleted,
            isChanged: "",
            vanSession1: (vanSession == '1' || vanSession == '3'),
            vanSession2: (vanSession == '2' || vanSession == '3'),

        })

    }


    getStatesByServiceID() {
        this.vanServicePointMappingService.getStatesByServiceID(this.serviceID, this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    // getServices(stateID) {
    //     this.vanServicePointMappingService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    // }

    // getServicesSuccessHandeler(response) {
    //     this.provider_services = response;
    //     for (let provider_service of this.provider_services) {
    //         if ("MMU" == provider_service.serviceName) {
    //             this.providerServiceMapID = provider_service.providerServiceMapID;
    //         }
    //     }
    // }

    // getStatesSuccessHandeler(response) {
    //     this.provider_states = response;
    // }

 
    // getDistricts(stateID) {
    //     this.vanServicePointMappingService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    // }
    // getDistrictsSuccessHandeler(response) {
    //     console.log(response, "districts retrieved");
    //     this.districts = response;
    // }


    servicePointObj: any;
    getServicePoints(stateID, districtID, parkingPlaceID) {
        this.servicePointObj = {};
        this.servicePointObj.stateID = stateID;
        this.servicePointObj.districtID = districtID;
        this.servicePointObj.parkingPlaceID = parkingPlaceID;
        this.servicePointObj.serviceProviderID = this.service_provider_id;
        this.vanServicePointMappingService.getServicePoints(this.servicePointObj).subscribe(response => this.getServicePointSuccessHandler(response));

    }

    availableServicePoints: any;
    getServicePointSuccessHandler(response) {
        this.availableServicePoints = response;
    }

    vanID: any;
    selectedVan(van) {
        this.vanID = van.vanID
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
            this.getVanServicePointMappings(this.searchStateID, this.searchDistrictID, this.searchParkingPlaceID);
            this.alertMessage.alert("Mapping saved successfully", 'success');
        }
    }
}