import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { BlockProvider } from './../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { SuperAdmin_ServiceProvider_Service } from "../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service";

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
  providerNameExist: any=false;
  providerID: any;
  providerName: any;

  constructor(public dialogRef: MdDialogRef<EditProviderDetailsComponent>,public super_admin_service: SuperAdmin_ServiceProvider_Service,
    @Inject(MD_DIALOG_DATA) public providerDetails: any, private provider_services: BlockProvider) { }

  ngOnInit() {
    const providerData = this.providerDetails;
    this.setProviderDetails(providerData);
        this.emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;


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
    this.secondaryAddress = providerData[0].secondaryContactNo;








  }
  Edit(item: any) {
// {
                  // "serviceProviderId" : "292",
                  // "serviceProviderName":"Diamond BABA BABA abc",
               
//                   "stateId":"1",
//                   "logoFileName":"diamond.png",
//                   "logoFilePath":"google drive",

//                   "primaryContactName":"Neeraj Kumar Singh",
//                  "primaryContactNo" :"12432434",
//                   "primaryContactEmailID":"neeraj.kumar@gmail.com",
//                   "primaryContactAddress":"Village: Indupur, Dist:bhabua, state: bihar, pincode:811302",
                  
//                   "secondaryContactName":"Neeraj Kumar",
//                   "secondaryContactNo":"8197511886",
//                   "secondaryContactEmailID":"neeraj.kumar1@gmail.com",
//                   "secondaryContactAddress":"Village: chaipur, Dist: hai, state: bihar, pincode:811302",

//                   "statusID":"1"
// }
    const providerObj = {};
    providerObj['serviceProviderId'] = this.providerID;
    providerObj['serviceProviderName'] = item.providerName;

    providerObj['primaryContactName'] = item.primaryName;
    providerObj['primaryContactNo'] = item.primaryNo;
    providerObj['primaryContactEmailID'] = item.primaryEmail;
    providerObj['primaryContactAddress'] = item.prinamryAdress;

    providerObj['secondaryContactName'] = item.secondaryName;
    providerObj['secondaryContactEmailID'] = item.secondaryEmail;
    providerObj['secondaryContactNo'] = item.secondaryNo;
    providerObj['secondaryContactAddress'] = item.secondaryAddress;
    debugger;
    this.provider_services.editProvider(providerObj).subscribe((res) => {
      debugger;
      alert('Updated Successfully');
      this.array.push(res);
      // this.setProviderDetails(this.array);
      this.dialogRef.close();
    }, (err) => {
      alert('error');
    })
  }
  array: any=[];
  checkProviderNameAvailability(service_provider_name) {

    this.super_admin_service.checkProviderNameAvailability(service_provider_name)
      .subscribe(response => this.checkProviderNameAvailibilityHandeler(response));
    // for(var i=0; i<this.providerListArray.length; i++) {
    //   if(this.providerListArray[i].serviceProviderName.toLowerCase() === service_provider_name.toLowerCase()){
    //       this.providerNameExist = true;
    //       debugger;
    //   }
    //   else  {
    //     this.providerNameExist = false;
    //   }
    // }

  }

  checkProviderNameAvailibilityHandeler(response) {
    console.log(response.response, 'provider name availability');
    if(response.response == "provider_name_exists") {
      this.providerNameExist = true;
      debugger;
    }
    else {
      this.providerNameExist = false;
    }
  }

}
