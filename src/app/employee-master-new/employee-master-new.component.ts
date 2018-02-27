import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeMasterNewServices } from '../services/ProviderAdminServices/employee-master-new-services.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-employee-master-new',
  templateUrl: './employee-master-new.component.html',
  styleUrls: ['./employee-master-new.component.css']
})
export class EmployeeMasterNewComponent implements OnInit {

  //ngModel
  titleID: any;
  firstName: any;
  middleName: any;
  lastName: any;
  genderID: any;
  contactNo: any;
  designationID: any;
  emergency_contactNo: any;
  dob: any;
  today = new Date();
  mindate: any;
  maxdate: any;
  age: any;
  emailID: any;
  maritalStatusID: any;
  aadharNumber: any;
  panNumber: any;
  qualificationID: any;
  username: any;
  username_status: any;
  showHint: boolean;
  username_dependent_flag: boolean;
  isExistAadhar: boolean = false;
  isExistPan: boolean = false;
  idMessage: string;
  id: any;
  countryId: any;
  stateId: any;
  districtId: any;

  //array
  titles: any = [];
  genders: any = [];
  designations: any = [];
  maritalStatuses: any = [];
  eduQualifications: any = [];
  states: any = [];
  communities: any = [];
  religion: any = [];

  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  userNamePattern = /^[0-9a-zA-Z]+[0-9a-zA-Z-_.]+[0-9a-zA-Z]$/;
  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  @ViewChild('userCreationForm') userCreationForm: NgForm;

  constructor(public employeeMasterNewService: EmployeeMasterNewServices,
    public dataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.employeeMasterNewService.getCommonRegistrationData().subscribe(res => this.showGenderOnCondition(res));
    this.employeeMasterNewService.getAllDesignations().subscribe(res => this.getDesignationsSuccessHandler(res));
    this.employeeMasterNewService.getAllMaritalStatuses().subscribe(res => this.getMaritalStatusesSuccessHandler(res));
    this.employeeMasterNewService.getAllQualifications().subscribe(res => this.getQualificationsSuccessHandler(res));
    this.employeeMasterNewService.getAllCommunities().subscribe(res => this.getCommunitiesSuccessHandler(res));
    this.employeeMasterNewService.getAllStates(this.countryId).subscribe(res => this.getStatesSuccessHandler(res));
    this.employeeMasterNewService.getAllDistricts(this.stateId).subscribe(res => this.getDistrictsSuccessHandler(res));

  }
  /*
   * Display gender on condition
   */

  setGenderOnCondition() {
    if (this.titleID == 2 || this.titleID == 4 || this.titleID == 5 || this.titleID === 13) {
      this.genderID = 2;
    }
    else if (this.titleID == 3 || this.titleID == 8) {
      this.genderID = 1;
    }
    else {
      this.genderID = "";
    }
  }
  showGenderOnCondition(response) {
    console.log("Display gender on condition", response);
    this.titles = response.m_Title;
    this.genders = response.m_genders;
  }
  
  calculateAge(date) {
    if (date != undefined) {
      this.age = this.today.getFullYear() - date.getFullYear();
      const month = this.today.getMonth() - date.getMonth();
      if (month < 0 || (month === 0 && this.today.getDate() < date.getDate())) {
        this.age--; //age is ng-model of AGE
      }
    }
  }

/*
  * User name availability
  */

 checkUserNameAvailability(username) {
  console.log("user", this.username);
  this.employeeMasterNewService
    .checkUserAvailability(username)
    .subscribe(response => this.checkUsernameSuccessHandeler(response));
}

checkUsernameSuccessHandeler(response) {
  console.log(this.username, 'uname');
  console.log('username existance status', response);
  if (response.response == 'userexist') {
    this.username_status = 'User Login ID Exists!! Type Different Please!';
    this.showHint = true;
    this.username_dependent_flag = true;
    this.username = null;

  }
  if (response.response == 'usernotexist') {
    if (
      this.username != '' &&
      (this.username != undefined && this.username != null)
    ) {
      console.log("if response", response);
      this.showHint = false;
      this.username_dependent_flag = false;
    } else {
      console.log("else response", response);
      this.showHint = true;
      this.username_dependent_flag = true;
      this.username_status = 'Username can\'t be blank';
    }
  }
}


