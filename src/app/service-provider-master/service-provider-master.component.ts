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
  validFrom: any;
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
      'serviceProviderName': form_value.provider_name,
      'createdBy': this.createdBy,
      'primaryContactName': form_value.contact_person,
      'primaryContactNo': form_value.contact_number,
      'primaryContactEmailID': form_value.email,
      'primaryContactAddress': form_value.address1 + (form_value.address2 === '' ? '' : ',' + form_value.address2),
      'statusID': '2',
      'validFrom': new Date(this.validFrom - 1 * (this.validFrom.getTimezoneOffset() * 60 * 1000)).toJSON(),
      'validTill': new Date(form_value.valid_till - 1 * (form_value.valid_till.getTimezoneOffset() * 60 * 1000)).toJSON(),
      'deleted': false
    }

    let requestArray = [];
    requestArray.push(object);

    this.superadminService.createProvider(requestArray)
      .subscribe(response => {
        console.log(response, 'Provider Creation Success Handeler');
        if (response.length > 0) {
          this.dialogService.alert('Provider created successfully');
          this.providerCreationForm.reset();
          this.showTable();
          this.getAllProviders();
        }
      }, err => {
        console.log(err, 'Error');
      });
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

  activate() {
    this.dialogService.alert('work in progress');
  }

  deactivate() {
    this.dialogService.alert('work in progress');
  }

  edit(row) {
    this.dialogService.alert('work in progress');
  }

}
