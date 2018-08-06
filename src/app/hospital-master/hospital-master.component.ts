import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HospitalMasterService } from '../services/ProviderAdminServices/hospital-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-hospital-master',
    templateUrl: './hospital-master.component.html',
    styleUrls: ['./hospital-master.component.css']
})
export class HospitalMasterComponent implements OnInit {
    filteredsearchResultArray: any = [];
    userID: any;
    /*ngModels*/
    serviceProviderID: any;
    providerServiceMapID: any;
    state: any;
    service: any;
    district: any;
    taluk: any;

    institutionName: any;
    address: any;
    website: any;

    contact_person_name: any;
    contact_number: any;
    emailID: any;

    secondary_contact_person_name: any;
    secondary_contact_number: any;
    secondary_emailID: any;

    tertiary_contact_person_name: any;
    tertiary_contact_number: any;
    tertiary_emailID: any;

    /*arrays*/
    states: any = [];
    services: any = [];
    districts: any = [];
    taluks: any = [];

    searchResultArray: any = [];

    /*flags*/
    disabled_flag: boolean = false;
    showTableFlag: boolean = false;
    showFormFlag: boolean = false;
    disableSecFields: boolean = false;
    disableTertiaryFields: boolean = false;

    /*regEx*/
    website_expression: any = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

    email_expression = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
    name_expression: any = /^[a-zA-Z ]*$/;
    mobileNoPattern = /^[1-9][0-9]{9}/;


    @ViewChild('institutionForm1') institutionForm1: NgForm;

    constructor(public HospitalMasterService: HospitalMasterService,
        public commonDataService: dataService,
        public dialog: MdDialog,
        public alertService: ConfirmationDialogsService) {
        this.serviceProviderID = this.commonDataService.service_providerID;
    }

    ngOnInit() {
        this.userID = this.commonDataService.uid;
        this.getServices(this.userID);
    }

    getStates(serviceID, isNational) {
        this.HospitalMasterService.getStates(this.userID, serviceID, isNational)
            .subscribe(response => this.getStatesSuccessHandeler(response));

    }

    clear() {
        this.state = "";
        this.service = "";
        this.district = "";
        this.taluk = "";

        this.searchResultArray = [];
        this.filteredsearchResultArray = [];

        this.showTableFlag = false;
    }

    showForm() {
        this.disabled_flag = true;
        this.showTableFlag = false;
        this.showFormFlag = true;
        this.disableSecFields = true;
        this.disableTertiaryFields = true;
    }

    back() {
        this.disabled_flag = false;
        this.showTableFlag = true;
        this.showFormFlag = false;

        this.institutionName = "";
        this.address = "";
        this.website = "";

        this.contact_person_name = "";
        this.contact_number = "";
        this.emailID = "";

        this.secondary_contact_person_name = "";
        this.secondary_contact_number = "";
        this.secondary_emailID = "";

        this.tertiary_contact_person_name = "";
        this.tertiary_contact_number = "";
        this.tertiary_emailID = "";

    }

    getStatesSuccessHandeler(response) {
        this.state = "";
        this.district = "";
        this.taluk = "";
        this.searchResultArray = [];
        this.filteredsearchResultArray = [];
        if (response) {
            this.states = response;
        }
    }

    getServices(stateID) {
        // this.state = "";
        // this.district = "";
        // this.taluk = "";

        this.HospitalMasterService.getServices(this.userID)
            .subscribe(response => this.getServiceSuccessHandeler(response),
                (err) => {
                    console.log("Error", err);
                    // this.alertService.alert(err, 'error')
                });
    }

    getServiceSuccessHandeler(response) {
        if (response) {
            this.services = response.filter(function (item) {
                if (item.serviceID) {
                    return item;
                }
            });
            this.searchResultArray = [];
            this.filteredsearchResultArray = [];
        }
    }

    getDistrict(stateID) {

        this.district = "";
        this.taluk = "";
        this.searchResultArray = [];
        this.filteredsearchResultArray = [];

        this.HospitalMasterService.getDistricts(stateID).subscribe(response => this.getDistrictSuccessHandeler(response),
            (err) => {
                console.log("Error", err);
                //this.alertService.alert(err, 'error')
            });

    }

    getDistrictSuccessHandeler(response) {
        console.log(response, "Districts");
        if (response) {
            this.districts = response;
        }
    }

