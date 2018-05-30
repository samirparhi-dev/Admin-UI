import { Component, OnInit } from '@angular/core';
import { HospitalInstituteMappingService } from '../services/ProviderAdminServices/hospital-institute-mapping-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';


@Component({
  selector: 'app-hospital-institute-directory-subdirectory-mapping',
  templateUrl: './hospital-institute-directory-subdirectory-mapping.component.html',
  styleUrls: ['./hospital-institute-directory-subdirectory-mapping.component.css']
})
export class HospitalInstituteDirectorySubdirectoryMappingComponent implements OnInit {

  /*ngModels*/
  userID: any;
  serviceProviderID: any;
  providerServiceMapID: any;

  state: any;
  service: any;
  district: any;
  taluk: any;
  hospital: any;
  institute_directory: any;
  institute_subdirectory: any;

  /*arrays*/
  states: any = [];
  services: any = [];
  districts: any = [];
  taluks: any = [];
  hospitals: any = [];
  institute_directories: any = [];
  institute_subdirectories: any = [];

  searchResultArray: any = [];
  bufferArray: any = [];

  /*flags*/
  showTableFlag = false;
  showFormFlag = false;
  disableSelection = false;



  constructor(public hospitalInstituteMappingService: HospitalInstituteMappingService,
    public commonDataService: dataService,
    public alertService: ConfirmationDialogsService) {
    this.serviceProviderID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.getServices(this.userID);
  }

