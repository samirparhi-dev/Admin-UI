import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { debug } from 'util';

@Component({
  selector: 'app-provider-admin-list',
  templateUrl: './provider-admin-list.component.html',
  styleUrls: ['./provider-admin-list.component.css']
})
export class ProviderAdminListComponent implements OnInit {


  //ngModel

  titleID: any;
  admin_firstName: any;
  admin_middleName: any;
  admin_lastName: any;
  gender: any;
  genderID: any;
  dob: any;
  age: number;
  primaryMobileNumber: any;
  primaryEmail: any;
  marital_status: any;
  aadharNumber: any;
  panNumber: any;
  edu_qualification: any;
  emergency_cnt_person: any;
  emergencyMobileNumber: any;
  username: any;
  user_password: any;
  today = new Date();
  mindate: any;
  maxdate: any;
  admin_remarks: any;
  username_status: any;
  showHint: boolean;
  username_dependent_flag: boolean;
  isExistAadhar: boolean = false;
  isExistPan: boolean = false;
  idMessage: string;

  resetAge: number = 0;
  userID: any;
  confirmMessage: any;
  createdBy: any;
  usernameBeforeEdit: any;


  //flags

  tableMode = true;
  formMode = false;
  editMode = false;
  showTableFlag: boolean = false;
  // adminNameExists: boolean = false;

  //array

  searchResult: any = [];
  titles: any = [];
  genders: any = [];
  genderName: any = [];
  maritalStatus: any = [];
  eduQualification: any = [];
  objs: any = [];
  adminNameArray = [];
  searchResultArray: any = [];
  allProviderAdmin: any = [];

  userNamePattern = /^[0-9a-zA-Z]+[0-9a-zA-Z-_.]+[0-9a-zA-Z]$/;
  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  @ViewChild('providerAdminCreationForm') providerAdminCreationForm: NgForm;
  @ViewChild('adminCredentialsForm') adminCredentialsForm: NgForm;

  constructor(public superadminService: SuperAdmin_ServiceProvider_Service,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,
    public dialog: MdDialog) {
    this.showHint = false;
    this.username_dependent_flag = true;
  }

  ngOnInit() {

    this.getAllProviderAdminDetails();
  }

  /*
   * All details of the provider admin
   */

  getAllProviderAdminDetails() {
    this.superadminService.getAllProviderAdmin().subscribe(response => {
      if (response) {
        console.log("All details of provider admin", response);
        this.searchResult = response;
      }
    }, err => {
      console.log("Error", err);
    })
  }