    getTaluk(districtID) {
        this.taluk = "";
        this.searchResultArray = [];
        this.filteredsearchResultArray = [];

        this.HospitalMasterService.getTaluks(districtID).subscribe(response => this.getTalukSuccessHandeler(response),
            (err) => {
                console.log("Error", err);
                // this.alertService.alert(err, 'error')
            });
    }

    getTalukSuccessHandeler(response) {
        console.log(response, "Taluk")
        if (response) {
            this.taluks = response;
        }
    }

    setProviderServiceMapID(providerServiceMapID) {
        this.district = "";
        this.taluk = "";
        this.providerServiceMapID = providerServiceMapID;
    }


    /*CRUD OPERATIONS */

    /*GET institution*/
    getInstitutions() {
        let checkTalukValue = 0;
        let request_obj :any;
        this.showTableFlag = true;
        if (this.taluk != "" && this.taluk != undefined && this.taluk != null) {
            checkTalukValue = this.taluk
            request_obj  = {
                "providerServiceMapID": this.providerServiceMapID,
                "stateID": this.state,
                "districtID": this.district,
                "blockID": checkTalukValue
            }
		} else{
            request_obj  = {
                "providerServiceMapID": this.providerServiceMapID,
                "stateID": this.state,
                "districtID": this.district
            }
        }
        
        this.HospitalMasterService.getInstitutions(request_obj).subscribe(response => this.getInstitutionSuccessHandeler(response),
            (err) => {
                console.log("Error", err);
                //this.alertService.alert(err, 'error')
            });
    }

    getInstitutionSuccessHandeler(response) {
        console.log(response, "GET HOSPITAL LIST");
        if (response) {
            this.showTableFlag = true;
            this.searchResultArray = response;
            this.filteredsearchResultArray = response;
        }
    }

    /*activate/deactivate an institution*/
    toggleActivate(institutionID, toBeDeactivatedFlag) {
        if (toBeDeactivatedFlag === true) {
            this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
                if (response) {
                    let obj = {
                        "institutionID": institutionID,
                        "deleted": toBeDeactivatedFlag
                    };

                    this.HospitalMasterService.deleteInstitution(obj).subscribe(response => this.deleteInstitutionSuccessHandeler(response, "Deactivated"),
                        (err) => {
                            console.log("Error", err);
                            // this.alertService.alert(err, 'error')
                        });
                }
            })

        }

        if (toBeDeactivatedFlag === false) {
            this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
                if (response) {
                    let obj = {
                        "institutionID": institutionID,
                        "deleted": toBeDeactivatedFlag
                    };

                    this.HospitalMasterService.deleteInstitution(obj).subscribe(response => this.deleteInstitutionSuccessHandeler(response, "Activated"),
                        (err) => {
                            console.log("Error", err);
                            //this.alertService.alert(err, 'error')
                        });
                }
            })

        }
    }

    deleteInstitutionSuccessHandeler(response, action) {
        if (response) {
            this.alertService.alert(action + " successfully", 'success');
            this.getInstitutions();
        }
    }

    /*create institution*/
    createInstitution() {
        let request_Array = [];
        let request_obj = {

            "institutionName": this.institutionName,
            "stateID": this.state,
            "districtID": this.district,
            "blockID": this.taluk,
            "address": this.address,
            "contactPerson1": this.contact_person_name,
            "contactPerson1_Email": this.emailID,
            "contactNo1": this.contact_number,
            "contactPerson2": this.secondary_contact_person_name,
            "contactPerson2_Email": this.secondary_emailID,
            "contactNo2": this.secondary_contact_number,
            "contactPerson3": this.tertiary_contact_person_name,
            "contactPerson3_Email": this.tertiary_emailID,
            "contactNo3": this.tertiary_contact_number,
            "website": this.website,
            "providerServiceMapID": this.providerServiceMapID,
            "createdBy": this.commonDataService.uname

        }

        request_Array.push(request_obj);

        this.HospitalMasterService.saveInstitution(request_Array).subscribe(response => this.saveInstitutionSuccessHandeler(response),
            (err) => {
                console.log("Error", err);
                //this.alertService.alert(err, 'error')
            });

    }

    saveInstitutionSuccessHandeler(response) {
        console.log(response, "SAVE INSTITUTION SUCCESS HANDELER");
        if (response) {
            this.alertService.alert("Saved successfully", 'success');
            this.back();
            this.getInstitutions();
        }
    }
    enableSecNumberAndEmailFields() {
        debugger;
        if (this.secondary_contact_person_name.length == 0) {
            this.disableSecFields = true;
            this.institutionForm1.controls.secondary_contact_number.reset();
            this.institutionForm1.controls.secondary_emailID.reset();
        }
        else {
            this.disableSecFields = false;
        }
    }

    enableTertiaryNumberAndEmailFields() {
        debugger;
        if (this.tertiary_contact_person_name.length == 0) {
            this.disableTertiaryFields = true;
            this.institutionForm1.controls.tertiary_contact_number.reset();
            this.institutionForm1.controls.tertiary_emailID.reset();
        }
        else {
            this.disableTertiaryFields = false;
        }
    }

    openEditModal(toBeEditedObject) {
        let dialog_Ref = this.dialog.open(EditHospitalModal, {
            height: '500px',
            width: '700px',
            disableClose: true,
            data: toBeEditedObject
        });

        dialog_Ref.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if (result === "success") {
                this.alertService.alert("Updated successfully", 'success')
                this.getInstitutions();
            }

        });
    }
    filterComponentList(searchTerm?: string) {
        if (!searchTerm) {
            this.filteredsearchResultArray = this.searchResultArray;
        } else {
            this.filteredsearchResultArray = [];
            this.searchResultArray.forEach((item) => {
                for (let key in item) {
                    let value: string = '' + item[key];
                    if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                        this.filteredsearchResultArray.push(item); break;
                    }
                }
            });
        }

    }


}

