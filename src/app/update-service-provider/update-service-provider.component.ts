/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component, OnInit } from '@angular/core';
import { SuperAdmin_ServiceProvider_Service } from "../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service";
import { EditProviderDetailsComponent } from './../edit-provider-details/edit-provider-details.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-update-service-provider',
  templateUrl: './update-service-provider.component.html',
  styleUrls: ['./update-service-provider.component.css']
})
export class UpdateServiceProviderComponent implements OnInit {

  filtereddata: any = [];
  allProviders: any = [];
  providerSelected: any;
  data: any = [];
  showProvider: boolean = false;
  searchPage: boolean = true;
  countryID = 1;
  states: any = [];
  servicelines: any = [];
  state: any;
  filteredStates: any = [];
  serviceline: any;
  provider: any;
  allServicesMapped: any;

  isNational = false;

  constructor(public super_admin_service: SuperAdmin_ServiceProvider_Service,
    public dialog: MdDialog,
    private message: ConfirmationDialogsService,
    public commonAppData: dataService) { }

  ngOnInit() {
    this.super_admin_service.getAllProvider().subscribe(response => this.providerData_successHandler(response), err => {
      console.log(err, 'error');
    });
    this.super_admin_service.getAllStates(this.countryID).subscribe(response => this.getAllStates(response), err => {
      console.log(err, 'error');
    });

    this.getAllServicelines_new();

  }

  getAllStates(response) {
    this.states = response;
  }

  getAllServicelines_new() {
    this.super_admin_service.getAllServiceLines().subscribe(response => {
      this.servicelines = response;
    }, err => {
      console.log('Servicelines fetching error', err);
      console.log(err, 'error');
    });
  }

  // **** THIS FUNCTION IS NOT USED  *****

  // getProviderSpecificServicelines(serviceProviderID) {
  //   this.super_admin_service.getServicelinesFromProvider(serviceProviderID)
  //     .subscribe(response => {
  //       console.log('Servicelines fetch success', response);
  //       this.servicelines = response;
  //     }, err => {
  //       console.log('Servicelines fetching error', err);
  //     });
  // }

  setIsNationalFlag(value) {
    this.isNational = value;
  }

  getAvailableStates(serviceID) {
    console.log('all states', this.states);
    let mappedStateIDs = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].serviceID === serviceID) {
        if (this.data[i].stateID === undefined) {
          this.message.alert('This national level service has already been mapped');
        }
        if (this.data[i].stateID != undefined) {
          // in case of isNational=false, this code will work
          mappedStateIDs.push(this.data[i].stateID);
        }
      }
    }

    console.log('all mapped states IDs', mappedStateIDs);

    // filtering logic
    let filtered_states = [];
    for (let j = 0; j < this.states.length; j++) {
      let state_exists = false;
      for (let k = 0; k < mappedStateIDs.length; k++) {
        if (this.states[j].stateID === mappedStateIDs[k]) {
          state_exists = true;
        }
      }
      if (!state_exists) {
        filtered_states.push(this.states[j]);
      }
    }

    console.log('Filtered States', filtered_states);
    this.filteredStates = filtered_states;
    if (this.states.length < 1) {
      this.message.alert('All states have been mapped to this serviceline');
    }
  }

  providerData_successHandler(response) {
    this.allProviders = response;
    console.log(response.length);
  }
  selectedProvider(provider) {
    this.showProvider = true;
    this.provider = provider;
    this.super_admin_service.getProviderStatus(provider)
      .subscribe(response => this.providerInfo_handler(response), err => {
        console.log(err, 'error');
      });
  }
  providerInfo_handler(response) {
    console.log(response);
    this.data = response;
    this.filtereddata = response;
  }
  addOrModify() {
    this.searchPage = false;
  }
  back() {
    this.message.confirm('Confirm', 'Do you really want to cancel? Any unsaved data would be lost')
      .subscribe(res => {
        if (res) {
          this.searchPage = true;
          this.state = "";
          this.serviceline = "";
          // this.servicelines = [];
          this.allServicesMapped = false;
          this.isNational = false;
        }
      }, err => {

      })
  }



  modifyProvider(value) {

    let obj = {
      'serviceProviderID': this.providerSelected,
      'stateID1': value.state ? value.state : [],
      'createdBy': this.commonAppData.uname,
      'serviceID': value.serviceLine,
      'statusID': 2
    }
    const reqArray = [];
    reqArray.push(obj);
    console.log('REQUEST Array', reqArray);
    this.super_admin_service.addProviderStateAndServiceLines(reqArray)
      .subscribe(response => this.servicelineAddedSuccesshandler(response), err => {
        console.log(err, 'error');
      });

  }
  servicelineAddedSuccesshandler(response) {
    this.message.alert('Saved successfully', 'success');
    this.super_admin_service.getProviderStatus(this.provider).subscribe(res => this.providerInfo_handler(res), err => {
      console.log(err, 'error');
    });
    this.searchPage = true;
    this.state = '';
    this.serviceline = '';
    // this.servicelines = [];
  }
  edit(providerID: any) {
    const dialogRef = this.dialog.open(EditProviderDetailsComponent, {
      height: '550px',
      width: '750px',
      data: this.allProviders.filter(function (item) {
        return item.serviceProviderId === providerID
      })
    });
    dialogRef.afterClosed().subscribe(result => {
      this.super_admin_service.getAllProvider()
        .subscribe(response => this.providerData_successHandler(response), err => {
          console.log(err, 'error');
        });


    });

  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filtereddata = this.data;
    } else {
      this.filtereddata = [];
      this.data.forEach((item) => {
        for (let key in item) {
          if (key == 'serviceName' || key == 'stateName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filtereddata.push(item); break;
            }
          }
        }
      });
    }

  }
}
