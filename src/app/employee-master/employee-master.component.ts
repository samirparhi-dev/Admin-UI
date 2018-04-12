import { Component, OnInit, Inject } from '@angular/core';
import { EmployeeMasterService } from "../services/ProviderAdminServices/employee-master-service.service";
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {

  serviceProviderID: any;
  transfer_obj: any;
  // ngmodel
  state_filter: any;
  service_filter: any;
  role_filter: any;
  name_filter: any;
  employee_id_filter: any;

  // arrays
  states: any = [];
  services: any = [];
  roles: any = [];

  tableitems: any = [];

  // flags
  createEmployeeFlag: boolean;


  constructor(public EmployeeMasterService: EmployeeMasterService,
              public CommonDataService: dataService,
              public dialog: MdDialog,
              private alertService: ConfirmationDialogsService) {
    this.serviceProviderID = this.CommonDataService.service_providerID;

    this.createEmployeeFlag = false;

  }

  ngOnInit() {
    this.EmployeeMasterService.getStatesOfServiceProvider(this.serviceProviderID).subscribe(response => this.getStatesOfServiceProviderSuccessHandeler(response));
  }

  outputHandeler(data)
  {
    console.log("Event Data",data);
    this.createEmployeeFlag=data;
  }

  searchEmployee(state, service, role, empname, empid) {
    console.log(state + "--" + service + "--" + role + "--" + empname + "--" + empid);
    let request_obj = {
      "serviceProviderID": this.serviceProviderID,
      "pSMStateID": state,
      "serviceID": service,
      "roleID": role,
      "userName": empname,
      "userID": empid
    }
    if (request_obj.pSMStateID === undefined||request_obj.pSMStateID==="") {
      request_obj.pSMStateID = null;
    }
    if (request_obj.serviceID === undefined||request_obj.serviceID==="") {
      request_obj.serviceID = null;
    }
    if (request_obj.roleID === undefined||request_obj.roleID ==="") {

      request_obj.roleID = null;
    }
    if (request_obj.userName === undefined||request_obj.userName==="") {

      request_obj.userName = null;
    }
    else {
      request_obj.userName = "%" + request_obj.userName + "%";
    }
    if (request_obj.userID === undefined || request_obj.userID === "") {

      request_obj.userID = null;
    }
    console.log(request_obj, "reqOBJ");
    this.EmployeeMasterService.getEmployees(request_obj).subscribe(response => this.getEmployeesSuccessHandeler(response));
  }

  clear()
  {
    this.state_filter="";
    this.service_filter="";
    this.role_filter="";
    this.name_filter="";
    this.employee_id_filter="";

    this.services=[];
    this.roles=[];

    this.tableitems=[];
  }

  changeFlagValue(boolean_value) {
    this.createEmployeeFlag = boolean_value;
  }


  getServices(stateID) {
    console.log(this.serviceProviderID, stateID);
    this.EmployeeMasterService.getServices(this.serviceProviderID, stateID).subscribe(response => this.servicesSuccesshandeler(response));
  }

  getRoles(stateID, serviceID) {
    this.EmployeeMasterService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe(response => this.rolesSuccesshandeler(response));
  }

  deleteUser(usrMapingId) {
    // let confirmation = confirm("do you want to delete this role ???");
    this.alertService.confirm('Confirm',"Are you sure you want to delete this role ?").subscribe((res) => {
      if (res) {
        this.EmployeeMasterService.deleteEmployeeRole(usrMapingId).subscribe(response => this.userDeleteHandeler(response));
      }
    },
    (err) => {
      console.log(err);
    })
  }

  editeUser(toBeEditedObject) {
    // let confirmation = confirm("do you want to edit the user with employeeID as " + toBeEditedObject.userID + "???");
    this.alertService.confirm('Confirm',"Do you want to edit the details of " + toBeEditedObject.firstName + " " + toBeEditedObject.lastName + "?").subscribe(res => {
      if (res) {
        console.log(JSON.stringify(toBeEditedObject));

        let dialog_Ref = this.dialog.open(EditEmployeeDetailsModal, {
          height: '500px',
          width: '800px',
          data: toBeEditedObject
        });

        dialog_Ref.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result === 'success') {
            this.searchEmployee(this.state_filter, this.service_filter, this.role_filter, this.name_filter, this.employee_id_filter);
          }

        });
      }
    },
    (err) => {
      console.log(err);
    })
  }

  getStatesOfServiceProviderSuccessHandeler(response) {
    console.log(response, 'states of provider');
    this.states = response;
  }

  servicesSuccesshandeler(response) {
    console.log(response, 'services of provider');
    this.services = response;
  }

  rolesSuccesshandeler(response) {
    console.log(response, 'roles of provider for that state');
    this.roles = response;
  }

  getEmployeesSuccessHandeler(response) {
    console.log(response, 'employees fetched as per condition');
    this.tableitems = response.filter(function (obj) {
      return obj.uSRMDeleted == false && obj.roleName != 'ProviderAdmin';
    });
  }

  userDeleteHandeler(response) {
    this.alertService.alert('User deleted successfully');
    console.log(response, 'user delete successfully');
    this.searchEmployee(this.state_filter, this.service_filter, this.role_filter, this.name_filter, this.employee_id_filter);
  }



}




