import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HospitalMasterService } from '../services/ProviderAdminServices/hospital-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef, MdTabHeader } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { InstituteTypeMasterService } from 'app/services/ProviderAdminServices/institute-type-master-service.service';
import { Subscription, Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-hospital-master',
    templateUrl: './hospital-master.component.html',
    styleUrls: ['./hospital-master.component.css']
})
export class HospitalMasterComponent implements OnInit {
    enableUPload:Boolean=true;
    dataString:any;
    
    value: any;
   timerSubscription: Subscription;
    refresh: boolean = true;
    status : any;
    modDate: any;
    fileRes: any;
    createdBy: any;
    fileSizeIsMoreThanRequired = true;
    error1: boolean = false;
    error2: boolean = false;
    fileContent: any;
    invalid_file_flag = false;
    inValidFileName = false;
    valid_file_extensions = ['xls', 'xlsx', 'xlsm', 'xlsb'];
    file:any;
    fileList: FileList;
    maxFileSize: number = 5.0;
    institutionType:any;
    InstitutionTypes: any=[];
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
    @ViewChild('uploadForm') uploadForm: NgForm;
    enableUPloadButton: boolean=true;
    jsonData: any;
    serviceproviderid: string;
    currentLanguageSet: any;
    
    constructor(public HospitalMasterService: HospitalMasterService,
        public _instituteTypeMasterService: InstituteTypeMasterService,
        public commonDataService: dataService,
        public dialog: MdDialog,
        public alertService: ConfirmationDialogsService) {
        this.serviceProviderID = this.commonDataService.service_providerID;
    }

    ngOnInit() {
        this.userID = this.commonDataService.uid;
        this.getServices(this.userID);
    }

   

    onFileUpload(ev) {
        this.file = undefined;
     
        this.fileList = ev.target.files;
        this.file = ev.target.files[0];

       
    
        //this.file = undefined;
        if (this.fileList.length == 0) {
        this.error1 = true;
        this.error2 = false;
        this.invalid_file_flag = false;
        this.inValidFileName = false;
        }
        else {
        if (this.file) {

            let fileNameExtension = this.file.name.split(".");
            let fileName = fileNameExtension[0];
            if(fileName !== undefined && fileName !== null && fileName !== "")
            {
            var isvalid = this.checkExtension(this.file);
            console.log(isvalid, 'VALID OR NOT');
            if (isvalid) {
        
                if ((this.fileList[0].size / 1000 / 1000) > this.maxFileSize) {
                console.log("File Size" + this.fileList[0].size / 1000 / 1000);
                this.error2 = true;
                this.error1 = false;
                this.invalid_file_flag = false;
                this.inValidFileName = false;
                }
                else {
                this.error1 = false;
                this.error2 = false;
                this.invalid_file_flag = false;
                this.inValidFileName = false;

                let workBook = null;
                this.jsonData = null;
                const reader = new FileReader();
                
                reader.onload = (event) => {
                  const data = reader.result;
                  workBook = XLSX.read(data, { type: 'binary' });
                  this.jsonData = workBook.SheetNames.reduce((initial, name) => {
                    const sheet = workBook.Sheets[name];
                    initial[name] = XLSX.utils.sheet_to_json(sheet);
                    return initial;
                  }, {});
                 // this.dataString = JSON.stringify(jsonData.Sheet1);
                 
                }
                this.enableUPloadButton=false;
                reader.readAsBinaryString(this.file);
                
                const myReader: FileReader = new FileReader();
                myReader.onloadend = this.onLoadFileCallback.bind(this)
                myReader.readAsDataURL(this.file);
                this.invalid_file_flag = false;
                }
            }
            else {
                this.invalid_file_flag = true;
                this.inValidFileName = false;
                this.error1 = false;
                this.error2 = false;
            }
            }
            else{
            //this.alertService.alert("Invalid file name", 'error');
            this.inValidFileName = true;
            this.invalid_file_flag = false;
            this.error2 = false;
            this.error1 = false;
            }
            } else {
            
            this.invalid_file_flag = false;
            }
        


          
        // const validFormat = this.checkExtension(this.file);
        // if (validFormat) {
        //   this.invalid_file_flag = false;
        // } else {
        //   this.invalid_file_flag = true;
        // }
        // if (this.file
        //   && ((this.file.size / 1024) / 1024) <= this.maxFileSize
        //   && ((this.file.size / 1024) / 1024) > 0) {
        //   const myReader: FileReader = new FileReader();
        //   myReader.onloadend = this.onLoadFileCallback.bind(this)
        //   myReader.readAsDataURL(this.file);
        // }

        // else if (this.fileList.length > 0 && this.fileList[0].size / 1024 / 1024 <= this.maxFileSize) {
        //   console.log(this.fileList[0].size / 1024 / 1024, "FILE SIZE1");
        //   this.error1 = false;
        //   this.error2 = false;
        // }
        // else if (this.fileList[0].size / 1024 / 1024 === 0) {
        //   console.log(this.fileList[0].size / 1024 / 1024, "FILE SIZE1");
        //   this.error1 = false;
        //   this.error2 = true
        // }
        // else if (this.fileList[0].size / 1024 / 1024 > this.maxFileSize) {
        //   console.log(this.fileList[0].size / 1024 / 1024, "FILE SIZE1");
        //   this.error1 = true;
        //   this.error2 = false;
        // }
    
        // if (((this.file.size / 1024) / 1024) > this.maxFileSize) {
        //   this.fileSizeIsMoreThanRequired = true;
        // } else {
        //   this.fileSizeIsMoreThanRequired = false;
        // }
      }
    }