  /*
  * Listing the default values for title, gender, marital status and educational qualification
  */
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.dob = new Date();
    this.dob.setFullYear(this.today.getFullYear() - 20);
    this.maxdate=new Date();
    this.maxdate.setFullYear(this.today.getFullYear() - 20);
    this.mindate=new Date();
    this.mindate.setFullYear(this.today.getFullYear() - 70);
    this.superadminService.getCommonRegistrationData().subscribe(response => this.showGenderOnCondition(response));
    this.superadminService.getAllQualifications().subscribe(response => this.getEduQualificationSuccessHandler(response));
    this.superadminService.getAllMaritalStatus().subscribe(response => this.showAllMaritalSuccessHandler(response));
  }
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
    }
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
    this.superadminService
      .checkUserAvailability(username)
      .subscribe(response => this.checkUsernameSuccessHandeler(response));
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

  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  /*
  * Display gender on condition
  */

  setGenderOnCondition() {
    if (this.titleID == 2 || this.titleID == 4 || this.titleID == 5 || this.titleID === 13) {
      this.gender = 2;
    }
    else if (this.titleID == 3 || this.titleID == 8) {
      this.gender = 1;
    }
    else {
      this.gender = "";
    }
  }
  showGenderOnCondition(response) {
    console.log("Display gender on condition", response);
    this.titles = response.m_Title;
    this.genders = response.m_genders;
  }

  /*
  * List the qualification details
  */
  getEduQualificationSuccessHandler(response) {
    console.log(response, "admin qualification");
    this.eduQualification = response;
  }
  /*
  * List the marital status
  */
  showAllMaritalSuccessHandler(response) {
    console.log(response, "marital status");
    this.maritalStatus = response;
    console.log("result", this.maritalStatus);
  }
  /*
    * Check Uniqueness in Aadhar
    */
  checkAadhar() {
    if (this.aadharNumber.length == 12) {
      this.superadminService.validateAadhar(this.aadharNumber).subscribe(
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
      this.superadminService.validatePan(this.panNumber).subscribe(
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
  resetAllForms() {
    this.providerAdminCreationForm.resetForm();
    this.adminCredentialsForm.resetForm();
  }
  /*
   * Method for addition of objects 
   */
  add_object(providerAdminData, adminCredentials) {
    console.log("providerAdmin", providerAdminData);
    console.log("user", adminCredentials);
    
    
    var tempObj = {
      'titleID': providerAdminData.title_Id,
      'admin_firstName': providerAdminData.firstName,
      'admin_middleName': providerAdminData.middleName,
      'admin_lastName': providerAdminData.lastName,
      'genderID': providerAdminData.adminGender,
      'dob': providerAdminData.admin_dob,
      // 'age': providerAdminData.age,
      'primaryMobileNumber': providerAdminData.contact_number,
      'primaryEmail': providerAdminData.email,
      'maritalStatusID': providerAdminData.admin_maritalStatusId,
      'aadhaarNo': providerAdminData.aadhar_number,
      'pAN': providerAdminData.pan_number,
      'edu_qualification': providerAdminData.admin_edu_qualification,
      'emergency_cnt_person': providerAdminData.em_contact_person,
      'emergencyMobileNumber': providerAdminData.em_contact_number,
      'username': adminCredentials.user_name,
      'password': adminCredentials.password,
      'admin_remarks': adminCredentials.remarks,

    }
    console.log("add objects", tempObj);
    this.objs.push(tempObj);
    this.checkUserNameAvailability(name);
    this.resetAllForms();

  }
  /*
  * Removing single object
  */
  remove_obj(index) {
    this.objs.splice(index, 1);
  }
  /*
  * Clear all the data
  */
  // clearAll() {
  //   this.providerAdminCreationForm.resetForm();
  //   this.adminCredentialsForm.resetForm();
  // }
  /*
  * provider creation
  */
  createProviderAdmin() {
    var reqObject = [];
    for (var i = 0; i < this.objs.length; i++) {
      var tempObj = {
        'titleID': this.objs[i].titleID,
        'firstName': this.objs[i].admin_firstName,
        'middleName': this.objs[i].admin_middleName,
        'lastName': this.objs[i].admin_lastName,
        'genderID': this.objs[i].genderID,
        'dOB': this.objs[i].dob,
        //  'age': this.objs[i].age,
        'contactNo': this.objs[i].primaryMobileNumber,
        'emailID': this.objs[i].primaryEmail,
        'maritalStatusID': this.objs[i].maritalStatusID,
        'aadhaarNo': this.objs[i].aadhaarNo,
        'pAN': this.objs[i].pAN,
        'qualificationID': this.objs[i].edu_qualification,
        'emergencyContactPerson': this.objs[i].emergency_cnt_person,
        'emergencyContactNo': this.objs[i].emergencyMobileNumber,
        'userName': this.objs[i].username,
        'password': this.objs[i].password,
        'remarks': this.objs[i].admin_remarks,
        'createdBy': "Admin",
        'isProviderAdmin': "true"
      }
      reqObject.push(tempObj);
    }
    console.log(reqObject, "details to be saved");
    this.superadminService.createProviderAdmin(reqObject).subscribe(response => {
      console.log("response", response);
      this.editMode = false;
      this.dialogService.alert("Provider Admin Created successfully");
      this.objs = [];
      this.getAllProviderAdminDetails();

    })

  }
  /*
   * Editing provider admin details
   */
  editProviderAdmin(item) {
    console.log("Existing Data", item);
    let dialog_Ref = this.dialog.open(EditProviderAdminModal, {
      height: '500px',
      width: '900px',
      data: item
    });
    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.dialogService.alert("Admin Details edited successfully");
        this.getAllProviderAdminDetails();
      }
    });
  }

  /*
   * Activation and deactivation of the provider admin
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
    this.dialogService.confirm("Are you sure want to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log("Obj", obj);
        this.superadminService.delete_toggle_activation(obj)
          .subscribe((res) => {
            console.log('response', res);
            this.dialogService.alert(this.confirmMessage + "d successfully");
            this.getAllProviderAdminDetails();
          },
            (err) => {
              console.log(err);
            })
      }
    },
      (err) => {
        console.log(err);
      })
  }

}








@Component({
  selector: 'EditProviderAdminModal',
  templateUrl: './edit-provider-admin-list.html',
  styleUrls: ['./provider-admin-list.component.css']
})
export class EditProviderAdminModal {

  //ngModel

  titleID: any;
  admin_firstName: any;
  admin_middleName: any;
  admin_lastName: any;
  gender: any;
  dob: any;
  age: number;
  primaryMobileNumber: any;
  primaryEmail: any;
  marital_status: any;
  aadharNumber: any;
  panNumber: any;
  edu_qualification: any;
  emergency_cnt_person: any;
  emergencyMobileNumber: any;
  admin_remarks: any;
  today = new Date();
  mindate: any;
  maxdate: any;
  formMode: boolean = true;
  isExistAadhar: boolean = false;
  isExistPan: boolean = false;
  idMessage: string;

  // arrays
  genders: any = [];
  genderID: any = [];
  titles: any = [];
  eduQualification: any = [];
  maritalStatus: any = [];
  allProviderAdmin: any = [];


  @ViewChild('editAdminCreationForm') editAdminCreationForm: NgForm;

  constructor(@Inject(MD_DIALOG_DATA) public data, public dialog: MdDialog,
    public superadminService: SuperAdmin_ServiceProvider_Service,
    public dialogRef: MdDialogRef<EditProviderAdminModal>,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    console.log("Initial value", this.data);
    this.superadminService.getCommonRegistrationData().subscribe(response => this.showGenderOnCondition(response));
    this.superadminService.getAllQualifications().subscribe(response => this.getEduQualificationSuccessHandler(response));
    this.superadminService.getAllMaritalStatus().subscribe(response => this.showAllMaritalSuccessHandler(response));
    this.edit();
  }

  edit() {

    this.titleID = this.data.titleID;
    this.admin_firstName = this.data.firstName;
    this.admin_middleName = this.data.middleName;
    this.admin_lastName = this.data.lastName;
    this.gender = this.data.genderID;
    this.primaryMobileNumber = this.data.contactNo;
    this.primaryEmail = this.data.emailID;
    this.age = this.data.age;
    this.dob = this.data.dOB;
    this.marital_status = this.data.maritalStatusID;
    this.aadharNumber = this.data.aadhaarNo;
    this.panNumber = this.data.pAN;
    this.edu_qualification = this.data.qualificationID;
    this.emergency_cnt_person = this.data.emergencyContactPerson;
    this.emergencyMobileNumber = this.data.emergencyContactNo;
    this.admin_remarks = this.data.remarks;

  }
  /*
 * Display gender on condition
 */

  setGenderOnCondition() {
    if (this.titleID == 2 || this.titleID == 4 || this.titleID == 5 || this.titleID === 13) {
      this.gender = 2;
    }
    else if (this.titleID == 3 || this.titleID == 8) {
      this.gender = 1;
    }
    else {
      this.gender = "";
    }
  }
  showGenderOnCondition(response) {
    console.log("Display gender on condition", response);
    this.titles = response.m_Title;
    this.genders = response.m_genders;
  }
  /*
    * Calculate age
    */
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
 * Success Handlers
 */
  getAllProviderAdminDetailsSuccessHandler(response) {
    console.log("All provider details", response);
    this.allProviderAdmin = response;
  }
  getEduQualificationSuccessHandler(response) {
    console.log("Admin qualification", response);
    this.eduQualification = response;
  }
  showAllMaritalSuccessHandler(response) {
    console.log("Marital status", response);
    this.maritalStatus = response;
  }
    /*
    * Check Uniqueness in Aadhar
    */
   checkAadhar() {
    if (this.aadharNumber.length == 12) {
      this.superadminService.validateAadhar(this.aadharNumber).subscribe(
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
      this.superadminService.validatePan(this.panNumber).subscribe(
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

  update() {
    var update_tempObj = {
      'titleID': this.titleID,
      'firstName': this.admin_firstName,
      'middleName': this.admin_middleName,
      'lastName': this.admin_lastName,
      'genderID': this.gender,
      'dob': this.dob,
      //  'age': this.age,
      'contactNo': this.primaryMobileNumber,
      'emailID': this.primaryEmail,
      'maritalStatusID': this.marital_status,
      'aadhaarNo': this.aadharNumber,
      'pAN': this.panNumber,
      'qualificationID': this.edu_qualification,
      'emergencyContactPerson': this.emergency_cnt_person,
      'emergencyContactNo': this.emergencyMobileNumber,
      'remarks': this.admin_remarks,
      'userID': this.data.userID,     
      'modifiedBy': this.data.createdBy

    }   
    this.superadminService.updateProviderAdmin(update_tempObj).subscribe(response => {
     console.log("Data to be update", response);
      this.dialogRef.close("success");

    })


  }


}


