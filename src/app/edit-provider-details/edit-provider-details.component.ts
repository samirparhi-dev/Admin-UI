import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { BlockProvider } from './../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
@Component({
  selector: 'app-edit-provider-details',
  templateUrl: './edit-provider-details.component.html',
  styleUrls: ['./edit-provider-details.component.css']
})
export class EditProviderDetailsComponent implements OnInit {
  // Ng Models
  primaryName: any;
  primaryEmail: any;
  primaryNo: any;
  primaryAddress: any;
  secondaryName: any;
  secondaryEmail: any;
  secondaryNo: any;
  secondaryAddress: any;
  emailPattern: any;
  providerNameExist: any = false;
  providerID: any;
  providerName: any;

  constructor(public dialogRef: MdDialogRef<EditProviderDetailsComponent>, public super_admin_service: SuperAdmin_ServiceProvider_Service,
    private message: ConfirmationDialogsService, public dialog: MdDialog, @Inject(MD_DIALOG_DATA) public providerDetails: any,
    private provider_services: BlockProvider) { }

  ngOnInit() {
    const providerData = this.providerDetails;
    this.setProviderDetails(providerData);
    this.emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;


  }
  setProviderDetails(providerData) {
    console.log(providerData);
    this.providerID = providerData[0].serviceProviderId;
    this.providerName = providerData[0].serviceProviderName;

    this.primaryName = providerData[0].primaryContactName;
    this.primaryEmail = providerData[0].primaryContactEmailID;
    this.primaryNo = providerData[0].primaryContactNo;
    this.primaryAddress = providerData[0].primaryContactAddress;
    this.secondaryName = providerData[0].secondaryContactName;
    this.secondaryEmail = providerData[0].secondaryContactEmailID;
    this.secondaryNo = providerData[0].secondaryContactNo;
    this.secondaryAddress = providerData[0].secondaryContactAddress;
  }
  Edit(item) {
    // let dialog_Ref = this.dialog.open(EditProviderDetailsComponent, {
    //   height: '500px',
    //   width: '900px',
    //   disableClose:  true,
    //   // data: item
    // });
    const providerObj = {};
    providerObj['serviceProviderId'] = this.providerID;
    providerObj['serviceProviderName'] = this.providerName;

    providerObj['primaryContactName'] = item.primaryName;
    providerObj['primaryContactNo'] = item.primaryNo;
    providerObj['primaryContactEmailID'] = item.primaryEmail;
    providerObj['primaryContactAddress'] = item.primaryAddress;

    providerObj['secondaryContactName'] = item.secondaryName;
    providerObj['secondaryContactEmailID'] = item.secondaryEmail;
    providerObj['secondaryContactNo'] = item.secondaryNo;
    providerObj['secondaryContactAddress'] = item.secondaryAddress;

    console.log(providerObj, "EDITED OBJ");

    this.provider_services.editProvider(providerObj).subscribe((res) => {

      console.log(res, "Response after edit");
      this.message.alert('Updated successfully', 'success');

      this.dialogRef.close();
    }, (err) => {
      this.message.alert(err, 'error');
    })
  }
  checkProviderNameAvailability(service_provider_name) {

    this.super_admin_service.checkProviderNameAvailability(service_provider_name)
      .subscribe(response => this.checkProviderNameAvailibilityHandeler(response), err => {
        this.message.alert(err, 'error');
      });
  }

  checkProviderNameAvailibilityHandeler(response) {
    console.log(response.response, 'provider name availability');
    if (response.response == "provider_name_exists") {
      this.providerNameExist = true;
    }
    else {
      this.providerNameExist = false;
    }
  }

}
