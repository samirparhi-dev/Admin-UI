import { Component, OnInit } from '@angular/core';
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

  serviceProviderID: any;
  userID: any;
  createdBy: any;

  userNamesList: any = [];

  constructor(private alertService: ConfirmationDialogsService,
    private data_service: dataService,
   ) { }

  ngOnInit() {
    this.serviceProviderID = this.data_service.service_providerID;
    // this.userID = this.data_service.uid;
    // this.createdBy = this.data_service.uname;
    // this.getUserName(this.serviceProviderID);
  }
  // getUserName(serviceProviderID) {
  //   console.log("serviceProviderID", serviceProviderID);

  //   this.resetUserPasswordService.getUserList(serviceProviderID)
  //     .subscribe(response => {
  //       if (response) {
  //         console.log('All User names under this provider Success Handeler', response);
  //         this.userNamesList = response;
  //       }
  //     }, err => {
  //       console.log('Error', err);
  //     });
  // }
}
