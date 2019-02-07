import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { SwymedUserConfigurationService } from '../services/ProviderAdminServices/swymed-user-service';
@Component({
  selector: 'app-swymed-user-mapping',
  templateUrl: './swymed-user-mapping.component.html',
  styleUrls: ['./swymed-user-mapping.component.css']
})
export class SwymedUserMappingComponent implements OnInit {

  createdBy: any;
  serviceProviderID: any;

  swymedUserDetails: any = [];

  showTable: Boolean = true;

  constructor(
    public swymedUserConfigService: SwymedUserConfigurationService,
    public dataServiceValue: dataService,
    public dialogService: ConfirmationDialogsService,
  ) { }

  ngOnInit() {
    this.createdBy = this.dataServiceValue.uname;
    this.serviceProviderID = this.dataServiceValue.service_providerID;
    this.getAllSwymedUserDetails();
  }
  getAllSwymedUserDetails() {
    this.swymedUserConfigService.getSwymedUserDetails(this.serviceProviderID).subscribe(userResponse => {
      if (userResponse.statusCode == 200) {
        this.swymedUserDetails = userResponse;
      } else {
        console.log("error", userResponse.errorMessage);
      }
    })
  }
  showForm() {
    this.showTable = false;
  }

}
