import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { InstituteDirectoryMasterService } from '../services/ProviderAdminServices/institute-directory-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';



@Component({
	selector: 'app-institute-directory-master',
	templateUrl: './institute-directory-master.component.html',
	styleUrls: ['./institute-directory-master.component.css']
})
export class InstituteDirectoryMasterComponent implements OnInit {

	/*ngModels*/
	serviceProviderID: any;
	providerServiceMapID: any;
	state: any;
	service: any;
	instituteDirectory: any;
	description: any;

	/*arrays*/
	states: any = [];
	services: any = [];

	searchResultArray: any = [];
	bufferArray: any = [];

	/*flags*/
	showTableFlag: boolean = false;
	showFormFlag: boolean = false;
	disableSelection: boolean = false;
	userID: any;
	nationalFlag: any;
	availableInstituteDirectory: any = [];
	instituteDirectoryExist: boolean = false;

	@ViewChild('instituteDir') instituteDir: NgForm;

	constructor(public instituteDirectoryService: InstituteDirectoryMasterService,
		public commonDataService: dataService,
		public dialog: MdDialog,
		public alertService: ConfirmationDialogsService) {
		this.serviceProviderID = this.commonDataService.service_providerID;

	}

	ngOnInit() {
		this.userID = this.commonDataService.uid;

		//	this.instituteDirectoryService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response)); // commented on 10/4/18(1097 regarding changes) Gursimran
		this.instituteDirectoryService.getServiceLinesNew(this.userID).subscribe((response) => {
			this.successhandeler(response),
				(err) => {
					console.log("ERROR in fetching serviceline", err);
					//this.alertService.alert(err, 'error');
				}
		});
	}

	// getStatesSuccessHandeler(response)
	// {
	// 	console.log("STATE",response);
	// 	this.states=response;
	// } // commented on 10/4/18(1097 regarding changes) Gursimran

	successhandeler(res) {
		this.services = res.filter(function (item) {
			console.log("item", item);

			if (item.serviceID != 6) {
				return item;
			}
		})
	}
	// getServices(stateID)
	// {
	// 	this.service=""; //resetting the field on changing state
	// 	this.instituteDirectoryService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServicesSuccessHandeler(response));
	// }// commented on 10/4/18(1097 regarding changes) Gursimran

	getStates(value) {
		let obj = {
			'userID': this.userID,
			'serviceID': value.serviceID,
			'isNational': value.isNational
		}
		this.instituteDirectoryService.getStatesNew(obj).
			subscribe(response => this.getStatesSuccessHandeler(response, value), (err) => {
				console.log("error in fetching states", err);
				//this.alertService.alert(err, 'error');
			});
	}
	// getServicesSuccessHandeler(response)
	// {
	// 	console.log("SERVICES",response);
	// 	this.services=response.filter(function(item)
	// 	                              {
	// 	                              	if(item.serviceID!=6)
	// 	                              	{
	// 	                              		return item;
	// 	                              	}
	// 	                              });
	// }
	getStatesSuccessHandeler(response, value) {

		this.states = response;
		if (value.isNational) {
			this.nationalFlag = value.isNational;
			this.setProviderServiceMapID(response[0].providerServiceMapID);
		}
		else {
			this.nationalFlag = value.isNational;
			this.showTableFlag = false;
		}
	}
	setProviderServiceMapID(providerServiceMapID) {
		console.log("providerServiceMapID", providerServiceMapID);
		this.providerServiceMapID = providerServiceMapID;
		this.search();
	}

	search() {
		this.instituteDirectoryService.getInstituteDirectory(this.providerServiceMapID).subscribe(response => this.getInstituteDirectorySuccessHandeler(response),
			(err) => {
				console.log("Error", err);
				// this.alertService.alert(err, 'error')
			});
	}

	getInstituteDirectorySuccessHandeler(response) {
		console.log("search result", response);
		if (response) {
			this.showTableFlag = true;
			this.searchResultArray = response;
			for (let availableInstituteDirectory of this.searchResultArray) {
				this.availableInstituteDirectory.push(availableInstituteDirectory.instituteDirectoryName);
			}
		}
	}
	checkexistance(instituteDirectory) {
		this.instituteDirectoryExist = this.availableInstituteDirectory.includes(instituteDirectory);
		console.log(this.instituteDirectoryExist);
	}
	clear() {
		/*resetting the search fields*/
		this.state = "";
		this.service = "";
		this.providerServiceMapID = "";

		this.services = [];
		/*resetting the flag*/
		this.showTableFlag = false;
		/*resetting the search result array*/
		this.searchResultArray = [];
	}

	showForm() {
		this.showTableFlag = false;
		this.showFormFlag = true;

		this.disableSelection = true;
	}

