import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ServicePointVillageMapService } from '../services/ProviderAdminServices/service-point-village-map.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
    selector: 'app-service-point-village-mapping',
    templateUrl: './service-point-village-mapping.component.html'
})
export class ServicePointVillageMapComponent implements OnInit {

    showServicePointVillageMaps: any = true;
    availableServicePointVillageMaps: any = [];
    data: any;
    providerServiceMapID: any;
    provider_states: any;
    provider_services: any;
    service_provider_id: any;
    editable: any = false;
    availableServicePointVillageMapNames: any = [];
    countryID: any;
    searchStateID:any;
    searchDistrictID:any;
    serviceID:any;
    createdBy:any;
    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public servicePointVillageMapService: ServicePointVillageMapService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;
    }

    showForm() {
        this.showServicePointVillageMaps = false;
        this.districts =[];
    }
    ngOnInit() {
        this.getServicePointVillageMaps(null,null,null,null);
        //this.getStates();
        this.getStatesByServiceID();
    }

    parkingPlaceObj:any;
    getParkingPlaces(stateID,districtID){
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.servicePointVillageMapService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
    }    

    availableParkingPlaces:any;
    getParkingPlaceSuccessHandler(response) {
        this.availableParkingPlaces = response;
         for(let availableParkingPlaces of this.availableParkingPlaces){
            if(availableParkingPlaces.deleted){
                const index: number = this.availableParkingPlaces.indexOf(availableParkingPlaces);
                if (index !== -1) {
                    this.availableParkingPlaces.splice(index, 1);
                }   
            }   
        }  
    }

   
    getServicePoints(stateID,districtID,parkingPlaceID){
        this.servicePointVillageMapObj = {};
        this.servicePointVillageMapObj.stateID = stateID;
        this.servicePointVillageMapObj.districtID = districtID;
        this.servicePointVillageMapObj.parkingPlaceID = parkingPlaceID;
        this.servicePointVillageMapService.getServicePoints(this.servicePointVillageMapObj).subscribe(response => this.getServicePointSuccessHandler(response));

    }


    availableServicePoints:any;
    getServicePointSuccessHandler(response) {
        this.availableServicePoints = response;
         for(let availableServicePoint of this.availableServicePoints){
            if(availableServicePoint.deleted){
                const index: number = this.availableServicePoints.indexOf(availableServicePoint);
                if (index !== -1) {
                    this.availableServicePoints.splice(index, 1);
                }      
            }
        }  
    }

    getServicePointVillageMaps(stateID,districtID,parkingPlaceID,servicePointID){
        this.servicePointVillageMapObj = {};
        this.servicePointVillageMapObj.stateID = stateID;
        this.servicePointVillageMapObj.districtID = districtID;
        this.servicePointVillageMapObj.parkingPlaceID = parkingPlaceID;
        this.servicePointVillageMapObj.servicePointID = servicePointID;
        this.servicePointVillageMapService.getServicePointVillageMaps(this.servicePointVillageMapObj).subscribe(response => this.getServicePointVillageMapSuccessHandler(response));

    }

    getServicePointVillageMapSuccessHandler(response) {
        this.availableServicePointVillageMaps = response;
        for (let availableServicePointVillageMap of this.availableServicePointVillageMaps) {
            this.availableServicePointVillageMapNames.push(availableServicePointVillageMap.servicePointName);
        }
    }

    servicePointVillageMapObj: any;
    servicePointVillageMapList: any = [];
    mappedVillageIDs:any = [];
    addServicePointVillageMapToList(values){

        let villageIds = [];
        for(let villages of values.villageIdList){
            villageIds.push(villages.split("-")[0]);
        }

        //find villages deselected from the list , and Remove village mapping with that servicepoint
        for(let mappedVillage of this.mappedVillages){
            this.mappedVillageIDs.push(mappedVillage.districtBranchID); // fetching mapped districtID's
            
            this.dataObj = {};
            this.dataObj.servicePointVillageMapID = mappedVillage.servicePointVillageMapID;
            this.dataObj.modifiedBy = this.createdBy;
            if(villageIds.indexOf(mappedVillage.districtBranchID.toString())==-1){
                this.dataObj.deleted =  true;
                this.servicePointVillageMapService.updateServicePointVillageMapStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));
            }else if(mappedVillage.deleted){
                this.dataObj.deleted =  false;
                this.servicePointVillageMapService.updateServicePointVillageMapStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));
            }
        }

        for(let villages of values.villageIdList){
            let villageId = villages.split("-")[0];
            let villageName = villages.split("-")[1];
                //   for (let provider_service of this.provider_services) {
                //     if ("MMU" == provider_service.serviceName) {
                        //make a map of zone with District, If the districtId not in the mappedDistrictIDs( already mapped districtID's)
            if(this.mappedVillageIDs.indexOf(parseInt(villageId))==-1){

                    this.servicePointVillageMapObj = {};

                    if(values.stateID!=undefined){
                        this.servicePointVillageMapObj.stateID = values.stateID.split("-")[0];
                        this.servicePointVillageMapObj.stateName = values.stateID.split("-")[1];
                    }

                    if(values.districtID!=undefined){
                        this.servicePointVillageMapObj.districtID = values.districtID.split("-")[0];
                        this.servicePointVillageMapObj.districtName = values.districtID.split("-")[1];
                    }
                    if(values.talukID!=undefined){
                        this.servicePointVillageMapObj.districtBlockID = values.talukID.split("-")[0];
                        this.servicePointVillageMapObj.blockName = values.talukID.split("-")[1];
                    }
                    if(values.parkingPlaceID!=undefined){
                        this.servicePointVillageMapObj.parkingPlaceID = values.parkingPlaceID.split("-")[0];
                        this.servicePointVillageMapObj.parkingPlaceName = values.parkingPlaceID.split("-")[1];
                    }
                    
                    if(values.servicePointID!=undefined){
                        this.servicePointVillageMapObj.servicePointID = values.servicePointID.split("-")[0];
                        this.servicePointVillageMapObj.servicePointName = values.servicePointID.split("-")[1];
                    }
                    this.servicePointVillageMapObj.districtBranchID = villageId;
                    this.servicePointVillageMapObj.villageName = villageName;
                    
                    this.servicePointVillageMapObj.providerServiceMapID = this.providerServiceMapID;
                        
                    this.servicePointVillageMapObj.createdBy = this.createdBy;

                    this.servicePointVillageMapList.push(this.servicePointVillageMapObj);
            }      
        }
        if(this.servicePointVillageMapList.length<=0){
            this.alertMessage.alert("No Service available with the state selected");
        }
    }


    storeServicePointVillageMaps(){
        let obj = { "servicePointVillageMaps": this.servicePointVillageMapList };
        console.log(obj);
        this.servicePointVillageMapService.saveServicePointVillageMaps(obj).subscribe(response => this.servicePointSuccessHandler(response));
    }

    servicePointSuccessHandler(response){
        this.servicePointVillageMapList = [];
        this.alertMessage.alert("Service Point Village Mapping stored successfully");
    }

    stateSelection(stateID) {
        this.getServices(stateID);
    }

    getServices(stateID) {
        this.servicePointVillageMapService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    }

    getStates() {
        this.servicePointVillageMapService.getStates(this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    getStatesSuccessHandeler(response) {
        this.provider_states = response;

    }

    getStatesByServiceID(){
        this.servicePointVillageMapService.getStatesByServiceID(this.serviceID,this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }
    

    districts: any = [];
    getDistricts(stateID) {
        this.servicePointVillageMapService.getDistricts(stateID).subscribe((response: Response) => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        this.districts = response;
    }
    taluks: any = [];
    GetTaluks(districtID: number) {
        this.servicePointVillageMapService.getTaluks(districtID)
            .subscribe(response => this.SetTaluks(response));
    }
    SetTaluks(response: any) {
        this.taluks = response;
    }

    branches: any = [];
    GetBranches(talukID: number) {
        this.servicePointVillageMapService.getBranches(talukID)
            .subscribe(response => this.SetBranches(response));
    }
    SetBranches(response: any) {
        this.branches = response;
    }


    getServicesSuccessHandeler(response) {
        this.provider_services = response;
        for (let provider_service of this.provider_services) {
            if ("MMU" == provider_service.serviceName) {
                this.providerServiceMapID = provider_service.providerServiceMapID;
            }
        }
        if(this.providerServiceMapID=="" || this.providerServiceMapID ==undefined){
            this.alertMessage.alert("No Service available with the state selected");
        }
    }

     dataObj: any = {};
    updateServicePointVillageMapStatus(servicePointvillageMap) {

        this.dataObj = {};
        this.dataObj.servicePointVillageMapID = servicePointvillageMap.servicePointVillageMapID;
        this.dataObj.deleted = !servicePointvillageMap.deleted;
        this.dataObj.modifiedBy = this.createdBy;
        this.servicePointVillageMapService.updateServicePointVillageMapStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

        servicePointvillageMap.deleted = !servicePointvillageMap.deleted;

    }
    updateStatusHandler(response) {
        console.log("Service Point status changed");
    }

    showList(){
        this.searchStateID ="";
        this.searchDistrictID ="";
        this.getServicePointVillageMaps(null,null,null,null);
        this.showServicePointVillageMaps=true;
    }

   mappedVillages:any = [];
    villageIdList:any = [];
    existingVillages:any = [];
    checkExistance(stateID,servicePointID){
        this.mappedVillages = [];
        this.villageIdList = [];
        this.existingVillages = [];
        //this.mappedVillages = this.districts;
        let providerServiceMapID ="";
        if(stateID!=undefined){
            providerServiceMapID = stateID.split("-")[2];
        }
        if(servicePointID!=undefined){
            servicePointID = servicePointID.split("-")[0];
        }
        
        
        for(let servicePointVillageMap of this.availableServicePointVillageMaps){
            if(servicePointVillageMap.servicePointID == servicePointID && servicePointVillageMap.providerServiceMapID == providerServiceMapID){
                // finding exsting zone mappings with districts
                this.mappedVillages.push(servicePointVillageMap);
                // this.mappedVillages.push(zoneDistrictMappings.districtID);
                if(!servicePointVillageMap.deleted){
                    this.existingVillages.push(servicePointVillageMap.districtBranchID+"-"+servicePointVillageMap.villageName);
                }  
            }
        }
        
        this.villageIdList = this.existingVillages;
    }
    
}