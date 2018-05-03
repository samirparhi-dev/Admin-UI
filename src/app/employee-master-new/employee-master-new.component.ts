import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeMasterNewServices } from '../services/ProviderAdminServices/employee-master-new-services.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-employee-master-new',
  templateUrl: './employee-master-new.component.html',
  styleUrls: ['./employee-master-new.component.css']
})

export class EmployeeMasterNewComponent implements OnInit {
  userId: any;
  createdBy: any;
  serviceProviderID: any;

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
  username: any;
  user_password: any;
  doj: any;
  minDate_doj: any;
  community: any;
  religion: any;
  username_status: any;
  showHint: boolean;
  username_dependent_flag: boolean;
  isExistAadhar: boolean = false;
  isExistPan: boolean = false;
  errorMessageForAadhar: string;
  errorMessageForPan: string;
  id: any;
  confirmMessage: any;
  panelOpenState: boolean = true;

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
  checkAddress: any;

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

  //flags
  tableMode = true;
  formMode = false;
  editMode = false;

  //constants & variables
  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  userNamePattern = /^[0-9a-zA-Z]+[0-9a-zA-Z-_.]+[0-9a-zA-Z]$/;
  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

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
      }
    }, (err) => this.dialogService.alert(err, 'error'));
  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.resetDob();

    this.employeeMasterNewService.getCommonRegistrationData().subscribe(res => this.showGenderOnCondition(res),
      (err) => this.dialogService.alert(err, 'error'));

    this.employeeMasterNewService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res),
      (err) => this.dialogService.alert(err, 'error'));

    this.employeeMasterNewService.getAllMaritalStatuses().subscribe(res => this.getAllMaritalStatusesSuccessHandler(res),
      (err) => this.dialogService.alert(err, 'error'));

    this.employeeMasterNewService.getAllQualifications().subscribe(res => this.getAllQualificationsSuccessHandler(res),
      (err) => this.dialogService.alert(err, 'error'));

    this.employeeMasterNewService.getAllCommunities().subscribe(res => this.getCommunitiesSuccessHandler(res),
      (err) => this.dialogService.alert(err, 'error'));

    this.employeeMasterNewService.getAllReligions().subscribe(res => this.getReligionSuccessHandler(res),
      (err) => this.dialogService.alert(err, 'error'));

    this.employeeMasterNewService.getAllStates(this.countryId).subscribe(res => this.getAllStatesSuccessHandler(res),
      (err) => this.dialogService.alert(err, 'error'));

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

    this.dob.setFullYear(this.today.getFullYear() - 20);
    this.maxdate = new Date();
    this.maxdate.setFullYear(this.today.getFullYear() - 20);
    this.mindate = new Date();
    this.mindate.setFullYear(this.today.getFullYear() - 70);
    this.calculateAge(this.dob);
  }
  resetDoj() {
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
        this.resetAllForms();
        this.tableMode = true;
        this.formMode = false;
        this.editMode = false;
      }
    })
  }
  /*
 * calculate the doj based on dob
 */
  calculateDoj(dob) {

    this.today = new Date();
    this.minDate_doj.setFullYear(dob.getFullYear() + 20, dob.getMonth(), dob.getDate());
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
        (err) => this.dialogService.alert(err, 'error'));
  }

  checkUsernameSuccessHandeler(response) {
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
  * calculate age based on the DOB
  */
  calculateAge(date) {
    if (date != undefined) {
      let age = this.today.getFullYear() - date.getFullYear();
      if (this.objs.length == 0) {
        this.age = age;
      }
      else {
        this.userCreationForm.form.patchValue({ 'user_age': age });

      }

      const month = this.today.getMonth() - date.getMonth();
      if (month < 0 || (month === 0 && this.today.getDate() < date.getDate())) {
        age--; //age is ng-model of AGE
        if (this.objs.length == 0) {
          this.age = age;
        }
        else {
          this.userCreationForm.form.patchValue({ 'user_age': age });

        }
      }
    }
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
    console.log('aadharNumber', this.aadharNumber);
    if (this.aadharNumber != undefined && this.aadharNumber != null) {
      if (this.aadharNumber.length == 12) {
        this.employeeMasterNewService.validateAadhar(this.aadharNumber).subscribe(
          (response: any) => {
            this.checkAadharSuccessHandler(response);
          }, (err) => this.dialogService.alert(err, 'error'));
      }
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
    if (this.panNumber != undefined && this.panNumber != null) {
      if (this.panNumber.length == 10) {
        this.employeeMasterNewService.validatePan(this.panNumber).subscribe(
          response => {
            console.log("pan response", response);
            this.checkPanSuccessHandler(response);
          }, (err) => this.dialogService.alert(err, 'error'));
      }
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

    this.employeeMasterNewService.getAllDistricts(currentStateID).subscribe(response => {
      this.getCurrentDistrictsSuccessHandler(response)
    }, (err) => this.dialogService.alert(err, 'error'));
  }
  getCurrentDistrictsSuccessHandler(response) {
    console.log("Display all Districts", response);
    this.currentDistricts = response;
  }
  /*
      * Get all Districts for permanent address 
      */
  getPermanentDistricts(permanentStateID) {
    this.employeeMasterNewService.getAllDistricts(permanentStateID).subscribe(response => {
      this.getPermanentDistrictsSuccessHandler(response)
    }, (err) => this.dialogService.alert(err, 'error'));
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
      this.checkAddress = '';
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
  }
  /*
  * Method for addition of objects
  */
  add_object(userFormValue, demographicsFormValue, communicationFormValue) {

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
      'emergency_contactNo': userFormValue.emergencyContactNo,
      'username': userFormValue.user_name,
      'password': userFormValue.password,
      'doj': userFormValue.doj,
      'fatherName': demographicsFormValue.father_name.trim(),
      'motherName': demographicsFormValue.mother_name.trim(),
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
      'isPermanent': this.isPermanent

    }
    console.log("add objects", tempObj);
    // this.objs.push(tempObj);
    this.checkUserNameAvailability(name);
    this.checkDuplicatesInBuffer(tempObj);
    this.resetAllForms();


  }

  checkDuplicatesInBuffer(tempObj) {
    debugger;
    let duplicateAadhar = 0;
    let duplicatePan = 0;
    let duplicateName = 0
    if (this.objs.length === 0) {
      this.objs.push(tempObj);
    }

    else {
      for (let i = 0; i < this.objs.length; i++) {
        if (this.objs[i].aadharNumber === tempObj.aadharNumber) {
          duplicateAadhar = duplicateAadhar + 1;
          console.log("duplicateAadhar", duplicateAadhar);
        }
        if (this.objs[i].panNumber === tempObj.panNumber) {
          duplicatePan = duplicatePan + 1;
          console.log("duplicatePan", duplicatePan);
        }
        if (this.objs[i].username === tempObj.username) {
          duplicateName = duplicateName + 1;
          console.log("this.duplicateName", duplicateName);
        }
      }
      if (duplicateAadhar === 0 && duplicatePan === 0 && duplicateName === 0) {
        this.objs.push(tempObj);
      }
      else if (duplicateAadhar > 0 && duplicatePan > 0 && duplicateName > 0) {
        this.dialogService.alert("Aadhar, Pan number and Username already exist");
      }
      else if (duplicateAadhar > 0 && duplicatePan > 0) {
        this.dialogService.alert("Aadhar and Pan number already exist");
      }
      else if (duplicateAadhar > 0 && duplicateName > 0) {
        this.dialogService.alert("Aadhar number and Username already exist");
      }
      else if (duplicatePan > 0 && duplicateName > 0) {
        this.dialogService.alert("Pan number and Username already exist");
      }
      else if (duplicateAadhar > 0) {
        this.dialogService.alert("Aadhar number already exist");
      }
      else if (duplicatePan > 0) {
        this.dialogService.alert("Pan number already exist");
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
      this.objs[i].doj.setHours(0);
      this.objs[i].doj.setMinutes(0);
      this.objs[i].doj.setSeconds(0);
      this.objs[i].doj.setMilliseconds(0);
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
        'emergencyContactNo': this.objs[i].emergency_contactNo,
        'userName': this.objs[i].username,
        'password': this.objs[i].password,
        'dOJ': new Date(this.objs[i].doj.valueOf() - 1 * this.objs[i].doj.getTimezoneOffset() * 60 * 1000),
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
        'serviceProviderID': this.serviceProviderID
      }
      reqObject.push(tempObj);
    }
    console.log("Details to be saved", reqObject);
    debugger;
    this.employeeMasterNewService.createNewUser(reqObject).subscribe(response => {
      console.log("response", response);
      // if (response.stat)     
      this.dialogService.alert("Saved successfully", "success");
      this.objs = [];
      this.getAllUserDetails();
      this.showTable();



    }), (err) => this.dialogService.alert(err, 'error');

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
    this.showEditForm();
    if (this.formMode == true && this.editMode == true) {
      this.employeeMasterNewService.getCommonRegistrationData().subscribe(res => this.showGenderOnCondition(res),
        (err) => this.dialogService.alert(err, 'error'));

      this.employeeMasterNewService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res),
        (err) => this.dialogService.alert(err, 'error'));

      this.employeeMasterNewService.getAllMaritalStatuses().subscribe(res => this.getAllMaritalStatusesSuccessHandler(res),
        (err) => this.dialogService.alert(err, 'error'));

      this.employeeMasterNewService.getAllQualifications().subscribe(res => this.getAllQualificationsSuccessHandler(res),
        (err) => this.dialogService.alert(err, 'error'));

      this.employeeMasterNewService.getAllCommunities().subscribe(res => this.getCommunitiesSuccessHandler(res),
        (err) => this.dialogService.alert(err, 'error'));

      this.employeeMasterNewService.getAllReligions().subscribe(res => this.getReligionSuccessHandler(res),
        (err) => this.dialogService.alert(err, 'error'));

      this.employeeMasterNewService.getAllStates(this.countryId).subscribe(res => this.getAllStatesSuccessHandler(res),
        (err) => this.dialogService.alert(err, 'error'));

      this.edit(data);
    }
  }

  edit(data) {
    console.log("data", data);

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
      doj: data.dOJ
    })
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
    debugger;

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
    debugger;
    if (dateOfBirth != undefined) {
      let existDobAge = new Date(dateOfBirth);
      this.age = this.today.getFullYear() - existDobAge.getFullYear();
      const month = this.today.getMonth() - existDobAge.getMonth();
      if (month < 0 || (month === 0 && this.today.getDate() < existDobAge.getDate())) {
        this.age--; //age is ng-model of AGE
      }
    }

  }
  // calculateAgeInEdit(dateOfBirth) {
  //   console.log("dateOfBirth", dateOfBirth);
  //   debugger;
  //   if (dateOfBirth != undefined) {

  //     let existDobAge = new Date(dateOfBirth);
  //     let age = this.today.getFullYear() - existDobAge.getFullYear();

  //       this.age = age;

  //     else {
  //       this.userCreationForm.form.patchValue({ 'user_age': age });

  //     }

  //     const month = this.today.getMonth() - existDobAge.getMonth();
  //     if (month < 0 || (month === 0 && this.today.getDate() < existDobAge.getDate())) {
  //       age--; //age is ng-model of AGE
  //       if (this.objs.length == 0) {
  //         this.age = age;
  //       }
  //       else {
  //         this.userCreationForm.form.patchValue({ 'user_age': age });

  //       }
  //     }
  //   }

  // }



  update(userCreationFormValue, demographicsValue, communicationFormValue) {

    let update_tempObj = {
      'titleID': userCreationFormValue.title_Id,
      'firstName': userCreationFormValue.user_firstname,
      'middleName': userCreationFormValue.user_middlename,
      'lastName': userCreationFormValue.user_lastname,
      'genderID': userCreationFormValue.gender_Id,
      'dOB': new Date(userCreationFormValue.user_dob.valueOf() - 1 * userCreationFormValue.user_dob.getTimezoneOffset() * 60 * 1000),
      //'age': userCreationFormValue.age,
      'age': this.age,
      'contactNo': userCreationFormValue.primaryMobileNo,
      'emailID': userCreationFormValue.primaryEmail,
      'designationID': userCreationFormValue.designation,
      'maritalStatusID': userCreationFormValue.marital_status,
      'aadhaarNo': userCreationFormValue.aadhar_number,
      'pAN': userCreationFormValue.pan_number,
      'qualificationID': userCreationFormValue.edu_qualification,
      'emergencyContactNo': userCreationFormValue.emergencyContactNo,
      'dOJ': new Date(userCreationFormValue.doj.valueOf() - 1 * userCreationFormValue.doj.getTimezoneOffset() * 60 * 1000),
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
      'cityID': 1

    }

    console.log('Data to be update', update_tempObj);

    this.employeeMasterNewService.editUserDetails(update_tempObj).subscribe(response => {
      console.log("updated obj", response);
      this.dialogService.alert('Updated successfully', 'success');
      /* resetting form and ngModels used in editing */
      this.getAllUserDetails();
      this.showTable();

    }, err => { this.dialogService.alert('error', err); });

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
          }, (err) => this.dialogService.alert(err, 'error'))
      }
    },
      (err) => {
        console.log(err);
      })
  }
}