      checkExtension(file) {
        let count = 0;
        console.log('FILE DETAILS', file);
        if (file) {
          let array_after_split = file.name.split('.');
          if(array_after_split.length == 2) {
          let file_extension = array_after_split[array_after_split.length - 1];
          for (let i = 0; i < this.valid_file_extensions.length; i++) {
            if (file_extension.toUpperCase() === this.valid_file_extensions[i].toUpperCase()) {
              count = count + 1;
            }
          }
          if (count > 0) {
            return true;
          }
          else {
            return false;
          }
        } else
        {
          return false;
        }
        }
        else {
          return true;
        }
      }
      onLoadFileCallback = (event) => {
        this.fileContent = event.currentTarget.result;
      }

      onSubmit() {
      
        console.log(this.fileList[0]);
       
        let file: File = this.fileList[0];
        // let formData:FormData = new FormData();
       /* let requestData = {
          'userID': this.userID,
          'createdBy': this.createdBy,
          'fileName': (this.file !== undefined) ? this.file.name : '',
          'fileExtension': (this.file !== undefined) ? '.' + this.file.name.split('.')[1] : '',
          'fileContent': (this.fileContent !== undefined) ? this.fileContent.split(',')[1] : ''
        };*/
        // formData.append('file', file, file.name);
        // formData.append('request', JSON.stringify(requestData));

     let requestData = {
         //'InstitutionDetails' : this.dataString,
         'InstitutionDetails' : this.jsonData.Sheet1,
         'userID': this.userID,
         'serviceProviderID': this.serviceProviderID,
         'createdBy': this.commonDataService.uname
     };
        this.HospitalMasterService.postFormData(requestData)
          .subscribe(
          (response) => {
            //this.autoRefresh(true);
            // loaderDialog.close();
            //console.log(response.json());
            //console.log(response.json().statusCode == 5000);
            //console.log(response.json().errorMessage.indexOf('The process cannot access the file because it is being used by another process') != -1);
            /*if (response.json().statusCode == 5000 && response.json().errorMessage.indexOf('The process cannot access the file because it is being used by another process') != -1) {
              this.alertService.confirm('File is used in another process.Please close and try again', 'error')
                .subscribe(() => {
                  this.uploadForm.resetForm();
                })
            }
            else */
           console.log("Response", response)
            if (response.json().statusCode == 5000 && response.json().errorMessage) {
                console.log("Hello");
                this.alertService.alertConfirm(response.json().data, 'error')
                .subscribe(() => {
                  this.uploadForm.resetForm();
                })
            }
            else {
                  this.uploadForm.resetForm();
                  this.file = undefined;
                  this.alertService.alertConfirm(response.json().data.response, 'info')
                  //this.alertService.alert("Saved Success")
                /*  if(response.json().data.response != "FileID"){
                    this.alertService.confirm(response.json().data.response, 'info')
    
                  }*/
             
            }
          },
          (error) => {
            
            // loaderDialog.close();
            console.log(error);
            this.alertService.alertConfirm('Error while uploading excel file', 'error')
              .subscribe(() => {
                this.uploadForm.resetForm();
                this.file = undefined;
              })
          }
          );
          this.enableUPloadButton=true;
      }