  /*
  * Get all Designations
  */
  getDesignations() {
    this.employeeMasterNewService.getAllDesignations().subscribe(response => {
      if (response) {
        console.log("All Designations", response);
        this.designations = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getDesignationsSuccessHandler(response) {
    console.log("Display All Designations", response);
    this.designations = response;
  }
  /*
  * dob
  */
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  /*
  * Get all marital statuses
  */
  getMaritalStatuses() {
    this.employeeMasterNewService.getAllMaritalStatuses().subscribe(response => {
      if (response) {
        console.log("All marital status", response);
        this.maritalStatuses = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getMaritalStatusesSuccessHandler(response) {
    console.log("Display all marital status", response);
    this.maritalStatuses = response;
  }
  /*
 * Get all educational qualifications
 */
  getQualifications() {
    this.employeeMasterNewService.getAllQualifications().subscribe(response => {
      if (response) {
        console.log("All Qualifications", response);
        this.eduQualifications = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getQualificationsSuccessHandler(response) {
    console.log("Display all Qualifications", response);
    this.eduQualifications = response;
  }
  /*
 * Get all communities
 */
  getCommunities() {
    this.employeeMasterNewService.getAllCommunities().subscribe(response => {
      if (response) {
        console.log("All communities", response);
        this.communities = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getCommunitiesSuccessHandler(response) {
    console.log("Display all Communities", response);
    this.communities = response;
  }
  /*
  * Get all religion
  */
  getReligion() {
    this.employeeMasterNewService.getAllReligion().subscribe(response => {
      if (response) {
        console.log("All Religion", response);
        this.religion = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getReligionSuccessHandler(response) {
    console.log("Display all religions", response);
    this.religion = response;
  }
  /*
    * Check Uniqueness in Aadhar
    */
  checkAadhar() {
    if (this.aadharNumber.length == 12) {
      this.employeeMasterNewService.validateAadhar(this.aadharNumber).subscribe(
        (response: any) => {
          this.checkAadharSuccessHandler(response);
        },
        err => { console.log("Error", err); }
      );
    }
  }
  checkAadharSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistAadhar = true;
      this.idMessage = 'Adhaar Number Already Exists';
    } else {
      this.isExistAadhar = false;
      this.idMessage = '';
    }
  }
  /*
    * Check Uniqueness in Pan
    */
  checkPan() {
    if (this.panNumber.length == 10) {
      this.employeeMasterNewService.validatePan(this.panNumber).subscribe(
        response => {
          console.log("pan response", response);
          this.checkPanSuccessHandler(response);
        },
        err => { }
      );
    }
  }
  checkPanSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistPan = true;
      this.idMessage = 'Pan Number Already Exists';
    } else {
      this.isExistPan = false;
      this.idMessage = '';
    }
  }
  
  /*
    * Get all States
    */
  getStates(countryId) {
    console.log("Execution starts for states");
    // country ID : 1 for INDIA(As of now implemented only for India)
    this.countryId = 1;
    this.employeeMasterNewService.getAllStates(this.countryId).subscribe(response => {
      if (response) {
        console.log("All States", response);
        this.states = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getStatesSuccessHandler(response) {
    console.log("Display all States", response);
    this.states = response;
  }
  /*
    * Get all Districts
    */
  getDistricts() {
    this.employeeMasterNewService.getAllDistricts(this.stateId).subscribe(response => {
      if (response) {
        console.log("All Districts", response);
        this.religion = response;
      }
    }, err => {
      console.log("Error", err);
    });
  }
  getDistrictsSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.religion = response;
  }
}