@Component({
  selector: 'editEmployeeDetailsModalWindow',
  templateUrl: './editEmployeeDetailsModal.html',
})
export class EditEmployeeDetailsModal {
  // modal windows ngmodels 
  m_firstname: any;
  m_lastname: any;
  m_address1: any;
  m_address2: any;
  m_middlename: any;
  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
              public EmployeeMasterService: EmployeeMasterService, public CommonDataService: dataService,
              public dialog_Ref: MdDialogRef<EditEmployeeDetailsModal>,
              private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.m_firstname = this.data.firstName;
    this.m_lastname = this.data.lastName;
    this.m_address1 = this.data.userAddressLine1;
    this.m_address2 = this.data.userAddressLine2;
    this.m_middlename = this.data.middleName;
    console.log(this.data, 'modal content');
  }


  update() {
    let today = new Date();
    // this.data.firstName = this.m_firstname;
    // this.data.lastName = this.m_lastname;
    // this.data.userAddressLine1 = this.m_address1;
    // this.data.userAddressLine2 = this.m_address2;
    const edit_req_obj = {
      'userID': this.data.userID,
      'titleID': this.data.titleID,
      'firstName': this.m_firstname,
      'middleName': this.m_middlename,
      'lastName': this.m_lastname,
      'genderID': this.data.genderID,
      'maritalStatusID': this.data.maritalStatusID,
      'aadhaarNo': this.data.aadhaarNo,
      'pAN': this.data.pAN,
      'dOB': this.data.dOB, // new Date((this.data.dOB) - 1 * (this.data.dOB.getTimezoneOffset() * 60 * 1000)).toJSON(),

      'dOJ': this.data.dOJ,
      'qualificationID': this.data.qualificationID,
      'userName': this.data.userName,
      'agentID': this.data.agentID,
      'emailID': this.data.emailID,
      'statusID': this.data.statusID,
      'emergencyContactPerson': this.data.emergencyContactPerson,
      'emergencyContactNo': this.data.emergencyContactNo,
      // 'titleName': this.data.titleName,
      'status': this.data.userStatus,
      'qualificationName': this.data.qualification,
      'createdBy': this.CommonDataService.uname,
      'modifiedBy': this.CommonDataService.uname,
      'password': this.data.password,
      'agentPassword': this.data.agentPassword,
      'createdDate': today,
      'fathersName': this.data.fathersName,
      'mothersName': this.data.mothersName,
      'addressLine1': this.m_address1,
      'addressLine2': this.m_address2,
      'addressLine3': this.data.userAddressLine3,
      'addressLine4': this.data.userAddressLine4,
      'addressLine5': this.data.userAddressLine5,
      'cityID': this.data.userCityID,
      'stateID': this.data.userStateID,
      'communityID': this.data.communityID,
      'religionID': this.data.religionID,
      'countryID': this.data.userCountryID,
      'pinCode': this.data.pinCode,
      'isPresent': '0',
      'isPermanent': '1',
      // 'oldLanguageID': '1',
      // 'newLanguageID': '3',
      // 'oldRoleId': this.data.roleID,
      // 'newRoleId': this.data.roleID,
      // "weightage" : 20,
      // "roleID": this.data.roleID,
      'serviceProviderID': this.data.serviceProviderID,
      'providerServiceMapID': this.data.providerServiceMapID,
      'workingLocationID': this.data.workingLocationID,
    }

    // let robj = {
    // 	"userID": this.data.userID,
    // 	"titleID": 1,
    // 	"firstName": this.m_firstname,
    // 	"middleName": "",
    // 	"lastName": this.m_lastname,
    // 	"genderID": 1,
    // 	"maritalStatusID": 1,
    // 	"aadhaarNo": this.data.aadhaarNo,
    // 	"pAN": this.data.pAN,
    // 	"dOB": "",
    // 	"dOJ": "",
    // 	"qualificationID": 1,
    // 	"userName": this.data.userName,
    // 	"agentID": "",
    // 	"emailID": "",
    // 	"statusID": 2,
    // 	"emergencyContactPerson": "",
    // 	"emergencyContactNo": "",
    // 	"titleName": "",
    // 	"status": "Active",
    // 	"qualificationName": "",
    // 	"createdBy": "",
    // 	"modifiedBy": "",
    // 	"password": this.data.password,
    // 	"agentPassword": "",
    // 	"createdDate": "",
    // 	"fathersName": "",
    // 	"mothersName": "",
    // 	"addressLine1": "",
    // 	"addressLine2": "",
    // 	"addressLine3": "",
    // 	"addressLine4": "",
    // 	"addressLine5": "",
    // 	"cityID": "",
    // 	"stateID": this.data.userStateID,
    // 	"communityID": "",
    // 	"religionID": "",
    // 	"countryID": "",
    // 	"pinCode": "",
    // 	"isPresent": "",
    // 	"isPermanent": "",
    // 	"oldLanguageID": "",
    // 	"newLanguageID": "",
    // 	"oldRoleId": 2,
    // 	"newRoleId": 2,
    // 	"serviceProviderID": this.data.serviceProviderID,
    // 	"providerServiceMapID": this.data.providerServiceMapID,
    // 	"workingLocationID": this.data.workingLocationID
    // }


    console.log(this.data, 'edit rwq obj in modal');


    this.EmployeeMasterService.editEmployee(edit_req_obj)
    .subscribe(response => this.editEmployeeDetailsSuccessHandeler(response));

  }

  editEmployeeDetailsSuccessHandeler(response) {
    this.alertService.alert('Employee details edited successfully');
    console.log('edited', response);
    this.dialog_Ref.close('success');
  }



}

