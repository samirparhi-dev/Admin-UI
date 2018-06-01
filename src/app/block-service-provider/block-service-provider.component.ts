import { HostListener } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
declare let jQuery: any;
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-block-service-provider',
  templateUrl: './block-service-provider.component.html',
  styleUrls: ['./block-service-provider.component.css']
})
export class BlockServiceProviderComponent implements OnInit {

  data: any = [];
  showBlock: boolean = false;
  showUnblock: boolean = false;
  status_array = [];
  service_provider_array: any = [];
  states_array: any = [];
  services_array: any = [];
  stateProviderArray: any = [];
  pastValue: any = [];
  userEnteredWord: any;

  // ngModels

  service_provider: any;
  state: any;
  serviceline: any;

  // flags
  showTable: boolean;
  case_one: boolean;
  case_two: boolean;
  case_three: boolean;
  case_four: boolean;
  show_card: boolean = false;
  isNational = false;
  status: any;
  reason: any;

  @ViewChild('statusSettingFields') _statusSettingFields: NgForm;

  constructor(public block_provider: BlockProvider, private message: ConfirmationDialogsService) {
    //this.service_provider = '';
    // this.state = '';
    // this.serviceline = '';
    this.showTable = false;

    this.case_one = false;
    this.case_two = false;
    this.case_three = false;
    this.case_four = false;
  }

  ngOnInit() {
    this.block_provider.getAllProviders().subscribe(response => this.getAllProvidersSuccesshandeler(response), err => {
      console.log("Error", err);
     // this.message.alert(err, 'error');
    });
    this.block_provider.getAllStatus().subscribe(response => this.getSuccess(response), err => {
      console.log("Error", err);
      //this.message.alert(err, 'error');
    });
  }

  setIsNationalFlag(value) {
    if (value) {
      this.state = '';
    }
    this.isNational = value;
    this.getStatus(this.service_provider, this.state, this.serviceline);

  }

  getSuccess(response: any) {
    console.log("status", response);
    this.status_array = response;
    let index = 0;
    for (let i = 0; i < this.status_array.length; i++) {
      if (this.status_array[i].status === "New") {
        index = i;
        break;
      }
    }

    this.status_array.splice(index, 1);
  }

