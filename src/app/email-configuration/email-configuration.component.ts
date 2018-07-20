import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailConfigurationService } from '../services/ProviderAdminServices/email-configuration-services.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { log } from 'util';

@Component({
	selector: 'app-email-configuration',
	templateUrl: './email-configuration.component.html',
	styleUrls: ['./email-configuration.component.css']
})
export class EmailConfigurationComponent implements OnInit {

	userID: any;
	Serviceline: any;
	state: any;
	districtID: any;
	taluk: any;
	institutes: any;
	designation: any;
	authorityName: any;
	emailID: any;
	contactNo: any;
	nationalFlag: any;
	providerServiceMapID: any;
	mailConfigObject: any;
	editAuthorityMailConfig: any;
	updateMailConfigObject: any;
	confirmMessage: any;
	bufferCount: any = 0;
	serviceline:any;
	mailConfig: any = [];
	services: any = [];
	states: any = [];
	districts: any = [];
	designations: any = [];
	taluks: any = [];
	emailConfigList: any = [];

	disableSelection: boolean = false;
	showListOfEmailconfig: any = true;
	showListOfEmails: any = true;
	editable: any = false;
	showTableFlag: boolean = false;

	emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|COM|IN|in|co.in)\b$/;
	mobileNoPattern=/^[1-9][0-9]{9}/;

	@ViewChild('searchForm') searchForm: NgForm;
	@ViewChild('mailConfigForm') mailConfigForm: NgForm;

	constructor(public EmailConfigurationService: EmailConfigurationService,
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
		this.EmailConfigurationService.getServiceLines(this.userID).subscribe((serviceResponse) => {
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
		let obj = {
			'userID': this.userID,
			'serviceID': serviceline.serviceID,
			'isNational': serviceline.isNational
		}
		this.EmailConfigurationService.getStates(obj).subscribe(statesResponse => {
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
		this.getAllMailConfig();
		this.getDistricts(state);
	}
	getDistricts(state) {
		this.mailConfig = [];
		this.EmailConfigurationService.getDistricts(state.stateID).subscribe(response => {
			this.getDistrictsSuccessHandeler(response);
		});

	}
	getDistrictsSuccessHandeler(response) {
		this.districts = response;
	}
	getTaluk(districtID) {
		this.taluk = null;
		this.EmailConfigurationService.getTaluks(districtID.districtID).subscribe(response => this.getTalukSuccessHandeler(response),
			(err) => {
				console.log("Error", err);
			});
	}

	getTalukSuccessHandeler(response) {
		console.log(response, "Taluk")
		if (response) {
			console.log('this.searchForm',this.searchForm.valid,this.searchForm.value);
			this.taluks = response;
		}
		this.getAllMailConfig();
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
			console.log('search',this.searchForm.value)
			checkTalukValue = this.taluk.blockID
			console.log('search',this.searchForm.value,this.searchForm.value);
		}
		let object = {
			"providerServiceMapID": this.providerServiceMapID,
			"stateID": this.state.stateID,
			"districtID": checkDistrictValue,
			"blockID": checkTalukValue
		}

		this.EmailConfigurationService.getMailConfig(object).subscribe((mailConfigResponse) => {
			this.mailConfigSuccessHandler(mailConfigResponse),
				(err) => {
					console.log("ERROR in fetching mail config", err);
				}
		});
	}
	mailConfigSuccessHandler(mailConfigResponse) {
		this.mailConfig = mailConfigResponse;
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
		this.EmailConfigurationService.getAllDesignations().subscribe(res => this.getAllDesignationsSuccessHandler(res),
			(err) => console.log('error', err));
	}
	getAllDesignationsSuccessHandler(response) {
		console.log("Display All Designations", response);
		this.designations = response;
		if (this.editAuthorityMailConfig != undefined) {
			if (this.designations) {
				let auth_designation = this.designations.filter((designationResponse) => {
					if (this.editAuthorityMailConfig.designationID == designationResponse.designationID) {
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

		this.mailConfigObject = {

			"providerServiceMapID": this.providerServiceMapID,
			"stateID": this.state.stateID,
			"districtID": this.districtID.districtID,
			"blockID": this.taluk.blockID,
			"designationID": values.designation.designationID,
			"authorityName": values.authorityName,
			"emailID": values.emailID,
			"contactNo": values.contactNo,
			"createdBy": this.commonDataService.uname
		}
		// this.emailConfigList.push(this.mailConfigObject);
		console.log("emailConfigList", this.emailConfigList);

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
									&& this.emailConfigList[a].emailID === this.mailConfigObject.emailID) {
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
		this.EmailConfigurationService.saveMailConfig(this.emailConfigList).subscribe(response => this.saveSuccessHandeler(response),
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
		this.contactNo = mailConfigvalues.contactNo;
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
			"contactNo": this.contactNo,
			"authorityEmailID": this.editAuthorityMailConfig.authorityEmailID,
			"modifiedBy": this.commonDataService.uname
		}
		console.log("updateMailConfigObject", this.updateMailConfigObject);

		this.EmailConfigurationService.updateMailConfig(this.updateMailConfigObject).subscribe(response => this.updateHandler(response));
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
			"contactNo": mailconfigObject.contactNo,
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
				this.EmailConfigurationService.emailActivationDeactivation(obj)
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

}