  getStates(serviceID, isNational) {
    this.hospitalInstituteMappingService.getStates(this.userID, serviceID, isNational)
      .subscribe(response => this.getStatesSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });

  }

  showForm() {
    this.showTableFlag = false;
    this.showFormFlag = true;

    this.disableSelection = true;
  }

  back() {
    this.showTableFlag = true;
    this.showFormFlag = false;
    /*reset the input fields of the form*/
    this.hospital = "";
    this.bufferArray = [];

    this.disableSelection = false;
  }

  clear() {
    /*resetting the search fields*/
    this.state = "";
    this.service = "";
    this.providerServiceMapID = "";
    this.district = "";
    this.taluk = "";
    this.hospital = "";
    this.institute_directory = "";
    this.institute_subdirectory = "";

    this.states = [];
    this.districts = [];
    this.taluks = [];
    this.hospitals = [];
    this.institute_directories = [];
    this.institute_subdirectories = [];

    /*resetting the flag*/
    this.showTableFlag = false;
    /*resetting the search result array*/
    this.searchResultArray = [];
  }

  getStatesSuccessHandeler(response) {
    this.state = "";
    this.district = "";
    this.taluk = "";
    this.institute_directory = "",
      this.institute_subdirectory = "";

    this.institute_directories = [];
    this.institute_subdirectories = [];
    this.taluks = [];

    if (response) {
      this.states = response;
    }
  }

  getServices(userID) {
    this.state = "";
    this.district = "";
    this.taluk = "";
    this.institute_directory = "",
      this.institute_subdirectory = "";

    this.institute_directories = [];
    this.institute_subdirectories = [];
    this.taluks = [];

    this.hospitalInstituteMappingService.getServices(userID)
      .subscribe(response => this.getServiceSuccessHandeler(response), err => {
        console.log('error while fetching service', err);
        this.alertService.alert(err, 'error');
      });
  }

  getServiceSuccessHandeler(response) {
    if (response) {
      this.services = response;
    }
  }

  getDistrict(stateID) {
    // this.service = "";
    this.district = "";
    this.taluk = "";
    this.institute_directory = "",
      this.institute_subdirectory = "";

    this.institute_directories = [];
    this.institute_subdirectories = [];
    this.taluks = [];


    this.hospitalInstituteMappingService.getDistricts(stateID)
      .subscribe(response => this.getDistrictSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });

  }

  getDistrictSuccessHandeler(response) {
    console.log(response, "Districts");
    if (response) {
      this.districts = response;
    }
  }

  setProviderServiceMapID(providerServiceMapID) {
    this.district = "";
    this.taluk = "";
    this.institute_directory = "",
      this.institute_subdirectory = "";

    this.institute_directories = [];
    this.institute_subdirectories = [];
    this.taluks = [];

    this.providerServiceMapID = providerServiceMapID;

    this.getInstituteDirectory();
  }

  getTaluk(districtID) {
    this.taluk = "";
    this.institute_directory = "",
      this.institute_subdirectory = "";

    this.taluks = [];

    this.hospitalInstituteMappingService.getTaluks(districtID)
      .subscribe(response => this.getTalukSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });
  }

  getTalukSuccessHandeler(response) {
    console.log(response, "Taluk")
    if (response) {
      this.taluks = response;
    }
  }


  getInstitutions() {
    this.institute_directory = "",
      this.institute_subdirectory = "";
    this.institute_subdirectories = [];

    let request_obj = {
      "providerServiceMapID": this.providerServiceMapID,
      "stateID": this.state,
      "districtID": this.district,
      "blockID": this.taluk
    }

    console.log("request obj to get", request_obj);
    this.hospitalInstituteMappingService.getInstitutions(request_obj)
      .subscribe(response => this.getInstitutionSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });
  }

  getInstitutionSuccessHandeler(response) {
    console.log(response, "GET HOSPITAL LIST");
    if (response) {
      this.hospitals = response;
    }
  }

  getInstituteDirectory() {
    this.hospitalInstituteMappingService.getInstituteDirectory(this.providerServiceMapID)
      .subscribe(response => this.getInstituteDirectorySuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });
  }

  getInstituteDirectorySuccessHandeler(response) {
    this.institute_directory = '';
    if (response) {
      console.log("institute directory", response);
      this.institute_directories = response.filter(function (item) {
        if (item.deleted === false) {
          return item;
        }
      });
    }
  }

  getInstituteSubdirectory(institute_directory) {
    let data = {
      "instituteDirectoryID": institute_directory,
      "providerServiceMapId": this.providerServiceMapID
    }

    this.hospitalInstituteMappingService.getInstituteSubDirectory(data)
      .subscribe(response => this.getInstituteSubDirectorySuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });


  }

  getInstituteSubDirectorySuccessHandeler(response) {
    this.institute_subdirectory = '';
    if (response) {
      console.log("INSTITUTE SUB DIRECTORY", response);
      this.institute_subdirectories = response.filter(function (item) {
        if (item.deleted === false) {
          return item;
        }
      });
    }
  }

  getMappingHistory() {

    let reqObj = {
      "instituteDirectoryID": this.institute_directory,
      "instituteSubDirectoryID": this.institute_subdirectory,
      "blockID": this.taluk,
      "stateID": this.state,
      "districtID": this.district
    }

    if (reqObj.blockID === undefined || reqObj.blockID === null || reqObj.blockID === "") {
      this.alertService.alert("Please select taluk as well");
    }
    else {
      console.log("GET REQ OBJ FOR GETTING MAPPINGS", reqObj);
      this.hospitalInstituteMappingService.getMappingList(reqObj)
        .subscribe(response => this.mappingHistorySuccessHandeler(response), err => {
          this.alertService.alert(err, 'error');
        });
    }


  }

  mappingHistorySuccessHandeler(response) {
    console.log("HISTORY OF MAPPING", response);
    this.showTableFlag = true;
    this.searchResultArray = response;
  }

  add_obj(hospital) {
    let obj = {

      "institutionID": hospital,
      "hospital_name": this.hospital_name,
      "instituteDirectoryID": this.institute_directory,
      "instituteSubDirectoryID": this.institute_subdirectory,
      "providerServiceMapID": this.providerServiceMapID,
      "createdBy": this.commonDataService.uname
    }

    if (this.bufferArray.length == 0 && (obj.institutionID != "" && obj.institutionID != undefined)) {
      var is_unique = this.preventDuplicateMapping(obj.institutionID);

      if (is_unique) {
        this.bufferArray.push(obj);
      }
      else {
        // this.alertService.alert("Already exist");
        this.hospital = "";
      }

    }
    else {
      var is_unique = this.preventDuplicateMapping(obj.institutionID);
      if (is_unique) {
        let count = 0;
        for (let i = 0; i < this.bufferArray.length; i++) {
          if (obj.institutionID === this.bufferArray[i].institutionID) {
            count = count + 1;
          }
        }
        if (count == 0 && (obj.institutionID != "" && obj.institutionID != undefined)) {
          this.bufferArray.push(obj);
        }
        else {
          this.alertService.alert("Already exists");
        }

      }
      else {
        this.alertService.alert("Mapping for this hospital already exists");
        this.hospital = "";
      }

    }
    /*resetting fields after entering in buffer array/or if duplicate exist*/
     this.hospital = "";

  }

  preventDuplicateMapping(hospital_id) {
    if (this.searchResultArray.length === 0) {

      return true;
    }
    else {
      var count = 0;
      for (let i = 0; i < this.searchResultArray.length; i++) {
        if (this.searchResultArray[i].institute.institutionID === parseInt(hospital_id)) {

          count = count + 1;
        }

      }
      if (count > 0) {
        this.alertService.alert("Already exists");
        return false;
      }
      else {
        return true;
      }
    }

  }

  removeObj(index) {
    this.bufferArray.splice(index, 1);
  }


  hospital_name: any;
  setHospitalName(hospital_name) {
    this.hospital_name = hospital_name;
  }

  save() {
    console.log("buffer array", this.bufferArray);
    this.hospitalInstituteMappingService.createMapping(this.bufferArray)
      .subscribe(response => this.saveSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });
  }

  saveSuccessHandeler(response) {
    console.log("response", response);
    if (response) {
      this.alertService.alert("Mapping saved successfully", 'success');
      this.back();
      this.getMappingHistory();
    }
  }


  toggle_activate(instituteDirMapID, isDeleted) {
    if (isDeleted === true) {
      this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
        if (response) {
          let obj = {
            "instituteDirMapID": instituteDirMapID,
            "deleted": isDeleted
          };

          this.hospitalInstituteMappingService.toggleMappingStatus(obj)
            .subscribe(response => this.toggleMappingStatusSuccessHandeler(response, "Deactivated"), err => {
              this.alertService.alert(err, 'error');
            })
        }
      });
    }

    if (isDeleted === false) {
      this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
        if (response) {
          let obj = {
            "instituteDirMapID": instituteDirMapID,
            "deleted": isDeleted
          };

          this.hospitalInstituteMappingService.toggleMappingStatus(obj)
            .subscribe(response => this.toggleMappingStatusSuccessHandeler(response, "Activated"), err => {
              this.alertService.alert(err, 'error');
            })
        }
      });
    }

  }

  toggleMappingStatusSuccessHandeler(response, action) {
    console.log(response, "delete Response");
    if (response) {
      this.alertService.alert(action + " successfully", 'success');
      this.getMappingHistory();
    }
  }

}
