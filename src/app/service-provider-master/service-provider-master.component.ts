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

  providerName: any;
  primaryName: any;
  primaryNumber: any;
  primaryEmail: any;
  primaryAddress: any;
  address1: any;
  address2: any;

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
  providerNameBeforeEdit: any;
  serviceProviderID: any;

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
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;

      /* resetting ngModels used in editing if moving BACK from edit mode*/
      this.resetNGmodels();

      /* resetting date if moving BACK from edit mode */
      this.today = new Date();
      this.validFrom = this.today;
      this.validTill = this.today;

    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
    }
  }

  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }

  showEditForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = true;
  }

  checkProviderNameAvailability(serviceProviderName) {
    this.superadminService.checkProviderNameAvailability(serviceProviderName)
      .subscribe(response => {
        console.log(response.response, 'Check Provider Name Success Handeler');
        if (response.response.toUpperCase() === 'provider_name_exists'.toUpperCase()) {
          if (this.editMode && this.formMode) {
            if (serviceProviderName.toUpperCase() === this.providerNameBeforeEdit.toUpperCase()) {
              this.providerNameExist = false;
            }
            else {
              this.providerNameExist = true;
            }
          }
          if (this.formMode === true && this.editMode === false) {
            this.providerNameExist = true;
          }
        }
        if (response.response.toUpperCase() === 'provider_name_doesnt_exist'.toUpperCase()) {
          this.providerNameExist = false;
        }
      }, err => {
        this.dialogService.alert(err, 'error');
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
  back() {
    this.dialogService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.showTable();
        this.providerCreationForm.resetForm();
      }
    })
  }
  save(form_value) {
    console.log(form_value, 'Form Value');
    console.log("address", form_value.address2 === undefined ,form_value.address2);
    
    const object = {
      'serviceProviderName': form_value.provider_name,
      'createdBy': this.createdBy,
      'primaryContactName': form_value.contact_person,
      'primaryContactNo': form_value.contact_number,
      'primaryContactEmailID': form_value.email,
      'primaryContactAddress': form_value.address1 + (form_value.address2 === undefined ? "" : ',' + form_value.address2),
      'statusID': '2',
      'validFrom': new Date(this.validFrom - 1 * (this.validFrom.getTimezoneOffset() * 60 * 1000)),
      'validTill': new Date(form_value.valid_till - 1 * (form_value.valid_till.getTimezoneOffset() * 60 * 1000)),
      'deleted': false
    }
console.log("object", object);

    const requestArray = [];
    requestArray.push(object);

    this.superadminService.createProvider(requestArray)
      .subscribe(response => {
        console.log(response, 'Provider Creation Success Handeler');
        if (response.length > 0) {
          this.dialogService.alert('Saved successfully', 'success');

          /* resetting form,ngModels and Dates */
          this.providerCreationForm.reset();
          this.resetNGmodels();
          this.resetDates();

          /* show and refresh table*/
          this.showTable();
          this.getAllProviders();
        }
      }, err => {
        this.dialogService.alert(err, 'error');
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
        this.dialogService.alert(err, 'error');
        console.log('Error', err);
      });
  }

  activate(serviceProviderID) {
    const object = { 'serviceProviderId': serviceProviderID, 'deleted': false };
    this.dialogService.confirm('Confirm', "Are you sure want to Activate?").subscribe((res) => {
      if (res) {
        this.superadminService.deleteProvider(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Activated successfully', 'success');
              /* refresh table */
              this.getAllProviders();
            }
          },
            (err) => {
              this.dialogService.alert(err, 'error');
              console.log(err);
            })
      }
    })
  }

  deactivate(serviceProviderID) {
    const object = { 'serviceProviderId': serviceProviderID, 'deleted': true };
    this.dialogService.confirm('Confirm', "Are you sure want to Deactivate?").subscribe((res) => {
      if (res) {
        this.superadminService.deleteProvider(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Deactivated successfully', 'success');
              /* refresh table */
              this.getAllProviders();
            }
          },
            (err) => {
              this.dialogService.alert(err, 'error');
              console.log(err);
            })
      }
    })
  }

  edit(row) {
    this.showEditForm();
    this.providerNameBeforeEdit = row.serviceProviderName; // saving the existing-name of the Provider before editing
    this.serviceProviderID = row.serviceProviderId;

    this.providerName = row.serviceProviderName;
    this.primaryName = row.primaryContactName;
    this.primaryNumber = row.primaryContactNo;
    this.primaryEmail = row.primaryContactEmailID;
    this.primaryAddress = row.primaryContactAddress;

    this.validFrom = new Date(row.validFrom);
    this.validTill = new Date(row.validTill);

  }

  update(form_value) {
    const object = {
      'serviceProviderId': this.serviceProviderID,
      'serviceProviderName': form_value.provider_name,
      'primaryContactName': form_value.contact_person,
      'primaryContactNo': form_value.contact_number,
      'primaryContactEmailID': form_value.email,
      'primaryContactAddress': form_value.address,
      'validTill': new Date(form_value.valid_till - 1 * (form_value.valid_till.getTimezoneOffset() * 60 * 1000)),
      'modifiedBy': this.createdBy
    }

    this.superadminService.updateProviderDetails(object)
      .subscribe(response => {
        console.log('Edit success callback', response);
        this.dialogService.alert('Updated successfully', 'success');
        /* resetting form and ngModels used in editing */
        this.providerCreationForm.reset();
        this.resetNGmodels();

        /* resetting dates */
        this.resetDates();

        /* showing and refreshing table */
        this.getAllProviders();
        this.showTable();

      }, err => {
        this.dialogService.alert(err, 'error');
        console.log('error', err);
      });
  }

  resetNGmodels() {
    this.providerName = '';
    this.primaryName = '';
    this.primaryNumber = '';
    this.primaryEmail = '';
    this.primaryAddress = '';

    this.address1 = '';
    this.address2 = '';
  }

  resetDates() {
    this.today = new Date();
    this.validFrom = this.today;
    this.validTill = this.today;
  }

}