     /* autoRefresh(val) {
        this.refresh = val;
        if (val) {
          this.uploadStatus();
          const timer = Observable.interval(5 * 1000);
          this.timerSubscription = timer.subscribe(() => {
            this.uploadStatus();
          });
        }
        else {
          this.timerSubscription.unsubscribe();
        }
      }*/
      /*uploadStatus() {
        this.HospitalMasterService.getUploadStatus(this.providerServiceMapID).subscribe(res => {
    
          if(!res.hasOwnProperty('fileStatus')){
            if (this.timerSubscription)
            this.timerSubscription.unsubscribe();
    
            this.alertService.alert("No file uploaded");
          }
          else if(res.fileStatus.fileStatus == 'New') {
            this.value = 1;
            this.status = res.fileStatus.fileStatus;
            this.modDate = res.createdDate;
            this.fileRes = res;
          }
          else if(res.fileStatus.fileStatus == 'InProgress'){
            this.calculateValue(res);      
            this.status = res.fileStatus.fileStatus;
            this.modDate = res.createdDate;
            this.fileRes = res;
          }
          else if(res.fileStatus.fileStatus == "Completed" || res.fileStatus.fileStatus == "Failed"){
            this.timerSubscription.unsubscribe();
            this.status = res.fileStatus.fileStatus;
            this.modDate = res.createdDate;
            this.fileRes = res;
          }
        },
          (err) => {
          //     this.status =  { "fileID": "578", "fileName": "Mother Data Assam Trial One v1.xlsx", "fileStatusID": "3", "userID": "679", "validRecordCount": "21024", "erroredRecordCount": "0", "validRecordUpload": "21024", "erroredRecordUpload": "0", "isMother": true, "providerServiceMapID": "1252", "md5CheckSum": "f6e4dce6c8a94cd40816999cf4358e5d", "statusReason": "21024 valid and 0 invalid records.", "deleted": false, "createdBy": "manta", "createdDate": "2018-09-03T00:00:00.000Z", "modifiedBy": "manta", "fileStatus": { "fileStatusID": "3", "fileStatus": "Completed", "deleted": false, "createdBy": "Admin", "createdDate": "2018-09-03T00:00:00.000Z", "lastModDate": "2018-09-03T00:00:00.000Z" } };
    
            this.alertService.alert(err.status,"error");
            if (this.timerSubscription)
            this.timerSubscription.unsubscribe();
          });
      }
      calculateValue(res){
        this.value = ((parseInt(res.validRecordUpload) + parseInt(res.erroredRecordUpload))*100/(parseInt(res.validRecordCount) + parseInt(res.erroredRecordCount))).toFixed(2);
    
      }*/

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
        this.enableUPload = false;
        this.disabled_flag = true;
        this.showTableFlag = false;
        this.showFormFlag = true;
        this.disableSecFields = true;
        this.disableTertiaryFields = true;
    }

    back() {
        this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
            if (res) {
                this.enableUPload=true;
               
                this.file=undefined;
                this.enableUPloadButton=true;
                this.disabled_flag = false;
                this.showTableFlag = true;
                this.showFormFlag = false;
                this.invalid_file_flag = false;
                this.inValidFileName = false;
                this.error1 = false;
                this.error2 = false;
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
        });
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
   
   /* setProviderServiceMapID(providerServiceMapID) {
        this.district = "";
        this.taluk = "";
        this.providerServiceMapID = providerServiceMapID;
    }*/
    setProviderServiceMapID(providerServiceMapID) {
        this.district = "";
        this.taluk = "";
        this.providerServiceMapID = providerServiceMapID;
        this._instituteTypeMasterService.getInstitutesType(providerServiceMapID)
        .subscribe(response => this.instituteSuccessHandeler(response), err => {
          console.log("Error", err);
          // this.alertService.alert(err, 'error');
        })
    }
    instituteSuccessHandeler(response)
    {
        this.InstitutionTypes=response;
    }
    /*CRUD OPERATIONS */

    /*GET institution*/
    getInstitutions() {
        let checkTalukValue = 0;
        let request_obj: any;
        this.showTableFlag = true;
        if (this.taluk != "" && this.taluk != undefined && this.taluk != null) {
            checkTalukValue = this.taluk
            request_obj = {
                "providerServiceMapID": this.providerServiceMapID,
                "stateID": this.state,
                "districtID": this.district,
                "blockID": checkTalukValue
            }
        } else {
            request_obj = {
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
        let checkTalukValue: any;
        let request_Array = [];
        
        if (this.taluk != undefined || this.taluk != null) {
            checkTalukValue = this.taluk
        }
         let request_obj = {
            "institutionName": this.institutionName,
            "instituteTypeId":this.institutionType.institutionTypeID,
            "stateID": this.state,
            "districtID": this.district,
            "blockID": checkTalukValue,
            "address": (this.address !== undefined && this.address !== null) ? this.address.trim(): null,
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
            this.enableUPload=true;
            this.disabled_flag = false;
            this.showTableFlag = true;
            this.showFormFlag = false;
            this.institutionForm1.resetForm();
            this.getInstitutions();
        }
    }
    enableSecNumberAndEmailFields() {
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
                    if (key == 'institutionName' || key == 'website' || key == 'contactPerson1' || key == 'contactNo1' || key == 'contactPerson1_Email') {
                        let value: string = '' + item[key];
                        if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                            this.filteredsearchResultArray.push(item); break;
                        }
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
            "address": (this.address !== undefined && this.address !== null) ? this.address.trim(): null,
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
