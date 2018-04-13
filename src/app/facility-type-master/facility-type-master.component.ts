import { Component, OnInit, ViewChild } from '@angular/core';
import { FacilityMasterService } from '../services/Inventory/facilitytypemaster.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-facility-type-master',
  templateUrl: './facility-type-master.component.html',
  styleUrls: ['./facility-type-master.component.css']
})
export class FacilityTypeMasterComponent implements OnInit {

  createdBy: any;
  serviceProviderID: any;

  services_array: any = [];
  states_array: any = [];
  facilityMasterList: any = [];
  bufferArray: any[];

  tableMode: boolean = false;
  formMode: boolean = false;
  editMode: boolean = false;

  @ViewChild('facilityAddForm') form: NgForm;
  @ViewChild('faciliTypEditForm') myForm: NgForm;
  constructor(private facility: FacilityMasterService, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.getServices();
  }
  getAllFacilities() {
    this.facility.getfacilities(this.serviceProviderID).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.facilityMasterList = response;
      }
    })
  }
  getServices() {
    this.facility.getServices(this.serviceProviderID).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
      }
    })
  }
  getstates(service) {
    this.facility.getStates(this.serviceProviderID, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }

  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.resetDropdowns();
    }
    else {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.resetDropdowns();
    }

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
  
  resetDropdowns(): any {
    throw new Error("Method not implemented.");
  }
}