@Component({
    selector: 'edit-hospital-modal',
    templateUrl: './edit-hospital-modal.html'
})
export class EditHospitalModal {

    /*ngModels*/
    institutionName: any;
    address: any;
    website: any;

    contact_person_name: any;
    contact_number: any;
    emailID: any;

    secondary_contact_person_name: any;
    secondary_contact_number: any;
    secondary_emailID: any;

    tertiary_contact_person_name: any;
    tertiary_contact_number: any;
    tertiary_emailID: any;

    /*regEx*/
    website_expression = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    email_expression = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
    mobileNoPattern = /^[1-9][0-9]{9}/;


    constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
        public HospitalMasterService: HospitalMasterService,
        public commonDataService: dataService, public alertService: ConfirmationDialogsService,
        public dialogReff: MdDialogRef<EditHospitalModal>) { }

    ngOnInit() {
        console.log("MODAL DATA", this.data);
        this.institutionName = this.data.institutionName;
        this.address = this.data.address;
        this.website = this.data.website;

        this.contact_person_name = this.data.contactPerson1;
        this.contact_number = this.data.contactNo1;
        this.emailID = this.data.contactPerson1_Email;

        this.secondary_contact_person_name = this.data.contactPerson2;
        this.secondary_contact_number = this.data.contactNo2;
        this.secondary_emailID = this.data.contactPerson2_Email;

        this.tertiary_contact_person_name = this.data.contactPerson3;
        this.tertiary_contact_number = this.data.contactNo3;
        this.tertiary_emailID = this.data.contactPerson3_Email;
    }

    update() {
        // console.log(editedData,"editedData");
        let edit_request_obj = {
            "institutionID": this.data.institutionID,
            "institutionName": this.institutionName,
            "address": this.address,
            "contactPerson1": this.contact_person_name,
            "contactPerson1_Email": this.emailID,
            "contactNo1": this.contact_number,
            "contactPerson2": this.secondary_contact_person_name,
            "contactPerson2_Email": this.secondary_emailID,
            "contactNo2": this.secondary_contact_number,
            "contactPerson3": this.tertiary_contact_person_name,
            "contactPerson3_Email": this.tertiary_emailID,
            "contactNo3": this.tertiary_contact_number,
            "website": this.website,
            "providerServiceMapID": this.data.providerServiceMapID,
            "modifiedBy": this.commonDataService.uname
        }

        this.HospitalMasterService.editInstitution(edit_request_obj).subscribe(response => this.editInstitutionSuccessHandeler(response),
            (err) => {
                console.log("Error", err);
                // this.alertService.alert(err, 'error')
            });
    }


    editInstitutionSuccessHandeler(response) {
        console.log("edit success", response);
        if (response) {
            this.dialogReff.close("success");
        }
    }


}
