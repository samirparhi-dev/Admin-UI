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
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { log } from 'util';
import { NodalOfficerConfigurationService } from 'app/services/ProviderAdminServices/nodal-officer-configuration.service';
import { Console } from '@angular/core/src/console';

@Component({
  selector: 'app-nodal-officer-configuration',
  templateUrl: './nodal-officer-configuration.component.html',
  styleUrls: ['./nodal-officer-configuration.component.css']
})
export class NodalOfficerConfigurationComponent implements OnInit {

  userID: any;
	Serviceline: any;
	state: any;
	districtID: any;
	taluk: any;
	institutes: any;
	designation: any;
	authorityName: any;
	emailID: any;
	// contactNo: any;
	nationalFlag: any;
	providerServiceMapID: any;
	mailConfigObject: any;
	editAuthorityMailConfig: any;
	updateMailConfigObject: any;
	confirmMessage: any;
	bufferCount: any = 0;
	serviceline: any;
	mailConfig: any = [];
	services: any = [];
	states: any = [];
	districts: any = [];
	designations=[];
	taluks: any = [];
	emailConfigList: any = [];
	filteredMailConfig: any = [];

	disableSelection: boolean = false;
	showListOfEmailconfig: any = true;
	showListOfEmails: any = true;
	editable: any = false;
	showTableFlag: boolean = false;
  designationVar="Nodal Officer";
	emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
	// mobileNoPattern=/^[1-9][0-9]{9}/;

	@ViewChild('searchForm') searchForm: NgForm;
	@ViewChild('mailConfigForm') mailConfigForm: NgForm;
  mobileNo: any;

	constructor(public nodalOfficerConfigurationService: NodalOfficerConfigurationService,
		public commonDataService: dataService,
		public dialog: MdDialog,
		public alertService: ConfirmationDialogsService) {

	}

	ngOnInit() {
		this.userID = this.commonDataService.uid;
		this.getAllServicelines();

	}

	getAllServicelines() {
		console.log("user id", this.userID);
		this.nodalOfficerConfigurationService.getServiceLines(this.userID).subscribe((serviceResponse) => {
			this.serviceSuccessHandler(serviceResponse),
				(err) => {
					console.log("ERROR in fetching serviceline", err);
				}
		});
	}

	serviceSuccessHandler(serviceResponse) {
		this.services = serviceResponse;
		console.log("services", serviceResponse);
	}
	getStates(serviceline) {
		this.searchForm.controls.districtID.reset();
		this.searchForm.controls.taluk.reset();
		// this.checkDistrictValue = "";
		// this.checkTalukValue = "";
		this.mailConfig = [];
		this.filteredMailConfig = [];
		let obj = {
			'userID': this.userID,
			'serviceID': serviceline.serviceID,
			'isNational': serviceline.isNational
		}
		this.nodalOfficerConfigurationService.getStates(obj).subscribe(statesResponse => {
			this.getStatesSuccessHandeler(statesResponse, serviceline),
				(err) => {
					console.log("error in fetching states", err);
				}
		});
	}

	getStatesSuccessHandeler(response, serviceline) {
		this.states = response;
	}
	setProviderServiceMapID(state) {
		this.searchForm.controls.districtID.reset();
		this.searchForm.controls.taluk.reset();
		console.log("providerServiceMapID", state.providerServiceMapID);
		this.providerServiceMapID = state.providerServiceMapID;
    // this.getAllMailConfig();
    this.setMailConfig();
		this.getDistricts(state);
	}
	getDistricts(state) {
		this.mailConfig = [];
		this.filteredMailConfig = [];
		this.nodalOfficerConfigurationService.getDistricts(state.stateID).subscribe(response => {
			this.getDistrictsSuccessHandeler(response);
		});

	}
	getDistrictsSuccessHandeler(response) {
		this.districts = response;
	}
	getTaluk(districtID) {
		this.taluk = null;
		this.nodalOfficerConfigurationService.getTaluks(districtID.districtID).subscribe(response => this.getTalukSuccessHandeler(response),
			(err) => {
				console.log("Error", err);
			});
	}

	getTalukSuccessHandeler(response) {
		console.log(response, "Taluk")
		if (response) {
			console.log('this.searchForm', this.searchForm.valid, this.searchForm.value);
			this.taluks = response;
		}
    // this.getAllMailConfig();
    this.setMailConfig();
  }
  
  setMailConfig()
  {
    	this.mailConfig = [];
    this.filteredMailConfig = [];
  }

