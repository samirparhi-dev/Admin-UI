import { Component, OnInit } from '@angular/core';
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
    searchStateID:any;
    searchDistrictID:any;
    searchParkingPlaceID:any;
    serviceID:any;
    formBuilder: FormBuilder = new FormBuilder();
	MappingForm: FormGroup;

    constructor(public providerAdminRoleService: ProviderAdminRoleService,
        public commonDataService: dataService,
        public employeeParkingPlaceMappingService: EmployeeParkingPlaceMappingService,
        private alertMessage: ConfirmationDialogsService) {
        this.data = [];
        this.service_provider_id = this.commonDataService.service_providerID;
        this.countryID = 1; // hardcoded as country is INDIA
        this.serviceID = this.commonDataService.serviceIDMMU;
        this.createdBy = this.commonDataService.uname;

    }

    ngOnInit() {
        this.MappingForm = this.formBuilder.group({
            mappings: this.formBuilder.array([])
        });
        //this.getStates();
        this.getStatesByServiceID();
        this.getDesignations();
    }

    getDesignations(){
         this.employeeParkingPlaceMappingService.getDesignations().subscribe(response => this.getDesignationsSuccessHandeler(response));
    }
    
    designations:any;
    getDesignationsSuccessHandeler(response){
        this.designations = response;
    }

    // getEmployeeParkingPlaceMappings(stateID,districtID,parkingPlaceID){
    //     this.employeeObj = {};
    //     this.employeeObj.stateID = stateID;
    //     this.employeeObj.districtID = districtID;
    //     this.employeeObj.parkingPlaceID = parkingPlaceID;
    //     //this.employeeParkingPlaceMappingService.getEmployeeParkingPlaceMappings(this.employeeObj).subscribe(response => this.getEmployeeParkingPlaceMappingsSuccessHandler(response));
    // }

    employeeObj:any = {};
    getEmployeeParkingPlaceMappings(stateID,districtID,designationID){
        this.employeeObj = {};
        this.employeeObj.serviceProviderID = this.service_provider_id;
        this.employeeObj.stateID = stateID;
        this.employeeObj.districtID = districtID;
        //this.employeeObj.parkingPlaceID = this.parkingPlaceID;
        this.employeeObj.m_user = {};
        this.employeeObj.m_user.designationID = designationID;
        this.employeeParkingPlaceMappingService.getEmployees(this.employeeObj).subscribe(response => this.getEmployeeParkingPlaceMappingsSuccessHandler(response));

    }

    parkingPlaceID:any;
    selectedParkingPlace(parkingPlace){
        this.parkingPlaceID = parkingPlace.parkingPlaceID;
    }

    
    availableEmployeeParkingPlaceMappings:any =[];
    remainingMaps:any =[];
    getEmployeeParkingPlaceMappingsSuccessHandler(response) {
        this.availableEmployeeParkingPlaceMappings = [];
        this.availableEmployeeParkingPlaceMappings = response;

        this.MappingForm = this.formBuilder.group({
            mappings: this.formBuilder.array([])
        });
        this.parkingPlaceIDList = [];
        
        for (var i = 0; i < this.availableEmployeeParkingPlaceMappings.length; i++) {
            
            if(this.availableEmployeeParkingPlaceMappings[i].parkingPlaceID == undefined || 
            (this.availableEmployeeParkingPlaceMappings[i].parkingPlaceID != undefined && this.availableEmployeeParkingPlaceMappings[i].deleted==true) ||
            (this.availableEmployeeParkingPlaceMappings[i].parkingPlaceID != undefined && this.availableEmployeeParkingPlaceMappings[i].parkingPlaceID== this.parkingPlaceID)
            ){
                    this.parkingPlaceIDList.push(this.availableEmployeeParkingPlaceMappings[i].parkingPlaceID);
                (<FormArray>this.MappingForm.get('mappings')).push(this.createItem(this.availableEmployeeParkingPlaceMappings[i]));
            }
        }

        // for(var i = 0; i < this.remainingMaps.length; i++){
        //         if(this.servicePointIDList.indexOf(this.remainingMaps[i].servicePointID)==-1 ){
        //             this.servicePointIDList.push(this.remainingMaps[i].servicePointID);
        //             (<FormArray>this.MappingForm.get('mappings')).push(this.createItem(this.remainingMaps[i]));
        //         }
        // }
  
    }
    parkingPlaceIDList:any= [];
    createItem(obj): FormGroup {

            let userParkingPlaceMapID:any;
            // if(this.parkingPlaceID == obj.parkingPlaceID || obj.parkingPlaceID == undefined){
            //     userParkingPlaceMapID = obj.userParkingPlaceMapID;
            // }
            return this.formBuilder.group({
                userParkingPlaceMapID: obj.userParkingPlaceMapID,
                parkingPlaceID: this.parkingPlaceID,
                genderName: obj.m_user.genderName,
                userID: obj.userID,
                firstName: obj.m_user.firstName,
                lastName: obj.m_user.lastName,
                userName: obj.m_user.userName,
                stateID: obj.stateID,
                districtID: obj.districtID,
                roleID: obj.m_user.m_userServiceRoleMapping.roleID,
                roleName: obj.m_user.m_userServiceRoleMapping.roleName,
                providerServiceMapID: obj.providerServiceMapID,
                emergencyContactNo: obj.m_user.emergencyContactNo,
                deleted: obj.deleted,
                designationID: obj.m_user.designationID,
                userMapped:(obj.deleted!=undefined &&  !obj.deleted)

            })
    
	}

    
    getStatesByServiceID(){
        this.employeeParkingPlaceMappingService.getStatesByServiceID(this.serviceID,this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));
    }

    getStatesSuccessHandeler(response) {
        this.provider_states = response;
    }

    getServices(stateID) {
        this.employeeParkingPlaceMappingService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
    }

    getServicesSuccessHandeler(response) {
        this.provider_services = response;
        for (let provider_service of this.provider_services) {
            if ("MMU" == provider_service.serviceName) {
                this.providerServiceMapID = provider_service.providerServiceMapID;
            }
        }
    }
    designationID:any;
    districts: any = [];
    getDistricts(stateID) {
        this.designationID ="";
        this.employeeParkingPlaceMappingService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
    }
    getDistrictsSuccessHandeler(response) {
        console.log(response, "districts retrieved");
        this.districts = response;
    }

    parkingPlaceObj:any;
    getParkingPlaces(stateID,districtID){
        this.parkingPlaceObj = {};
        this.parkingPlaceObj.stateID = stateID;
        this.parkingPlaceObj.districtID = districtID;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.parkingPlaceObj.serviceProviderID = this.service_provider_id;
        this.employeeParkingPlaceMappingService.getParkingPlaces(this.parkingPlaceObj).subscribe(response => this.getParkingPlaceSuccessHandler(response));
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

    employeeID:any;
    selectedEmployee(employee){
        this.employeeID = employee.employeeID
    }

    employeeParkingPlaceMappingObj:any;
    employeeParkingPlaceMappingList: any = [];
    storeEmployeeParkingPlaceMapping(){
        console.log(this.MappingForm.value);
        let mappings = this.MappingForm.value.mappings;
        let mappingArray = <FormArray>this.MappingForm.controls.mappings;
        for (let i = 0; i < mappings.length; i++) {

            let mappingGroup = <FormGroup>(mappingArray).controls[i];
            console.log(mappingGroup.controls.userMapped.touched);
            if((mappingGroup.controls.userMapped.touched)){
            //if(mappings[i].userMapped || mappings[i].userParkingPlaceMapID!= undefined){
                this.employeeParkingPlaceMappingObj = {};
                this.employeeParkingPlaceMappingObj.userParkingPlaceMapID = mappings[i].userParkingPlaceMapID
                this.employeeParkingPlaceMappingObj.userID = mappings[i].userID;
                this.employeeParkingPlaceMappingObj.parkingPlaceID = this.parkingPlaceID;
                this.employeeParkingPlaceMappingObj.stateID = mappings[i].stateID;
                this.employeeParkingPlaceMappingObj.districtID = mappings[i].districtID;
                this.employeeParkingPlaceMappingObj.providerServiceMapID = this.providerServiceMapID;

                this.employeeParkingPlaceMappingObj.createdBy = this.createdBy;
                this.employeeParkingPlaceMappingObj.deleted = !mappings[i].userMapped;
                this.employeeParkingPlaceMappingList.push(this.employeeParkingPlaceMappingObj);
            }
        }
      let obj = { "userParkingPlaceMaps": this.employeeParkingPlaceMappingList };
      this.employeeParkingPlaceMappingService.saveEmployeeParkingPlaceMappings(obj).subscribe(response => this.saveMappingSuccessHandler(response));  
    }

    employeeParkingPlaceMappingSuccessHandler(response){
        this.employeeParkingPlaceMappingList = [];
        this.alertMessage.alert("Employee ParkingPlace Mappings stored successfully");
    }

    saveMappingSuccessHandler(response){
        if(response.length>0){
            this.alertMessage.alert("Employee Parking Place Mapping done successfully");
            this.getEmployeeParkingPlaceMappings(this.searchStateID,this.searchDistrictID,this.designationID);
        }
    }
}