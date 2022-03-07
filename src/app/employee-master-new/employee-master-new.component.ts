import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeMasterNewServices } from '../services/ProviderAdminServices/employee-master-new-services.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { templateJitUrl } from '@angular/compiler';


@Component({
  selector: 'app-employee-master-new',
  templateUrl: './employee-master-new.component.html',
  styleUrls: ['./employee-master-new.component.css']
})

export class EmployeeMasterNewComponent implements OnInit {
  filteredsearchResult: any = [];
  userId: any;
  createdBy: any;
  serviceProviderID: any;
  disabled = true;

  //ngModel
  titleID: any;
  firstname: any;
  middlename: any;
  lastname: any;
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
  healthProfessionalID: any;
  username: any;
  employee_ID: any;
  user_password: any;
  doj: any;
  minDate_doj: any;
  community: any;
  religion: any;
  username_status: string;
  empID_status: string;
  showHint: boolean;
  empIdshowHint: boolean;
  username_dependent_flag: boolean;
  isExistAadhar: boolean = false;
  isExistPan: boolean = false;
  isHPIdExist: boolean = false;
  errorMessageForAadhar: string;
  errorMessageForPan: string;
  errorMessageForHPID: string;
  id: any;
  confirmMessage: any;
  panelOpenState: boolean = true;
  userType: boolean = false;
  manipulateEMpIDAndDOJ: boolean = false;
  setDoj: any;
  patchDojOnEdit: any;
  isExternal: any;
  enablehealthProfessionalID: boolean = false;
  errorValidationMsgForHPId: boolean= false;

  //Demographics ngModel
  fatherName: any;
  motherName: any;
  currentAddressLine1: any;
  currentAddressLine2: any;
  countryId: any = 1;
  currentState: any;
  currentDistrict: any;
  currentPincode: any;
  permanentAddressLine1: any;
  permanentAddressLine2: any;
  permanentState: any;
  permanentDistrict: any;
  permanentPincode: any;
  isPresent: any;
  isPermanent: any;
  checkAddress: boolean = false;
  dynamictype: any = 'password';

  //array
  searchResult: any = [];
  titles: any = [];
  genders: any = [];
  designations: any = [];
  maritalStatuses: any = [];
  eduQualifications: any = [];
  states: any = [];
  currentDistricts: any = [];
  permanentDistricts: any = [];
  communities: any = [];
  religions: any = [];
  objs: any = [];
  searchTerm: any;
  selfHealthProfessionalID: any;
  selfAadharNo: any;
  selfPanNo: any;

  //flags
  tableMode = true;
  formMode = false;
  editMode = false;

  //constants & variables
  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  // userNamePattern = /^[0-9a-zA-Z]+[0-9a-zA-Z-_.]+[0-9a-zA-Z]$/;
  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;
  mobileNoPattern = /^[1-9][0-9]{9}/;
  healthIDPattern = /^[a-zA-Z][a-zA-Z0-9.]+$/;

  @ViewChild('userCreationForm') userCreationForm: NgForm;
  @ViewChild('demographicsDetailsForm') demographicsDetailsForm: NgForm;
  @ViewChild('communicationDetailsForm') communicationDetailsForm: NgForm;

  // md2.data: Observable<Array<item>>;

  constructor(public employeeMasterNewService: EmployeeMasterNewServices,
    public dataServiceValue: dataService,
    public dialogService: ConfirmationDialogsService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.createdBy = this.dataServiceValue.uname;
    console.log("createdBY", this.createdBy);

    this.serviceProviderID = this.dataServiceValue.service_providerID;
    this.getAllUserDetails();
    this.minDate_doj = new Date();
  }

