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
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { RouteofAdminService } from '../services/inventory-services/route-of-admin.service';
import { ItemService } from '../services/inventory-services/item.service';

@Component({
  selector: 'app-route-of-admin',
  templateUrl: './route-of-admin.component.html',
  styleUrls: ['./route-of-admin.component.css']
})
export class RouteOfAdminComponent implements OnInit {
  createButton: boolean = false;

  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  routeList: any = [];
  filteredRouteList: any = [];
  RouteID: any;
  services_array: any = [];
  states_array: any = [];
  bufferArray: any = [];
  state: any;
  edit_State: any;
  serviceline: any;
  edit_Serviceline: any;
  edit_routeName: any;
  edit_routeDesc: any;
  edit_routeCode: any;
  confirmMessage: any;
  availableRouteCode: any;
  routeID: any;

  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  displayTable: boolean = false;
  create_filterTerm: string;

  @ViewChild('routeAddForm') routeAddForm: NgForm;
  constructor(public commonservice: CommonServices, public commonDataService: dataService,
    public itemService: ItemService,
    public dialogService: ConfirmationDialogsService, private routeAdminService: RouteofAdminService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    console.log(this.createdBy, "CreatedBy");
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.getServices();
  }
  getServices() {
    this.commonservice.getServiceLines(this.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
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
  getAllRouteOfAdmin(providerServiceMapID) {
    debugger
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.routeAdminService.getAllItemRoute(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All stores services success', response);
        this.routeList = response;
        this.filteredRouteList = response;
        this.displayTable = true;
        // for (let availableRouteCode of this.routeList) {
        //   this.availableRouteCode.push(availableRouteCode.routeCode);
        // }
      }
    })
  }
  filterRouteList(searchTerm?: string) {
    debugger;
    if (!searchTerm) {
      this.filteredRouteList = this.routeList;
    }
    else {
      this.filteredRouteList = [];
      this.routeList.forEach((item) => {
        for (let key in item) {
          if (key == "routeCode" || key == "routeName" || key == "routeDesc") {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredRouteList.push(item); break;
            }
          }
        }
      });
    }
  }
  showForm() {
    debugger;
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }
  showEditForm() {
    debugger;
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  removeRow(index) {
    debugger;
    this.bufferArray.splice(index, 1);
    
  }
  add2buffer(formvalues) {
    debugger;
    console.log("form values", formvalues);
    const obj = {
      "routeName": formvalues.routeName,
      "routeDesc": formvalues.routeDesc,
      "routeCode": formvalues.routeCode,
      'providerServiceMapID': this.providerServiceMapID,
      'createdBy': this.createdBy
    }
    this.checkDuplictes(obj);
  }
  checkDuplictes(object) {
    debugger;
    let duplicateStatus = 0
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }
    else {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].routeName == object.routeName ||
          this.bufferArray[i].routeCode == object.routeCode) {
          duplicateStatus = duplicateStatus + 1;
          this.dialogService.alert("Route is already added in list");
        }
      }
      if (duplicateStatus === 0) {
        this.bufferArray.push(object);
      }
    }
  }
  saveRoute() {
    debugger;
    console.log("object before saving the store", this.bufferArray);
    this.routeAdminService.saveItemRoute(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of route');
        this.dialogService.alert('Saved successfully', 'success');
        this.showTable();
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  showTable() {
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.bufferArray = [];
    this.displayTable = true;
    this.getAllRouteOfAdmin(this.providerServiceMapID);
    this.create_filterTerm = '';
  }
  editRoute(editformvalues) {
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.routeID = editformvalues.routeID
    this.edit_routeCode = editformvalues.routeCode;
    this.edit_routeDesc = editformvalues.routeDesc;
    this.edit_routeName = editformvalues.routeName;
    this.showEditForm();
  }
  updateRoute(editformvalues) {
    debugger;
    const editObj = {
      "routeDesc": editformvalues.routeDesc,
      "modifiedBy": this.createdBy,
      "routeID": this.routeID
    }
    this.routeAdminService.updateItemRoute(editObj).subscribe(response => {
      if (response) {
        this.showTable();
        console.log(response, 'after successful updation of Item Form');
        this.dialogService.alert('Updated successfully', 'success');

      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  activateDeactivate(routeID, flag) {
    debugger;
    if (flag) {
      this.confirmMessage = 'Block';
    } else {
      this.confirmMessage = 'Unblock';
    }
    this.dialogService.confirm('Confirm', "Are you sure you want to " + this.confirmMessage + "?").subscribe(response => {
      if (response) {
        const object = {
          "routeID": routeID,
          "deleted": flag
        };
        this.routeAdminService.deleteItemRoute(object)
          .subscribe((res) => {
            this.dialogService.alert(this.confirmMessage + "ed successfully", 'success');
            this.getAllRouteOfAdmin(this.providerServiceMapID);
            this.create_filterTerm = '';
          }, (err) => {
            console.log("error", err);
          });
      }
    });

  }
  RouteCodeExist: any = false;
  checkExistance(routeCode) {
    this.itemService.confirmItemCodeUnique(routeCode, 'route', this.providerServiceMapID)
      .subscribe((res) => {
        if (res && res.statusCode == 200 && res.data) {
          console.log(res)
          console.log(res.data)
          console.log(res.data.response)
          // this.itemCodeExist = res.data.response;
          this.localCodeExists(routeCode, res.data.response)
        }
      })
  }

  localCodeExists(code, returned) {
    let duplicateStatus = 0
    if (this.bufferArray.length > 0) {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].routeCode === code
        ) {
          duplicateStatus = duplicateStatus + 1;
        }
      }
    }
    if (duplicateStatus > 0 || returned == 'true') {
      this.RouteCodeExist = true;
    } else {
      this.RouteCodeExist = false;
    }
  }
}