	back() {
		this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
			if (res) {
				this.showTableFlag = true;
				this.showFormFlag = false;
				/*reset the input fields of the form*/
				this.instituteDirectory = "";
				this.description = "";
				this.bufferArray = [];

				this.disableSelection = false;
			}
		})
	}

	add_obj(institute_directory, description) {
		let obj = {

			"instituteDirectoryName": institute_directory,
			"instituteDirectoryDesc": description,
			"providerServiceMapId": this.providerServiceMapID,
			"createdBy": this.commonDataService.uname
		}

		if (this.bufferArray.length == 0 && (obj.instituteDirectoryName != "" && obj.instituteDirectoryName != undefined)) {
			this.bufferArray.push(obj);
		}
		else {
			let count = 0;
			for (let i = 0; i < this.bufferArray.length; i++) {
				if (obj.instituteDirectoryName === this.bufferArray[i].instituteDirectoryName) {
					count = count + 1;
				}
			}
			if (count == 0 && (obj.instituteDirectoryName != "" && obj.instituteDirectoryName != undefined)) {
				this.bufferArray.push(obj);
			}
			else {
				this.alertService.alert("Already exists");
			}
		}

		/*resetting fields after entering in buffer array/or if duplicate exist*/
		// this.instituteDirectory="";
		// this.description="";
		this.instituteDir.resetForm();

	}

	removeObj(index) {
		this.bufferArray.splice(index, 1);
	}

	save() {
		this.instituteDirectoryService.saveInstituteDirectory(this.bufferArray).subscribe(response => this.saveSuccessHandeler(response),
			(err) => {
				console.log("Error", err);
				// this.alertService.alert(err, 'error')
			});
	}

	saveSuccessHandeler(response) {
		console.log("response", response);
		if (response) {
			this.alertService.alert("Saved successfully", 'success');
			this.instituteDir.resetForm();
			this.showFormFlag = false;
			this.bufferArray = [];
			this.search();
			this.disableSelection = false;
		}
	}

	toggle_activate(instituteDirectoryID, isDeleted) {
		if (isDeleted === true) {
			this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
				if (response) {
					let obj = {
						"instituteDirectoryID": instituteDirectoryID,
						"deleted": isDeleted
					};

					this.instituteDirectoryService.toggle_activate_InstituteDirectory(obj).subscribe(response => this.toggleActivateSuccessHandeler(response, "Deactivated"),
						(err) => {
							console.log("Error", err);
							//is.alertService.alert(err, 'error')
						});
				}
			});
		}

		if (isDeleted === false) {
			this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
				if (response) {
					let obj = {
						"instituteDirectoryID": instituteDirectoryID,
						"deleted": isDeleted
					};

					this.instituteDirectoryService.toggle_activate_InstituteDirectory(obj).subscribe(response => this.toggleActivateSuccessHandeler(response, "Activated"),
						(err) => {
							console.log("Error", err);
							//is.alertService.alert(err, 'error')
						});
				}
			});
		}

	}

	toggleActivateSuccessHandeler(response, action) {
		console.log(response, "delete Response");
		if (response) {
			this.alertService.alert(action + " successfully", 'success')
			this.search();
		}
	}

	openEditModal(toBeEditedOBJ) {
		let dialog_Ref = this.dialog.open(EditInstituteDirectory, {
			width: '500px',
			data: toBeEditedOBJ
		});

		dialog_Ref.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
			if (result === "success") {
				this.alertService.alert("Updated successfully", 'success');
				this.search();
			}

		});

	}

}


@Component({
	selector: 'edit-institute-directory',
	templateUrl: './edit-institute-directory-model.html'
})
export class EditInstituteDirectory {


	instituteDirectory: any;
	description: any;

	constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
		public instituteDirectoryService: InstituteDirectoryMasterService,
		public commonDataService: dataService, public alertService: ConfirmationDialogsService,
		public dialogReff: MdDialogRef<EditInstituteDirectory>) { }

	ngOnInit() {
		console.log("dialog data", this.data);
		this.instituteDirectory = this.data.instituteDirectoryName;
		this.description = this.data.instituteDirectoryDesc;
	}


	update(edited_directory_name, edited_description) {
		let obj = {

			"instituteDirectoryID": this.data.instituteDirectoryID,
			"instituteDirectoryName": edited_directory_name,
			"instituteDirectoryDesc": edited_description,
			"modifiedBy": this.commonDataService.uname

		}
		this.instituteDirectoryService.editInstituteDirectory(obj).subscribe(response => this.updateSuccessHandeler(response),
			(err) => {
				console.log("Error", err);
				// this.alertService.alert(err, 'error')
			});
	}

	updateSuccessHandeler(response) {
		console.log(response, "edit response success");
		if (response) {
			this.dialogReff.close("success");
		}
	}

}

