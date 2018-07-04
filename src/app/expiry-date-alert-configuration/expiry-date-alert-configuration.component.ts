import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { FormBuilder, FormArray, FormGroup,NgForm } from '@angular/forms';
import {ExpiryAlertConfigurationService} from '../services/inventory-services/expiryalertconfiguration.service';

@Component({
  selector: 'app-expiry-date-alert-configuration',
  templateUrl: './expiry-date-alert-configuration.component.html',
  styleUrls: ['./expiry-date-alert-configuration.component.css']
})
export class ExpiryDateAlertConfigurationComponent implements OnInit {
  expiryAlertSearchForm: FormGroup;
  expiryAlertAddForm:FormGroup;
  createButton: boolean = false;
  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  services_array: any = [];
  states_array: any = [];
  categories:any=[];
  bufferArray: any = [];
  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  displayTable: boolean = false;

  constructor(public commonservice:CommonServices,public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,private fb: FormBuilder,private expiryAlertService:ExpiryAlertConfigurationService) { }

  ngOnInit() {
    debugger;
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.expiryAlertSearchForm=this.createExpiryAlertSearchForm();
    this.expiryAlertAddForm=this.createExpiryAlertAddForm();
    this.onServiceLineChange();
    this.onStateChange();
    this.getServices();
    this.createButton = true;
  }
  createExpiryAlertSearchForm() {
    return this.fb.group({
      serviceline: null,
      state: null
    })
  }

  createExpiryAlertAddForm() {
    return this.fb.group({
      servicelineAdd: { value: null, disabled: true },
      stateAdd: { value: null, disabled: true },
      expiryDateAlert: this.fb.group({
      category:null,
      alertonDays:null
    })
  })
  }

  getServices() {
    this.commonservice.getServiceLines(this.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
      }
    })
  }
  onServiceLineChange() {
    this.expiryAlertSearchForm.controls['serviceline'].valueChanges
      .subscribe(value => {
        if (value) {
          this.getstates(value);
        }
      })
  }
  getstates(service) {
    debugger;
    this.commonservice.getStatesOnServices(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }
  onStateChange() {
    this.expiryAlertSearchForm.controls['state'].valueChanges
      .subscribe(value => {
        if (value) {
          this.providerServiceMapID=value.providerServiceMapID;
        }
      })
  }
  getCategories()
  {
    this.expiryAlertService.getAllItemsCategory(this.providerServiceMapID,0).subscribe(response => {
    if (response) {
    console.log('All item category success ', response);
    this.categories = response;
     }
    })
  }
  showForm() {
    debugger;
    this.getCategories();
    this.tableMode = false;
    this.formMode = true;
    //this.editMode = false;
  }
  showTable(){
    this.tableMode=true;
    this.formMode=false;
    this.bufferArray=[];
  }
  add2buffer() {
    debugger;
    if (this.expiryAlertAddForm.valid) {
      let temp = JSON.parse(JSON.stringify(this.expiryAlertAddForm.value));
      if (temp && temp.expiryDateAlert) {
        this.bufferArray.push(temp.expiryDateAlert);
        this.expiryAlertAddForm.controls['expiryDateAlert'].reset();
      }
    } else {
      //this.notificationService.alert("Enter the required field or valid value");
    }
  }
  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }
 }
