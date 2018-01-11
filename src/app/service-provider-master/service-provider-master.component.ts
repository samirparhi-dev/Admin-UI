import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';

@Component({
  selector: 'app-service-provider-master',
  templateUrl: './service-provider-master.component.html',
  styleUrls: ['./service-provider-master.component.css']
})

/* Created By: Diamond Khanna , 11 Jan,2018
   Intention: Only creates 'New Providers' (without any service-state mappings),
              can view Existing Providers, edit details and can Activate/Deactivate
              the Providers
 */
export class ServiceProviderMasterComponent implements OnInit {

  // ngModel
  validFrom: Date;
  validTill: Date;
  today: Date;

  // array
  searchResult: any = [];

  // flags
  tableMode = true;
  formMode = false;
  editMode = false;
  providerNameExist = false;

  // constants & variables
  emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
  createdBy: any;

  @ViewChild('providerCreationForm') providerCreationForm: NgForm;

  constructor(public superadminService: SuperAdmin_ServiceProvider_Service,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.today = new Date();
    this.validFrom = this.today;
    this.validTill = this.today;

    this.getAllProviders();
  }


  showTable() {
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
  }

  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }

  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }

  checkProviderNameAvailability(serviceProviderName) {
    this.superadminService.checkProviderNameAvailability(serviceProviderName)
      .subscribe(response => {
        console.log(response.response, 'Check Provider Name Success Handeler');
        if (response.response.toUpperCase() === 'provider_name_exists'.toUpperCase()) {
          this.providerNameExist = true;
        }
        if (response.response.toUpperCase() === 'provider_name_doesnt_exist'.toUpperCase()) {
          this.providerNameExist = false;
        }
      }, err => {
        console.log(err, 'Error');
      });
  }

  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  save(form_value) {
    console.log(form_value, 'Form Value');
    let object = {
      'serviceProviderName': 'EXCEprion',
      'createdBy': 'rajeev',
      'joiningDate': '2017-07-14T14:07:05.681Z',
      'stateID': 2,
      'logoFileName': 'raj',
      'logoFilePath': 'ra',
      'primaryContactName': 'rajbaba',
      'primaryContactNo': '1111',
      'primaryContactEmailID': 'xxx@gmail.com',
      'primaryContactAddress': 'blr',
      'primaryContactValidityTillDate': '2017-07-14T14:07:05.681Z',
      'secondaryContactName': 'raj',
      'secondaryContactNo': '233435',
      'secondaryContactEmailID': 'abc@gmail.com',
      'secondaryContactAddress': 'hyd',
      'secondaryContactValidityTillDate': '2017-07-14T14:07:05.681Z',
      'statusID': '1',
      'validFrom': '2017-07-14T14:07:05.681Z',
      'validTill': '2017-07-14T14:07:05.681Z',
      'deleted': false,
      'createdDate': '2017-07-14T14:07:05.681Z',
      'modifiedBy': 'rajeev',
      'lastModDate': 're'
    }
  }

  getAllProviders() {
    this.superadminService.getAllProvider()
      .subscribe(response => {
        if (response) {
          console.log('All Providers Success Handeler', response);
          this.searchResult = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }

}