  // ** Smart Search Logic ** added by Krishna Gunti ** //

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent): void {
  //   this.selectKeyPress(event);
  // }
  selectKeyPress($event) {
    let firstWordMatchingStatus = 0;
    if ($event.keyCode !== 123)   // To elemenate '{' which key is 123 from the word
    {
      var char = String.fromCharCode($event.keyCode);
      if ($event.keyCode === 8)  // Back space key logic
      {
        if (this.userEnteredWord !== undefined) this.userEnteredWord = this.userEnteredWord.slice(0, -1);
      }
      else  // formation of a word from user entered keys
      {
        this.userEnteredWord === undefined ? this.userEnteredWord = char : this.userEnteredWord += char;
      }
      if (/[a-zA-Z]/.test(this.userEnteredWord)) // allowing only alphabets from keys
      {
        for (var i = 0; i < this.service_provider_array.length; i++) {
          if (this.service_provider_array[i].serviceProviderName.toLowerCase().startsWith(String(this.userEnteredWord.toLowerCase()))) {
            if (firstWordMatchingStatus === 0) {
              firstWordMatchingStatus = 1;
              this.stateProviderArray = [];
            }
            this.stateProviderArray.push(this.service_provider_array[i]); // loading matched usernames
          }
        }
        if (firstWordMatchingStatus === 0) {
          this.loadingValues(); // clearing user the user entered key and reloading the array from DB
        }
      }
      else {
        this.loadingValues();
      }
    }
  }
  loadingValues() {
    this.userEnteredWord = undefined;
    this.stateProviderArray = Object.assign([], this.service_provider_array);
  }

  //** end **/

  getStates(serviceProviderID) {
    debugger;
    this.block_provider.getStates(serviceProviderID).subscribe(response => {
      this.getStatesSuccesshandeler(response);
      this.getAllServicesOfProvider(serviceProviderID);
      this.getStatus(this.service_provider, this.state, this.serviceline);
      //-- added by krishna Gunti for smart search --//
      this.loadingValues();
    }, err => {
      console.log("Error", err);
      //this.message.alert(err, 'error');
    });
  }


  getAllServicesOfProvider(serviceProviderID) {
    this.block_provider.getServicesOfProvider(serviceProviderID)
      .subscribe(response => this.getAllServicesOfProviderSuccesshandeler(response), err => {
        console.log("Error", err);
        //this.message.alert(err, 'error');
      });

  }

  getServicesInState(serviceProviderID, stateID) {

    this.getStatus(this.service_provider, this.state, this.serviceline);
    // this.block_provider.getServicesInState(serviceProviderID, stateID)
    //   .subscribe(response => this.getServicesInStatesSuccesshandeler(response));


  }
  // success handelers
  reset() {
    this.state = '';
    this.serviceline = '';
    this.states_array = [];
    this.services_array = [];
  }
  resetForm() {
    this.message.confirm('Confirm', 'Are you sure want to clear?').subscribe((response) => {
      if (response) {
        jQuery('#myForm').trigger('reset');
        this.data = [];
        this.states_array = [];
        this.services_array = [];
        this.showTable = false;
        this.case_one = false;
        this.case_two = false;
        this.case_three = false;
        this.case_four = false;
      }
    }, (err) => { });
  }

  getAllProvidersSuccesshandeler(response) {
    this.service_provider_array = response;
    this.stateProviderArray = this.service_provider_array;
  }

  getStatesSuccesshandeler(response) {
    this.reset();
    this.states_array = response;
    this.stateProviderArray = this.service_provider_array;
  }

  getAllServicesOfProviderSuccesshandeler(response) {
    this.serviceline = '';
    this.isNational = false;
    this.services_array = response;
    this.getStatus(this.service_provider, this.state, this.serviceline);
  }

  getServicesInStatesSuccesshandeler(response) {
    this.serviceline = '';
    this.services_array = response;
    this.getStatus(this.service_provider, this.state, this.serviceline)
  }

  // Get STATUS function 

  getStatus(service_provider, state, serviceline) {

    this.showTable = true;
    this.show_card = true;

    if (service_provider != '' && service_provider != null && (state === '' || state === undefined) && (serviceline === '' || serviceline === undefined)) {
      this.case_one = true;
      this.case_two = false;
      this.case_three = false;
      this.case_four = false;

      this.getStatusOnProviderLevel(service_provider);
    }
    if (service_provider != '' && service_provider != null && state != '' && state != null && (serviceline === '' || serviceline === undefined)) {
      this.case_one = false;
      this.case_two = true;
      this.case_three = false;
      this.case_four = false;

      this.getStatusOnProviderStateLevel(service_provider, state);
    }
    if (service_provider != '' && service_provider != null && state === '' && serviceline != '' && serviceline != null) {
      this.case_one = false;
      this.case_two = false;
      this.case_three = true;
      this.case_four = false;

      this.getStatusOnProviderServiceLevel(service_provider, serviceline);
    }
    if (service_provider != '' && state != '' && serviceline != '' && service_provider != null && state != null && serviceline != null) {
      this.case_one = false;
      this.case_two = false;
      this.case_three = false;
      this.case_four = true;

      this.getStatusOnProviderStateServiceLevel(service_provider, state, serviceline);
    }
  }


  getStatusOnProviderLevel(service_provider) {
    this.block_provider.getProviderLevelStatus(service_provider).subscribe(response => this.successhandeler1(response), err => {
      console.log("Error", err);
      //this.message.alert(err, 'error');
    });
  }

  getStatusOnProviderServiceLevel(service_provider, serviceline) {
    this.block_provider.getProvider_ServiceLineLevelStatus(service_provider, serviceline)
      .subscribe(response => this.successhandeler2(response), err => {
        console.log("Error", err);
        //this.message.alert(err, 'error');
      });
  }

  getStatusOnProviderStateLevel(service_provider, state) {
    this.block_provider.getProvider_StateLevelStatus(service_provider, state)
      .subscribe(response => this.successhandeler3(response), err => {
        console.log("Error", err);
       // this.message.alert(err, 'error');
      });
  }

  getStatusOnProviderStateServiceLevel(service_provider, state, serviceline) {
    this.block_provider.getProvider_State_ServiceLineLevelStatus(service_provider, state, serviceline)
      .subscribe(response => this.successhandeler4(response), err => {
        console.log("Error", err);
        //this.message.alert(err, 'error');
      });
  }

  successhandeler1(response) {
    // this._statusSettingFields.reset();
    console.log(response, 'RESPONSE');
    this.data = response;
  }

  successhandeler2(response) {
    // this._statusSettingFields.reset();
    console.log(response, 'RESPONSE');
    this.data = response;
  }

  successhandeler3(response) {
    //  this._statusSettingFields.reset();
    console.log(response, 'RESPONSE');
    this.data = response;
  }

  successhandeler4(response) {
    // this._statusSettingFields.reset();

    console.log(response, 'RESPONSE');
    this.data = response;
  }

  // blocking

  blockProvider() {
    let serviceProviderID = this.data[0].serviceProviderID;
    let statusID = this.status;
    let reason = this.reason;// needs to be 3, but as of now being sent as 2 for checking as no val in table
    this.block_provider.block_unblock_provider(serviceProviderID, statusID, reason)
      .subscribe(response => this.block_unblock_providerSuccessHandeler(response), err => {
        console.log("Error", err);
       // this.message.alert(err, 'error');
      });
  }

  block_unblock_providerSuccessHandeler(response) {
    console.log('b u provider success handeler', response);
    this.message.alert('Updated successfully', 'success');
    this.getStatusOnProviderLevel(response[0].serviceProviderID);
    this.getStates(this.service_provider);
  }

  blockState() {
    let serviceProviderID = this.data[0].serviceProviderID;
    let statusID = this.status;
    let stateID = this.data[0].stateID;
    let reason = this.reason;
    this.block_provider.block_unblock_state(serviceProviderID, stateID, statusID, reason)
      .subscribe(response => this.block_unblock_stateSuccessHandeler(response), err => {
        console.log("Error", err);
        //this.message.alert(err, 'error');
      });
  }

  block_unblock_stateSuccessHandeler(response) {
    console.log('b u state success handeler', response);
    this.message.alert('Updated successfully', 'success');
    this.getStatusOnProviderStateLevel(response[0].serviceProviderID, response[0].stateID);
  }

  blockService() {
    let serviceProviderID = this.data[0].serviceProviderID;
    let statusID = this.status;
    let serviceID = this.data[0].serviceID;
    let reason = this.reason;
    this.block_provider.block_unblock_serviceline(serviceProviderID, serviceID, statusID, reason)
      .subscribe(response => this.block_unblock_serviceSuccessHandeler(response), err => {
        console.log("Error", err);
        //this.message.alert(err, 'error');
      });

  }

  block_unblock_serviceSuccessHandeler(response) {
    console.log('b u service success handeler', response);
    this.message.alert('Updated successfully', 'success');
    this.getStatusOnProviderServiceLevel(response[0].serviceProviderID, response[0].serviceID);
    this.getStatus(response[0].serviceProviderID, response[0].state, response[0].serviceID);
  }

  blockServiceOfState() {
    let serviceProviderID = this.data[0].serviceProviderID;
    let serviceID = this.data[0].serviceID;
    let stateID = this.data[0].stateID;
    let statusID = this.status;
    let reason = this.reason;
    this.block_provider.block_unblock_serviceOfState(serviceProviderID, stateID, serviceID, statusID, reason)
      .subscribe(response => this.block_unblock_serviceOfStateSuccessHandeler(response), err => {
        console.log("Error", err);
        //this.message.alert(err, 'error');
      });
  }

  block_unblock_serviceOfStateSuccessHandeler(response) {
    console.log('b u service of state success handeler', response);
    this.message.alert('Updated successfully', 'success');
    this.getStatusOnProviderStateServiceLevel(response.serviceProviderID, response.stateID, response.serviceID);
  }
}
