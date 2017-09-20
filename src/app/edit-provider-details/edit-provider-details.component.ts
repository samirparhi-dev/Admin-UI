import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { BlockProvider } from './../services/adminServices/AdminServiceProvider/block-provider-service.service';
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

  // variables
  providerID: any;
  providerName: any;

  constructor(public dialogRef: MdDialogRef<EditProviderDetailsComponent>,
    @Inject(MD_DIALOG_DATA) public providerDetails: any, private provider_services: BlockProvider) { }

  ngOnInit() {
    const providerData = this.providerDetails;
    this.setProviderDetails(providerData);

  }
  setProviderDetails(providerData) {
    this.providerID = providerData[0].serviceProviderId;
    this.providerName = providerData[0].serviceProviderName;
    this.primaryName = providerData[0].primaryContactName;
    this.primaryEmail = providerData[0].primaryContactNo;
    this.primaryNo = providerData[0].primaryContactEmailID;
    this.primaryAddress = providerData[0].primaryContactAddress;
    this.secondaryName = providerData[0].secondaryContactName;
    this.secondaryEmail = providerData[0].secondaryContactEmailID;
    this.secondaryNo = providerData[0].secondaryContactNo;
    this.secondaryAddress = providerData[0].secondaryContactNo;
  }
  Edit(item: any) {

    const providerObj = {};
    providerObj['serviceProviderId'] = this.providerID;
    providerObj['serviceProviderName'] = this.providerName;
    providerObj['primaryContactName'] = item.primaryContactName;
    providerObj['primaryContactNo'] = item.primaryContactNo;
    providerObj['primaryContactEmailID'] = item.primaryContactEmailID;
    providerObj['primaryContactAddress'] = item.primaryContactAddress;
    providerObj['secondaryContactName'] = item.secondaryContactName
    providerObj['secondaryContactEmailID'] = item.secondaryContactEmailID;
    providerObj['secondaryContactNo'] = item.secondaryContactNo;
    providerObj['secondaryContactAddress'] = item.secondaryContactNo;
    this.provider_services.editProvider(providerObj).subscribe((res) => {
      alert('Updated Successfully');
    }, (err) => {
      alert('error');
    })
  }

}