  /*
   * All details of the user
   */
  getAllUserDetails() {
    console.log("serviceProvider", this.serviceProviderID);

    this.employeeMasterNewService.getAllUsers(this.serviceProviderID).subscribe(response => {
      if (response) {
        console.log("All details of the user", response);
        this.searchResult = response;
        this.filteredsearchResult = response;
      }
    }, (err) => console.log('error', err));
  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.userType = false;
    this.resetDob();

    this.employeeMasterNewService.getCommonRegistrationData().subscribe(res => this.showGenderOnCondition(res),
      (err) => console.log('error', err));

    this.employeeMasterNewService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res),
      (err) => console.log('error', err));

    this.employeeMasterNewService.getAllMaritalStatuses().subscribe(res => this.getAllMaritalStatusesSuccessHandler(res),
      (err) => console.log('error', err));

    this.employeeMasterNewService.getAllQualifications().subscribe(res => this.getAllQualificationsSuccessHandler(res),
      (err) => console.log('error', err));

    this.employeeMasterNewService.getAllCommunities().subscribe(res => this.getCommunitiesSuccessHandler(res),
      (err) => console.log('error', err));

    this.employeeMasterNewService.getAllReligions().subscribe(res => this.getReligionSuccessHandler(res),
      (err) => console.log('error', err));

    this.employeeMasterNewService.getAllStates(this.countryId).subscribe(res => this.getAllStatesSuccessHandler(res),
      (err) => console.log('error', err));

  }
  /*
 * Reset the dob on adding multiple objects
 */
  resetDob() {
    this.dob = new Date();
    this.dob.setHours(0);
    this.dob.setMinutes(0);
    this.dob.setSeconds(0);
    this.dob.setMilliseconds(0);
    // setting dob as min 14 years to restrict child labour
    this.dob.setFullYear(this.today.getFullYear() - 14);
    this.maxdate = new Date();
    this.maxdate.setFullYear(this.today.getFullYear() - 14);
    this.mindate = new Date();
    this.mindate.setFullYear(this.today.getFullYear() - 70);
    this.calculateAge(this.dob);
  }
  resetDoj() {
    this.doj = null;
    this.calculateDoj(this.dob);
  }
  /*
 * display the added user's in the table
 */
  showTable() {
    this.resetAllForms();
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
  }

  back() {
    this.dialogService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.objs = [];
        this.searchTerm = null;
        this.filteredsearchResult = this.searchResult;
        this.showTable();
        this.resetAllFlags();
      }
    })
  }
  // encryptionFlag: boolean = true;
 resetAllFlags(){
  this.enablehealthProfessionalID = false;
  this.errorValidationMsgForHPId = false;
  this.isHPIdExist = false;
  this.isExistPan = false;
  this.isExistAadhar = false;
  this.empIdshowHint = false;
  this.username_dependent_flag = false;
 }
  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }

  /*
 * calculate the doj based on dob
 */
  calculateDoj(dob) {
    //calculate doj as dob + 14 years & this is rest if dob is changed
    this.today = new Date();
    this.minDate_doj.setFullYear(dob.getFullYear() + 14, dob.getMonth(), dob.getDate());
    console.log("set minDate_doj", this.minDate_doj);
    this.minDate_doj = new Date(this.minDate_doj);
    console.log(" b4 minDate_doj", this.minDate_doj);



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
  /*
  * User name availability
  */

  checkUserNameAvailability(username) {
    this.employeeMasterNewService
      .checkUserAvailability(username)
      .subscribe(response => this.checkUsernameSuccessHandeler(response),
      (err) => console.log('error', err));
  }

  checkUsernameSuccessHandeler(response) {
    console.log('username existance status', response);
    if (response.response == 'userexist') {
      this.username_status = 'User ID exists';
      this.showHint = true;
      this.username_dependent_flag = true;
      // this.username = null;

    }
    if (response.response == 'usernotexist') {
      if (this.username != '' && (this.username != undefined && this.username != null)) {
        console.log("if response", response);
        this.showHint = false;
        this.username_dependent_flag = false;
      }
      // else 
      // {
      //   console.log("else response", response);
      //   this.showHint = true;
      //   this.username_dependent_flag = true;
      //   this.username_status = 'Username is required';
      // }
    }
  }
  checkEmployeeIdAvailability(empID) {

    this.employeeMasterNewService
      .checkEmpIdAvailability(empID)
      .subscribe(response => this.checkempIdSuccessHandeler(response),
      (err) => console.log('error', err));
  }

  checkempIdSuccessHandeler(response) {
    console.log('employee ID existance status', response);
    if (response.response == 'true') {
      this.empID_status = 'Employee ID exists';
      this.empIdshowHint = true;
    }
    if (response.response == 'false') {
      if (this.employee_ID != '' && (this.employee_ID != undefined && this.employee_ID != null)) {
        this.empIdshowHint = false;
      }
    }

  }
 // to check the validations for health professional ID feild
  isLetter(value) {
    return value.length === 1 && value.match(/[a-z]/i);
  }
  is_numeric(value) {
    return /^\d+$/.test(value);
  }
  validateHealthProfessionalId() {
    let healthProfessinalIdValue = this.healthProfessionalID;
    let count = 0;
    let countFlag = false;
    if (healthProfessinalIdValue != "" && healthProfessinalIdValue != undefined && healthProfessinalIdValue != null) {
      let hprId = healthProfessinalIdValue;
      if (hprId.charAt(hprId.length-1) == "."){
        this.errorValidationMsgForHPId = true;
      }
      else{
      for (let i = 0; i < hprId.length; i++) {
        if (!this.is_numeric(hprId.charAt(i))) {
          if (!this.isLetter(hprId.charAt(i))) {
            if (hprId.charAt(i) == ".") count++;
            else {
              countFlag = true;
              break;
            }
          }
        }
      }
      if (count > 1 || countFlag)
        this.errorValidationMsgForHPId = true;
        else {
          this.errorValidationMsgForHPId = false;
        }
    }
    }
  }
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  /*
  * calculate age based on the DOB
  */
  calculateAge(date) {
    this.disabled = false;
    if (date != undefined) {
      let age = this.today.getFullYear() - date.getFullYear();
      if (this.objs.length == 0) {
        this.age = age;
        this.userCreationForm.form.patchValue({ 'user_age': age });
      }
      else {
        this.userCreationForm.form.patchValue({ 'user_age': age });

      }

      const month = this.today.getMonth() - date.getMonth();
      if (month < 0 || (month === 0 && this.today.getDate() < date.getDate())) {
        age--; //age is ng-model of AGE
        if (this.objs.length == 0) {
          this.age = age;
          this.userCreationForm.form.patchValue({ 'user_age': age });
        }
        else {
          this.userCreationForm.form.patchValue({ 'user_age': age });

        }
      }
    }

    this.disabled = true;
  }
  /*
  * Get all Designations
  */
  getAllDesignationsSuccessHandler(response) {
    console.log("Display All Designations", response);
    this.designations = response;
  }
  /*
  * Get all marital statuses
  */
  getAllMaritalStatusesSuccessHandler(response) {
    console.log("Display all marital status", response);
    this.maritalStatuses = response;
  }
  /*
  * Get all educational qualifications
  */
  getAllQualificationsSuccessHandler(response) {
    console.log("Display all Qualifications", response);
    this.eduQualifications = response;
  }
  /*
    * Check Uniqueness in Aadhar
    */
  checkAadhar() {
    this.isExistAadhar = false;
    this.errorMessageForAadhar = '';
    //to check the duplicates in buffertable
    if (this.editMode !== true && this.aadharNumber !== undefined && this.aadharNumber !== null) {
      this.validateAadharNo();
    }

    if (this.editMode == true && this.aadharNumber !== undefined && this.aadharNumber !== null && (this.selfAadharNo !== this.aadharNumber)) {
      this.validateAadharNo();
    }  
  }
  validateAadharNo(){
    console.log('aadharNumber', this.aadharNumber);
      if (this.aadharNumber.length == 12) {
        this.employeeMasterNewService.validateAadhar(this.aadharNumber).subscribe(
          (response: any) => {
            if(response.response){
            this.checkAadharSuccessHandler(response);
          } else{
            this.dialogService.alert(response.error.errorMessage, 'error');
            this.aadharNumber = null;
          }
          }, (err) => {console.log('error', err)
          this.dialogService.alert(err, 'error');
          this.aadharNumber = null;
          }
          );
        }
  }
  checkAadharSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistAadhar = true;
      this.errorMessageForAadhar = 'Aadhar Number Already Exists';
    } else {
      this.isExistAadhar = false;
      this.errorMessageForAadhar = '';
    }
  }
  /*
    * Check Uniqueness in Pan
    */
  checkPan() {
    this.isExistPan = false;
    this.errorMessageForPan = '';
    if (this.editMode !== true && this.panNumber !== undefined && this.panNumber !== null) {
      this.validatePanNo();
    }

    if (this.editMode == true && this.panNumber !== undefined && this.panNumber !== null && (this.selfPanNo.toLowerCase() !== this.panNumber.toLowerCase())) {
      this.validatePanNo();
    }  
    
  }
  validatePanNo(){
      if (this.panNumber.length == 10) {
        this.employeeMasterNewService.validatePan(this.panNumber).subscribe(
          response => {
            if(response.response){
            console.log("pan response", response);
            this.checkPanSuccessHandler(response);
          } else{
            this.dialogService.alert(response.error.errorMessage, 'error');
            this.panNumber = null;
          }
          }, (err) => {console.log('error', err)
          this.dialogService.alert(err, 'error');
          this.panNumber = null;
          }
          );
      }
  }
  checkPanSuccessHandler(response) {
    if (response.response == 'true') {
      this.isExistPan = true;
      this.errorMessageForPan = 'Pan Number Already Exists';
    } else {
      this.isExistPan = false;
      this.errorMessageForPan = '';
    }
  }
  // to check existance of health professional ID
  checkHealthProfessionalID() {
      this.isHPIdExist = false;
      this.errorMessageForHPID = '';
    if (this.editMode !== true && this.healthProfessionalID !== undefined && this.healthProfessionalID !== null) {
      this.validateHealthProfessionalID();
    }

    if (this.editMode == true && this.healthProfessionalID !== undefined && this.healthProfessionalID !== null && (this.selfHealthProfessionalID.toLowerCase() !== this.healthProfessionalID.toLowerCase())) {
      this.validateHealthProfessionalID();
    }
  }
  validateHealthProfessionalID(){
    if (this.healthProfessionalID.length >= 4) {
      let reqObject = this.healthProfessionalID + "@hpr.sbx"; 
      this.employeeMasterNewService.validateHealthProfessionalID(reqObject).subscribe(
        response => {
          if(response.response){
          console.log("HPID response", response);
          this.checkHealthProfessionalIDSuccessHandler(response);
        } else{
          this.dialogService.alert(response.error.errorMessage, 'error');
          this.healthProfessionalID = null;
        }
        }, (err) => {console.log('error', err)
        this.dialogService.alert(err, 'error');
        this.healthProfessionalID = null;
        }
        );
      }

  }
  checkHealthProfessionalIDSuccessHandler(response){
    if (response.response == 'true') {
      this.isHPIdExist = true;
      this.errorMessageForHPID = 'Health Professional ID Already Exists';
    } else {
      this.isHPIdExist = false;
      this.errorMessageForHPID = '';
    }
  }
  /*
  * Get all communities
  */
  getCommunitiesSuccessHandler(response) {
    console.log("Display all Communities", response);
    this.communities = response;
  }
  /*
  * Get all religion
  */
  getReligionSuccessHandler(response) {
    console.log("Display all religions", response);
    this.religions = response;
  }

  /*
    * Get all States
    */
  getAllStatesSuccessHandler(response) {
    console.log("Display all States", response);
    this.states = response;
  }
  /*
    * Get all Districts for current address 
    */
  getCurrentDistricts(currentStateID) {
    this.checkAddress = false;
    this.employeeMasterNewService.getAllDistricts(currentStateID).subscribe(response => {
      this.getCurrentDistrictsSuccessHandler(response)
    }, (err) => console.log('error', err));
  }
  getCurrentDistrictsSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.currentDistricts = response;
  }
  resetcheckBox() {
    this.checkAddress = false;
  }
  /*
      * Get all Districts for permanent address 
      */
  getPermanentDistricts(permanentStateID) {
    this.employeeMasterNewService.getAllDistricts(permanentStateID).subscribe(response => {
      this.getPermanentDistrictsSuccessHandler(response)
    }, (err) => console.log('error', err));
  }
  getPermanentDistrictsSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.permanentDistricts = response;
  }

  disable_permanentAddress_flag: boolean = false;

  addressCheck(value) {
    if (value.checked) {
      this.permanentAddressLine1 = this.currentAddressLine1;
      this.permanentAddressLine2 = this.currentAddressLine2;
      this.permanentState = this.currentState;
      this.permanentDistrict = this.currentDistrict;
      this.getPermanentDistricts(this.currentState);
      this.permanentPincode = this.currentPincode;
      this.isPermanent = '1';
      this.isPresent = '0';
      this.disable_permanentAddress_flag = true;
    } else {
      this.permanentAddressLine1 = '';
      this.permanentAddressLine2 = '';
      this.permanentState = '';
      this.permanentDistrict = '';
      this.permanentPincode = '';
      this.isPermanent = '0';
      this.isPresent = '1';
      this.disable_permanentAddress_flag = false;
      this.checkAddress = false;
    }
  }


  /*
  * Reset all the forms
  */
  resetAllForms() {
    this.userCreationForm.resetForm();
    this.demographicsDetailsForm.resetForm();
    this.communicationDetailsForm.resetForm();
    this.resetDob();
    this.resetDoj();
    this.manipulateEMpIDAndDOJ = false;
    this.userCreationForm.form.patchValue({
      userType: false
    })
  }
  changeUserType(flag) {
    this.manipulateEMpIDAndDOJ = flag;
    this.employee_ID = null;
    this.doj = null;
  }
  /*
  * Method for addition of objects
  */
  add_object(userFormValue, demographicsFormValue, communicationFormValue) {
    this.resetAllFlags();

    var tempObj = {
      'titleID': userFormValue.title_Id,
      'firstname': userFormValue.user_firstname,
      'middlename': userFormValue.user_middlename,
      'lastname': userFormValue.user_lastname,
      'genderID': userFormValue.gender_Id,
      'dob': userFormValue.user_dob,
      // 'age': userFormValue.user_age,
      'age': this.age,
      'contactNo': userFormValue.primaryMobileNo,
      'emailID': userFormValue.primaryEmail,
      'designationID': userFormValue.designation,
      'maritalStatusID': userFormValue.marital_status,
      'aadharNumber': userFormValue.aadhar_number,
      'panNumber': userFormValue.pan_number,
      'qualificationID': userFormValue.edu_qualification,
      'healthProfessionalID': userFormValue.healthProfessionalID,
      'emergency_contactNo': userFormValue.emergencyContactNo,
      'username': userFormValue.user_name,
      'employeeID': userFormValue.employeeID,
      'password': userFormValue.password,
      'doj': userFormValue.doj,
      // 'fatherName': demographicsFormValue.father_name.trim(),
      // 'motherName': demographicsFormValue.mother_name.trim(),
      'fatherName': demographicsFormValue.father_name,
      'motherName': demographicsFormValue.mother_name,
      'communityID': demographicsFormValue.community_id,
      'religionID': demographicsFormValue.religion_id,
      'currentAddressLine1': communicationFormValue.address.current_addressLine1,
      'currentAddressLine2': communicationFormValue.address.current_addressLine2,
      'currentState': communicationFormValue.address.current_state,
      'currentDistrict': communicationFormValue.address.current_district,
      'currentPincode': communicationFormValue.address.current_pincode,
      'permanentAddressLine1': communicationFormValue.permanent_addressLine1,
      'permanentAddressLine2': communicationFormValue.permanent_addressLine2,
      'permanentState': communicationFormValue.permanent_state,
      'permanenttDistrict': communicationFormValue.permanent_district,
      'permanentPincode': communicationFormValue.permanent_pincode,
      'isPresent': this.isPresent,
      'isPermanent': this.isPermanent,
      'isExternal': userFormValue.userType
    }
    console.log("add objects", tempObj);
    // this.objs.push(tempObj);
    this.checkUserNameAvailability(name);
    this.checkDuplicatesInBuffer(tempObj);
    this.resetAllForms();
  }

  checkDuplicatesInBuffer(tempObj) {
    let duplicateAadhar = 0;
    let duplicatePan = 0;
    let duplicateName = 0;
    let duplicateEmployeeID = 0;
    let duplicateHealthProfessionalID = 0;
    if (this.objs.length === 0) {
      this.objs.push(tempObj);
    }

    else {
      for (let i = 0; i < this.objs.length; i++) {
        if (this.objs[i].aadharNumber != undefined && tempObj.aadharNumber !== undefined && tempObj.aadharNumber !== null && this.objs[i].aadharNumber === tempObj.aadharNumber) {
          duplicateAadhar = duplicateAadhar + 1;
          console.log("duplicateAadhar", duplicateAadhar);
        }
        if (this.objs[i].panNumber != undefined && tempObj.panNumber !== undefined && tempObj.panNumber !== null && this.objs[i].panNumber === tempObj.panNumber) {
          duplicatePan = duplicatePan + 1;
          console.log("duplicatePan", duplicatePan);
        }
        if (this.objs[i].username != undefined && this.objs[i].username === tempObj.username) {
          duplicateName = duplicateName + 1;
          console.log("this.duplicateName", duplicateName);
        }
        if (this.objs[i].employeeID != undefined && this.objs[i].employeeID === tempObj.employeeID) {
          duplicateEmployeeID = duplicateEmployeeID + 1;
          console.log("this.duplicateemployeeID", duplicateName);
        }
        if (this.objs[i].healthProfessionalID != undefined && tempObj.healthProfessionalID !== undefined && tempObj.healthProfessionalID !== null && this.objs[i].healthProfessionalID.toLowerCase() === tempObj.healthProfessionalID.toLowerCase()) {
          duplicateHealthProfessionalID = duplicateHealthProfessionalID + 1;
        }
      }
      if (duplicateAadhar === 0 && duplicatePan === 0 && duplicateName === 0 && duplicateEmployeeID === 0 && duplicateHealthProfessionalID === 0) {
        this.objs.push(tempObj);
      }
      else if (duplicateAadhar > 0 && duplicatePan > 0 && duplicateName > 0 && duplicateEmployeeID > 0 && duplicateHealthProfessionalID > 0) {
        this.dialogService.alert("EmployeeID, Username, Aadhar, Pan number and Health Professional ID already exist");
      }
      else if (duplicateAadhar > 0 && duplicateHealthProfessionalID > 0 && duplicateName > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("EmployeeID, Username, Aadhar and Health Professional ID  already exist");
      }
      else if (duplicateAadhar > 0 && duplicatePan > 0 && duplicateName > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("EmployeeID, Username, Aadhar and Pan number already exist");
      }
      else if (duplicateAadhar > 0 && duplicatePan > 0 && duplicateHealthProfessionalID > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("EmployeeID, Health Professional ID, Aadhar and Pan number already exist");
      }
      else if (duplicateHealthProfessionalID > 0 && duplicatePan > 0 && duplicateName > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("EmployeeID, Username, Health Professional ID and Pan number already exist");
      }
      else if (duplicateHealthProfessionalID > 0 && duplicatePan > 0 && duplicateName > 0 && duplicateAadhar > 0) {
        this.dialogService.alert("Health Professional ID, Username, Aadhar and Pan number already exist");
      }
      else if (duplicateAadhar > 0 && duplicatePan > 0 && duplicateName > 0) {
        this.dialogService.alert("Username, Aadhar and Pan number already exist");
      }
      else if (duplicateAadhar > 0 && duplicatePan > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Employee ID, Aadhar and Pan number already exist");
      }
      else if (duplicateAadhar > 0 && duplicateName > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Aadhar number, Employee ID and Username already exist");
      }
      else if (duplicatePan > 0 && duplicateHealthProfessionalID > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Health Professional ID, Employee ID and Pan number already exist");
      }
      else if (duplicateHealthProfessionalID > 0 && duplicateName > 0 && duplicateAadhar > 0) {
        this.dialogService.alert("Health Professional ID, Aadhar number and Username already exist");
      }

      else if (duplicateHealthProfessionalID > 0 && duplicateAadhar > 0 && duplicatePan > 0) {
        this.dialogService.alert("Health Professional ID, Aadhar number and Pan number already exist");
      }
      else if (duplicateAadhar > 0 && duplicateHealthProfessionalID > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Health Professional ID, Aadhar number and Employee ID already exist");
      }
      else if (duplicateName > 0 && duplicateHealthProfessionalID > 0 && duplicatePan > 0) {
        this.dialogService.alert("Health Professional ID, Aadhar number and Username already exist");
      }
      else if (duplicatePan > 0 && duplicateName > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Pan number, Employee ID and Username already exist");
      }
      else if (duplicateHealthProfessionalID > 0 && duplicateName > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Health Professional ID, Employee ID and Username already exist");
      }
      
      else if (duplicateAadhar > 0 && duplicatePan > 0) {
        this.dialogService.alert("Aadhar number and Pan number already exist");
      }
      else if (duplicateAadhar > 0 && duplicateName > 0) {
        this.dialogService.alert("Aadhar number and Username already exist");
      }
      else if (duplicatePan > 0 && duplicateName > 0) {
        this.dialogService.alert("Pan number and Username already exist");
      }
      else if (duplicateAadhar > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Aadhar number and Employee ID already exist");
      }
      else if (duplicatePan > 0 && duplicateEmployeeID > 0) {
        this.dialogService.alert("Pan number and Employee ID already exist");
      }
      else if (duplicateEmployeeID > 0 && duplicateName > 0) {
        this.dialogService.alert("Employee ID and Username already exist");
      }
      else if (duplicateHealthProfessionalID > 0 && duplicateName > 0) {
        this.dialogService.alert("Health Professional ID and Username already exist");
      }
      else if (duplicateEmployeeID > 0 && duplicateHealthProfessionalID > 0) {
        this.dialogService.alert("Employee ID and Health Professional ID already exist");
      }
      else if (duplicateHealthProfessionalID > 0 && duplicateAadhar > 0) {
        this.dialogService.alert("Health Professional ID and Aadhar number already exist");
      }
      else if (duplicateHealthProfessionalID > 0 && duplicatePan > 0) {
        this.dialogService.alert("Health Professional ID and Pan number already exist");
      }
      else if (duplicateAadhar > 0) {
        this.dialogService.alert("Aadhar number already exist");
      }
      else if (duplicatePan > 0) {
        this.dialogService.alert("Pan number already exist");
      }
      else if (duplicateEmployeeID > 0) {
        this.dialogService.alert("Employee number already exist");
      }
      else if (duplicateHealthProfessionalID > 0) {
        this.dialogService.alert("Health Professional ID already exist");
      }
      else {
        this.dialogService.alert("Already exist");
      }

    }
  }

  /*
  * Removing single object
  */
  remove_obj(index) {
    this.objs.splice(index, 1);
  }
  /*
  * User creation
  */
  createUser() {
    var reqObject = [];
    for (var i = 0; i < this.objs.length; i++) {
      /*dob*/
      this.objs[i].dob.setHours(0);
      this.objs[i].dob.setMinutes(0);
      this.objs[i].dob.setSeconds(0);
      this.objs[i].dob.setMilliseconds(0);
      /*doj*/
      if (this.objs[i].isExternal == false) {
        this.objs[i].doj.setHours(0);
        this.objs[i].doj.setMinutes(0);
        this.objs[i].doj.setSeconds(0);
        this.objs[i].doj.setMilliseconds(0);
        this.setDoj = new Date(this.objs[i].doj.valueOf() - 1 * this.objs[i].doj.getTimezoneOffset() * 60 * 1000);
      } else {
        this.objs[i].doj = null;
        this.setDoj = null;
      }
      var tempObj = {
        'titleID': this.objs[i].titleID,
        'firstName': this.objs[i].firstname,
        'middleName': this.objs[i].middlename,
        'lastName': this.objs[i].lastname,
        'genderID': this.objs[i].genderID,
        'dOB': new Date(this.objs[i].dob.valueOf() - 1 * this.objs[i].dob.getTimezoneOffset() * 60 * 1000),
        'age': this.objs[i].age,
        'contactNo': this.objs[i].contactNo,
        'emailID': this.objs[i].emailID,
        'designationID': this.objs[i].designationID,
        'maritalStatusID': this.objs[i].maritalStatusID,
        'aadhaarNo': this.objs[i].aadharNumber,
        'pAN': this.objs[i].panNumber,
        'qualificationID': this.objs[i].qualificationID,
        'healthProfessionalID': (this.objs[i].healthProfessionalID !== undefined && this.objs[i].healthProfessionalID !== null) ? (this.objs[i].healthProfessionalID + "@hpr.sbx") : this.objs[i].healthProfessionalID,
        'emergencyContactNo': this.objs[i].emergency_contactNo,
        'userName': this.objs[i].username,
        'employeeID': this.objs[i].employeeID ? this.objs[i].employeeID : null,
        'password': this.objs[i].password,
        'dOJ': this.setDoj,
        'fathersName': this.objs[i].fatherName,
        'mothersName': this.objs[i].motherName,
        'communityID': this.objs[i].communityID,
        'religionID': this.objs[i].religionID,
        'addressLine1': this.objs[i].currentAddressLine1,
        'addressLine2': this.objs[i].currentAddressLine2,
        'stateID': this.objs[i].currentState,
        'districtID': this.objs[i].currentDistrict,
        'pinCode': this.objs[i].currentPincode,
        'permAddressLine1': this.objs[i].permanentAddressLine1,
        'permAddressLine2': this.objs[i].permanentAddressLine2,
        'permStateID': this.objs[i].permanentState,
        'permDistrictID': this.objs[i].permanenttDistrict,
        'permPinCode': this.objs[i].permanentPincode,
        'statusID': "1",
        'isPermanent': this.isPermanent,
        'isPresent': this.isPresent,
        'createdBy': this.createdBy,
        'cityID': '1',
        'serviceProviderID': this.serviceProviderID,
        'isExternal': this.objs[i].isExternal
      }
      reqObject.push(tempObj);
    }
    console.log("Details to be saved", reqObject);
    this.employeeMasterNewService.createNewUser(reqObject).subscribe(response => {
      console.log("response", response);
      // if (response.stat)     
      this.dialogService.alert("Saved successfully", "success");
      this.objs = [];
      this.getAllUserDetails();
      this.showTable();
    }), (err) => console.log('error', err);

  }


  // clearAll() {
  //   this.userCreationForm.resetForm();
  //   this.demographicsDetailsForm.resetForm();
  //   this.communicationDetailsForm.resetForm();
  // }

  showEditForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = true;
  }
  /*
  * Edit user details
  */
  editUserDetails(data) {
    console.log('Data to be edit', data);
    this.disabled = false;
    this.showEditForm();
    if (this.formMode == true && this.editMode == true) {
      this.employeeMasterNewService.getCommonRegistrationData().subscribe(res => this.showGenderOnCondition(res),
        (err) => console.log('error', err));

      this.employeeMasterNewService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res),
        (err) => console.log('error', err));

      this.employeeMasterNewService.getAllMaritalStatuses().subscribe(res => this.getAllMaritalStatusesSuccessHandler(res),
        (err) => console.log('error', err));

      this.employeeMasterNewService.getAllQualifications().subscribe(res => this.getAllQualificationsSuccessHandler(res),
        (err) => console.log('error', err));

      this.employeeMasterNewService.getAllCommunities().subscribe(res => this.getCommunitiesSuccessHandler(res),
        (err) => console.log('error', err));

      this.employeeMasterNewService.getAllReligions().subscribe(res => this.getReligionSuccessHandler(res),
        (err) => console.log('error', err));

      this.employeeMasterNewService.getAllStates(this.countryId).subscribe(res => this.getAllStatesSuccessHandler(res),
        (err) => console.log('error', err));

      this.edit(data);
    }
  }

  edit(data) {
    // assinging the variable to check the self existing data 
    this.selfHealthProfessionalID = null;
    this.selfAadharNo = null;
    this.selfPanNo = null;
    console.log("data", data);
    this.isExternal = data.isExternal;
    if (data.stateID != null && data.stateID) {
      this.currentState = data.stateID;
      this.getCurrentDistricts(this.currentState);
      this.getPermanentDistricts(data.permStateID);
      if (this.currentDistricts && this.currentDistricts != null) {
        this.communicationDetailsForm.form.patchValue({
          address: {
            current_addressLine1: data.addressLine1,
            current_addressLine2: data.addressLine2,
            current_state: data.stateID,
            current_district: data.districtID,
            current_pincode: data.pinCode
          },
          permanent_addressLine1: data.permAddressLine1,
          permanent_addressLine2: data.permAddressLine2,
          permanent_state: data.permStateID,
          permanent_district: data.permDistrictID,
          permanent_pincode: data.permPinCode
        })
      }
    }
    if (data.addressLine1 == data.permAddressLine1 && data.addressLine2 == data.permAddressLine2 &&
      data.stateID == data.permStateID && data.districtID == data.permDistrictID && data.pinCode == data.permPinCode) {
      this.checkAddress = true;
    }
    if (this.isExternal == false) {
      this.patchDojOnEdit = data.dOJ;
      this.manipulateEMpIDAndDOJ = false;
    } else {
      this.manipulateEMpIDAndDOJ = true;
    }
    if ((data.designationName !== undefined && data.designationName !== null) && (data.designationName.toLowerCase() === "doctor" || data.designationName.toLowerCase() === "tc specialist")) {
      this.enablehealthProfessionalID = true;
    }
    else {
      this.enablehealthProfessionalID = false;
    }
    this.userCreationForm.form.patchValue({
      title_Id: data.titleID,
      user_firstname: data.firstName,
      user_middlename: data.middleName,
      user_lastname: data.lastName,
      gender_Id: data.genderID,
      primaryMobileNo: data.contactNo,
      designation: data.designationID,
      emergencyContactNo: data.emergencyContactNo,
      user_dob: data.dOB,
      primaryEmail: data.emailID,
      marital_status: data.maritalStatusID,
      aadhar_number: data.aadhaarNo,
      pan_number: data.pAN,
      edu_qualification: data.qualificationID,
      doj: this.patchDojOnEdit,
    });
    // to patch the value in edit model removing hardcoded variable
    if (data.healthProfessionalID !==undefined && data.healthProfessionalID !==null){
    let editHPIdvalue = data.healthProfessionalID.replace('@hpr.sbx','');
    this.healthProfessionalID = editHPIdvalue;
    this.selfHealthProfessionalID = editHPIdvalue;
     }
    // assigning duplicate varible to handle sellf existing data 
    this.selfAadharNo = data.aadhaarNo;
    this.selfPanNo = data.pAN;

    this.demographicsDetailsForm.form.patchValue({
      father_name: data.fathersName,
      mother_name: data.mothersName,
      community_id: data.communityID,
      religion_id: data.religionID
    })
    this.userId = data.userID;
    this.createdBy = data.createdBy;
    this.limitDateInEdit(data.dOB);
  }
  limitDateInEdit(dateOfBirth) {
    console.log("Limit dateOfBirth", dateOfBirth);
    this.maxdate = new Date();
    this.maxdate.setFullYear(this.today.getFullYear() - 20);
    this.mindate = new Date();
    this.mindate.setFullYear(this.today.getFullYear() - 70);
    this.calculateAgeInEdit(dateOfBirth);
  }
  /*
 * calculate age based on the DOB
 */
  calculateAgeInEdit(dateOfBirth) {
    if (dateOfBirth != undefined) {
      let existDobAge = new Date(dateOfBirth);
      this.age = this.today.getFullYear() - existDobAge.getFullYear();
      const month = this.today.getMonth() - existDobAge.getMonth();
      if (month < 0 || (month === 0 && this.today.getDate() < existDobAge.getDate())) {
        this.age--; //age is ng-model of AGE
      }
    }
    this.userCreationForm.form.patchValue({ 'user_age': this.age });
    this.disabled = true;

  }

  update(userCreationFormValue, demographicsValue, communicationFormValue) {
    this.searchTerm =null;
    let doj: any = "";
    let dob: any = "";
    let editDoj: any;
    if (this.isExternal == false) {
      if (typeof userCreationFormValue.doj === "string") {
        doj = new Date(userCreationFormValue.doj);
      }
      else {
        doj = userCreationFormValue.doj;
        console.log("doj", doj);
      }
      editDoj = new Date(doj.valueOf() - 1 * doj.getTimezoneOffset() * 60 * 1000);
    } else {
      editDoj = null;
    }

    if (typeof userCreationFormValue.user_dob === "string") {
      dob = new Date(userCreationFormValue.user_dob);
    }
    else {
      dob = userCreationFormValue.user_dob;
      console.log("dob", dob);
    }
    let update_tempObj = {
      'titleID': userCreationFormValue.title_Id,
      'firstName': userCreationFormValue.user_firstname,
      'middleName': userCreationFormValue.user_middlename,
      'lastName': userCreationFormValue.user_lastname,
      'genderID': userCreationFormValue.gender_Id,
      'dOB': new Date(dob.valueOf() - 1 * dob.getTimezoneOffset() * 60 * 1000),
      //'age': userCreationFormValue.age,
      'age': this.age,
      'contactNo': userCreationFormValue.primaryMobileNo,
      'emailID': userCreationFormValue.primaryEmail,
      'designationID': userCreationFormValue.designation,
      'maritalStatusID': userCreationFormValue.marital_status,
      'aadhaarNo': userCreationFormValue.aadhar_number,
      'pAN': userCreationFormValue.pan_number,
      'qualificationID': userCreationFormValue.edu_qualification,
      'healthProfessionalID': (userCreationFormValue.healthProfessionalID !== undefined && userCreationFormValue.healthProfessionalID !== null) ? (userCreationFormValue.healthProfessionalID + "@hpr.sbx") : userCreationFormValue.healthProfessionalID,
      'emergencyContactNo': userCreationFormValue.emergencyContactNo,
      'dOJ': editDoj,
      'fathersName': demographicsValue.father_name,
      'mothersName': demographicsValue.mother_name,
      'communityID': demographicsValue.community_id,
      'religionID': demographicsValue.religion_id,
      'addressLine1': communicationFormValue.address.current_addressLine1,
      'addressLine2': communicationFormValue.address.current_addressLine2,
      'stateID': communicationFormValue.address.current_state,
      'districtID': communicationFormValue.address.current_district,
      'pinCode': communicationFormValue.address.current_pincode,
      'permAddressLine1': communicationFormValue.permanent_addressLine1,
      'permAddressLine2': communicationFormValue.permanent_addressLine2,
      'permStateID': communicationFormValue.permanent_state,
      'permDistrictID': communicationFormValue.permanent_district,
      'permPinCode': communicationFormValue.permanent_pincode,
      'userID': this.userId,
      'modifiedBy': this.createdBy,
      'cityID': 1,
      'isExternal': this.isExternal

    }

    console.log('Data to be update', update_tempObj);

    this.employeeMasterNewService.editUserDetails(update_tempObj).subscribe(response => {
      console.log("updated obj", response);
      this.dialogService.alert('Updated successfully', 'success');
      /* resetting form and ngModels used in editing */
      this.getAllUserDetails();
      this.showTable();
      this.resetAllFlags();

    }, err => {
      console.log("error", err);
      //this.dialogService.alert('error', err);
    });

  }


  /*
   * Activation and deactivation of the user
  */
  activateDeactivate(userID, flag) {
    let obj = {
      "userID": userID,
      "deleted": flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.dialogService.confirm('Confirm', "Are you sure you want to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log("Deactivating or activating Obj", obj);
        this.employeeMasterNewService.userActivationDeactivation(obj)
          .subscribe((res) => {
            console.log('Activation or deactivation response', res);
            this.dialogService.alert(this.confirmMessage + "d successfully", 'success');
            this.getAllUserDetails();
            this.searchTerm = null;
          }, (err) => console.log('error', err))
      }
    },
      (err) => {
        console.log(err);
      })
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchResult = this.searchResult;
    } else {
      this.filteredsearchResult = [];
      this.searchResult.forEach((item) => {
        for (let key in item) {
          if (key == 'userName' || key == 'emergencyContactNo' || key == 'emailID' || key == 'designationName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchResult.push(item); break;
            }
          }
        }
      });
    }
  }
  // to enable health professional ID feild upon selecting designation
  enableHPID(){
    this.healthProfessionalID= null;
    let designationNameValue = this.designations.filter(response => {
      
    if (this.designationID === response.designationID ){
      return response;
    }
    });
    if (designationNameValue !== undefined && designationNameValue !== null && (designationNameValue[0].designationName.toLowerCase() === "doctor" || designationNameValue[0].designationName.toLowerCase() === "tc specialist")) {
      this.enablehealthProfessionalID = true;
    }
    else{
      this.enablehealthProfessionalID = false;
    }
  }

}