	getAllMailConfig() {
		let checkDistrictValue: any;
		let checkTalukValue: any;
		this.showTableFlag = true;
		this.editable = false;
		if (this.districtID != undefined || this.districtID != null) {
			checkDistrictValue = this.districtID.districtID
		}
		if (this.taluk != undefined || this.taluk != null) {
			checkTalukValue = this.taluk.blockID
		}
		let object = {
			"providerServiceMapID": this.providerServiceMapID,
			"stateID": this.state.stateID,
			"districtID": checkDistrictValue,
			"blockID": checkTalukValue
		}
        
		this.nodalOfficerConfigurationService.getNodalConfig(object).subscribe((mailConfigResponse) => {
			this.mailConfigSuccessHandler(mailConfigResponse),
				(err) => {
					console.log("ERROR in fetching mail config", err);
				}
		});
	}
	mailConfigSuccessHandler(mailConfigResponse) {
		// this.mailConfig = mailConfigResponse;
    // this.filteredMailConfig = mailConfigResponse;
	let configArray=mailConfigResponse;
   this.filteredMailConfig= configArray.filter((Response) => {
      if (Response.designation.designationName.toLowerCase() == this.designationVar.toLowerCase() && Response.mobileNo != null) {  
        // this.filteredMailConfig[0]=Response;
        // this.mailConfig[0]=Response;
        return Response;
      }
    });
    this.mailConfig=this.filteredMailConfig
		console.log("mailConfigResponse", mailConfigResponse);
	}
	showForm() {
		this.getAllDesignations();
		this.showTableFlag = false;
		this.disableSelection = true;
		this.showListOfEmails = false;
		this.showListOfEmailconfig = false;
	}
	getAllDesignations() {
		this.nodalOfficerConfigurationService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res),
			(err) => console.log('error', err));
	}
	getAllDesignationsSuccessHandler(response) {
		console.log("Display All Designations", response);
    this.designations = [];
    let designationArray = response;

  designationArray.filter((designationResponse) => {
      if (designationResponse.designationName.toLowerCase() == this.designationVar.toLowerCase() ) {  
       this.designations[0]=designationResponse;
      }
    });
   

   console.log("editAuthorityMailConfig", this.editAuthorityMailConfig)


		if (this.editAuthorityMailConfig != undefined) {
			if (designationArray) {
				let auth_designation = designationArray.filter((designationResponse) => {
					if (this.editAuthorityMailConfig.designationID == designationResponse.designationID && this.editAuthorityMailConfig.designation.designationName.toLowerCase() == this.designationVar.toLowerCase() ) {
						return designationResponse;
					}
				})[0];
				if (auth_designation) {
					this.designation = auth_designation;
				}
			}

		}
	}


	add_obj(values) {
		console.log("add object", values);
		let checkTalukValue: any;
		if (this.taluk != undefined || this.taluk != null) {
			checkTalukValue = this.taluk.blockID
		}
		this.mailConfigObject = {

			"providerServiceMapID": this.providerServiceMapID,
			"stateID": this.state.stateID,
			"districtID": this.districtID.districtID,
			"blockID": checkTalukValue,
			"designationID": values.designation.designationID,
			"authorityName": values.authorityName,
			"emailID": values.emailID,
			"mobileNo": parseInt(values.mobileNo),
			"createdBy": this.commonDataService.uname
		}
		// this.emailConfigList.push(this.mailConfigObject);
		console.log("emailConfigList", this.mailConfigObject);

		this.checkDuplicates(this.mailConfigObject);
	}

	checkDuplicates(parkingPlaceObj) {
		if (this.emailConfigList.length == 0) {
			this.emailConfigList.push(this.mailConfigObject);
			this.mailConfigForm.resetForm();
		}
		else if (this.emailConfigList.length > 0) {
			for (let a = 0; a < this.emailConfigList.length; a++) {
				if (this.emailConfigList[a].authorityName === this.mailConfigObject.authorityName
					&& this.emailConfigList[a].stateID === this.mailConfigObject.stateID
					&& this.emailConfigList[a].districtID === this.mailConfigObject.districtID
					&& this.emailConfigList[a].designationID === this.mailConfigObject.designationID
          && this.emailConfigList[a].emailID === this.mailConfigObject.emailID
          && this.emailConfigList[a].mobileNo === this.mailConfigObject.mobileNo) {
					this.bufferCount = this.bufferCount + 1;
					console.log('Duplicate Combo Exists', this.bufferCount);
				}
			}
			if (this.bufferCount > 0) {
				this.alertService.alert("Already exists");
				this.bufferCount = 0;
				this.mailConfigForm.resetForm();
			}
			else {
				this.emailConfigList.push(this.mailConfigObject);
				this.mailConfigForm.resetForm();
			}
		}

	}
	remove_obj(index) {
		this.emailConfigList.splice(index, 1);
	}
	save() {
		this.nodalOfficerConfigurationService.saveNodalConfig(this.emailConfigList).subscribe(response => this.saveSuccessHandeler(response),
			(err) => {
				console.log("Error", err);
			});
	}
	saveSuccessHandeler(response) {
		console.log("response", response);
		if (response) {
			this.alertService.alert("Saved successfully", 'success');
			this.mailConfigForm.resetForm();
			this.emailConfigList = [];
			this.showList();
		}
	}
	back() {
		this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
			if (res) {
				this.mailConfigForm.resetForm();
        this.emailConfigList = [];
        this.editAuthorityMailConfig = null;
        this.showList();
			}
		})
	}
	showList() {
		this.getAllMailConfig();
		this.showListOfEmailconfig = true;
		this.editable = false;
		this.disableSelection = false;
		this.showListOfEmails = true;
	}
	editMailConfig(mailConfigvalues) {
		console.log("mail config", mailConfigvalues);
		this.editable = true;
		this.disableSelection = true;
		this.showListOfEmails = false;
		this.editAuthorityMailConfig = mailConfigvalues;
		this.getAllDesignations();
		this.authorityName = mailConfigvalues.authorityName;
		this.emailID = mailConfigvalues.emailID;
		this.mobileNo = mailConfigvalues.mobileNo;
	}

	update() {

		this.updateMailConfigObject = {
			"providerServiceMapID": this.providerServiceMapID,
			"stateID": this.state.stateID,
			"districtID": this.districtID.districtID,
			"blockID": this.taluk.blockID,
			"designationID": this.designation.designationID,
			"authorityName": this.authorityName,
			"emailID": this.emailID,
			"mobileNo": parseInt(this.mobileNo),
			"authorityEmailID": this.editAuthorityMailConfig.authorityEmailID,
			"modifiedBy": this.commonDataService.uname
		}
		console.log("updateMailConfigObject", this.updateMailConfigObject);

		this.nodalOfficerConfigurationService.updateNodalConfig(this.updateMailConfigObject).subscribe(response => this.updateHandler(response));
	}

	updateHandler(response) {
		if (response) {
			this.alertService.alert("Updated successfully", 'success');
			this.mailConfigForm.resetForm();
			this.showList();
      this.editAuthorityMailConfig = null;
		}
	}
	toggleMailConfigActivationAndDeactivation(mailconfigObject, flag) {
		let obj = {
			"providerServiceMapID": mailconfigObject.providerServiceMapID,
			"stateID": mailconfigObject.stateID,
			"districtID": mailconfigObject.districtID,
			"blockID": mailconfigObject.blockID,
			"designationID": mailconfigObject.designationID,
			"authorityName": mailconfigObject.authorityName,
			"emailID": mailconfigObject.emailID,
      // "contactNo": mailconfigObject.contactNo,
      "mobileNo": parseInt(mailconfigObject.mobileNo),
			"modifiedBy": this.commonDataService.uname,
			"authorityEmailID": mailconfigObject.authorityEmailID,
			"deleted": flag
		}
		if (flag) {
			this.confirmMessage = 'Deactivate';
		} else {
			this.confirmMessage = 'Activate';
		}
		this.alertService.confirm('Confirm', "Are you sure you want to " + this.confirmMessage + "?").subscribe((res) => {
			if (res) {
				console.log("Deactivating or activating Obj", obj);
				this.nodalOfficerConfigurationService.nodalActivationDeactivation(obj)
					.subscribe((res) => {
						console.log('Activation or deactivation response', res);
						this.alertService.alert(this.confirmMessage + "d successfully", 'success');
						this.getAllMailConfig();
					}, (err) => console.log('error', err))
			}
		},
			(err) => {
				console.log(err);
			})

	}
	filterComponentList(searchTerm?: string) {
		if (!searchTerm) {
			this.filteredMailConfig = this.mailConfig;
		} else {
      this.filteredMailConfig = [];
      console.log("mailConfig1",this.mailConfig)
			this.mailConfig.forEach((item) => {
        console.log("item",item)
				for (let key in item) {
          console.log("Key",key)
					if (key == 'authorityName' || key == 'emailID') {
						let value: string = '' + item[key];
						if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
							this.filteredMailConfig.push(item); break;
						}
					} else {
						if (key == 'designation') {
							let value: string = '' + item[key].designationName;
							if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
								this.filteredMailConfig.push(item); break;
							}
            }
            else{
           
            if (key == 'mobileNo') {
              let value=item[key];
              console.log("Contact1",item[key])
              console.log("Contact2",searchTerm)
							if (value.indexOf(searchTerm) >= 0) {
								this.filteredMailConfig.push(item); break;
							}
						}
          }
        }
				}
			});
		}

	}

}
