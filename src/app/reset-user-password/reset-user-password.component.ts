import { Component, OnInit, ViewChild } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { ResetUserPasswordService } from '../services/ProviderAdminServices/reset-user-password.service';

@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styleUrls: ['./reset-user-password.component.css']
})
export class ResetUserPasswordComponent implements OnInit {

  /*NgModel*/
  serviceProviderID: any;
  user: any;
  password: any;

  /*Arrays*/
  userNamesList: any = [];
  userDetails: any = [];

  tableMode: Boolean = false;

  /*Patter*/
  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  constructor(private alertService: ConfirmationDialogsService,
    private data_service: dataService,
    private resetUserPasswordService: ResetUserPasswordService) { }

  ngOnInit() {
    this.serviceProviderID = this.data_service.service_providerID;
    this.getAllUserName(this.serviceProviderID);
  }

  /*Fetch all user name*/
  getAllUserName(serviceProviderID) {
    this.resetUserPasswordService.getUserList(serviceProviderID)
      .subscribe(response => {
        console.log('All user name under this provider Success Handeler', response);
        this.userNamesList = response;
      }, err => {
        console.log('Error', err);
      });
  }

  /*Fetch particular user detail*/
  getUserDetail(userName) {
    console.log('getUserDetail', userName);
    this.tableMode = true;
    this.resetUserPasswordService.getUserDetail(userName)
      .subscribe(response => {
        this.userDetails = response;
      }, err => {
        console.log('Error', err);
      });

  }

  /*Reset Password*/
  resetPassword(userName, password) {
    let resetObj = {
      "userName": userName,
      "password": password,
      //"statusID": 1
    }
    console.log("resetObj", resetObj);
    this.resetUserPasswordService.resetUserPassword(resetObj)
      .subscribe(response => {
        this.alertService.alert(response.response);
        this.tableMode = false;
        this.user = null;
        this.password = null;
        this.userDetails = null;
      }, err => {
        console.log('Error', err);
      });
  }
}
