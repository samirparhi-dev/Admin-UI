import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CallTypeSubtypeService } from "../services/ProviderAdminServices/calltype-subtype-master-service.service";
import { dataService } from '../services/dataService/data.service';
declare var jQuery: any;
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-call-disposition-type-master',
	templateUrl: './call-disposition-type-master.component.html',
	styleUrls: ['./call-disposition-type-master.component.css']
})
export class CallDispositionTypeMasterComponent implements OnInit {

	service_provider_id: any;
	providerServiceMapID: any;
	// ngmodels 
	state: any;
	service: any;

	callType: any;
	callSubType: any;
	fitToBlock: boolean = false;
	fitForFollowup: boolean = false;
	maxRedial: any = undefined;


	// api related 
	request_array: any;
	request_object: any;

	temporarySubtypeArray: any = [];

	// arrays
	data: any;
	provider_states: any = [];
	provider_services: any = [];



	// flags
	showTable: boolean;
	showForm: boolean;
	showCallType: boolean = false;
	tempCorrespondingSubCallType: any = [];
	subCallTypeExist: boolean = false;
	@ViewChild('callTypeSubCallType') callTypeSubCallType: NgForm;

	constructor(public callTypeSubtypeService: CallTypeSubtypeService, private alertService: ConfirmationDialogsService,
		public commonDataService: dataService, public dialog: MdDialog) {
		this.data = [];
		this.service_provider_id = this.commonDataService.service_providerID;
		this.providerServiceMapID = "";

		this.showTable = false;
		this.showForm = false;
	}

	ngOnInit() {
		this.callTypeSubtypeService.getStates(this.service_provider_id).subscribe(response => this.getStatesSuccessHandeler(response));

		this.request_array = [];
		this.request_object = {
			"callGroupType": "",
			"callType1": [],

			// "callTypeDesc": "call type desc 1",
			// "fitToBlock": "1",
			// "fitForFollowup": "1",
			"createdBy": "Diamond Khanna"
		}
	}

	// data getters and setters for the component
	getServices(stateID) {
		this.showTable = false;
		this.callTypeSubtypeService.getServices(this.service_provider_id, stateID).subscribe(response => this.getServicesSuccessHandeler(response));
	}

	setProviderServiceMapID(providerServiceMapID) {
		this.providerServiceMapID = providerServiceMapID;
		this.get_calltype_subtype_history();

	}
	disableSelect: boolean = false;
	hideTable(flag) {

		this.disableSelect = flag;
		this.showTable = !flag;
		this.showForm = flag;
		// if (flag) {
		// 	jQuery("#addingSubTypes").trigger("reset");
		// 	;
		// }
		this.callType = "";
		this.callSubType = "";
		this.subCallTypeExist = false;
		this.temporarySubtypeArray = [];
	}
back() {
	this.alertService.confirm("Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
		if(res) {
			this.hideTable(false);
		}
	})

}
	hideForm() {
		this.showTable = true;
		this.showForm = false;
	}

	reset() {
		this.callSubType = "";
		this.temporarySubtypeArray = [];
		this.fitToBlock = false;
		this.fitForFollowup = false;
		this.isInbound = false;
		this.isOutbound = false;
		this.maxRedial = undefined;
	}

	isInbound = false;
	isOutbound = false;
	setIsInbound(ev) {
		console.log(ev, "INBOUND CHECKBOX");
		this.isInbound = ev.checked;
	}

	setIsOutbound(ev) {
		console.log(ev, "OUTBOUND CHECKBOX");
		this.isOutbound = ev.checked;
		if (!ev.checked) {
			this.maxRedial = undefined;
		}
	}

	pushCallSubType(callType, call_subtype, fitToBlock, fitForFollowup) {
		if (this.isInbound === false && this.isOutbound === false) {
			this.alertService.alert('Select checkbox Inbound/Outbound/Both');
			this.fitToBlock = false;
			this.fitForFollowup = false;
			this.isInbound = false;
			this.isOutbound = false;
		}
		else {
			if (call_subtype.trim().length > 0) {
				let obj = {
					"callGroupType": callType,
					"callType": call_subtype,
					"providerServiceMapID": this.providerServiceMapID,
					"callTypeDesc": call_subtype,
					"fitToBlock": fitToBlock,
					"fitForFollowup": fitForFollowup,
					"isInbound": this.isInbound,
					"isOutbound": this.isOutbound,
					'maxRedial': this.maxRedial,
					"createdBy": this.commonDataService.uname
				}
				console.log('dummy obj', obj);

				// resetting fields
				this.temporarySubtypeArray.push(obj);
				this.callSubType = "";
				this.fitToBlock = false;
				this.fitForFollowup = false;
				this.isInbound = false;
				this.isOutbound = false;
				this.maxRedial = undefined;
			}
		}


	}

	removeFromCallSubType(index) {
		this.temporarySubtypeArray.splice(index, 1);
		console.log(this.temporarySubtypeArray);
	}
	removeObj(index) {
		this.temporarySubtypeArray.splice(index, 1);
	}
	save() {
		this.callTypeSubtypeService.saveCallTypeSubtype(this.temporarySubtypeArray).subscribe(response => this.saveCallTypeSubTypeSuccessHandeler(response));
	}


	// CRUD
	get_calltype_subtype_history() {
		this.showTable = true;
		this.callTypeSubtypeService.getCallTypeSubType(this.providerServiceMapID).subscribe(response => this.getCallTypeSubTypeSuccessHandeler(response));
	}

	getCallTypeSubTypeSuccessHandeler(response) {
		console.log("call type subtype history", response);
		this.data = response;

	}




	// successhandelers

	getStatesSuccessHandeler(response) {
		this.provider_states = response;
	}

	getServicesSuccessHandeler(response) {

		this.service = "";
		this.provider_services = response.filter(function (obj) {
			return obj.serviceID == 1 || obj.serviceID == 3;
		});

		if (this.provider_services.length == 0) {
			this.alertService.alert("104 & 1097 are not working in this state");
		}
	}



	saveCallTypeSubTypeSuccessHandeler(response) {
		console.log(response, "save call type sub type success");
		this.alertService.alert("Saved call type/sub type successfully");
		this.hideTable(false) // going back to table view

		// resetting the ngmodels  
		this.reset();
		this.callType = "";
		this.request_array = [];

		this.get_calltype_subtype_history(); // refreshing the table contents

	}

	callTypeSelected(callType) {
		this.tempCorrespondingSubCallType = [];
		this.callSubType = "";
		this.showCallType = true;
		this.tempCorrespondingSubCallType = this.data.filter(function (obj) {
			return obj.callGroupType == callType;
		});
		console.log(this.data);
		console.log(this.tempCorrespondingSubCallType);
	}
	callSubTypes(value) {

		let a: boolean = false;
		let b: boolean = false;
		for (var i = 0; i < this.tempCorrespondingSubCallType.length; i++) {
			if (value.trim().toLowerCase() == this.tempCorrespondingSubCallType[i].callType.toLowerCase()) {
				this.subCallTypeExist = true;
				a = true;
				break;
			}
			else {
				a = false;
			}
		}
		for (var i = 0; i < this.temporarySubtypeArray.length; i++) {
			if (value.trim().toLowerCase() == this.temporarySubtypeArray[i].callType.toLowerCase()) {
				this.subCallTypeExist = true;
				b = true;
				break;
			}
			else {
				b = false;
			}
		}
		if (a == false && b == false) {
			this.subCallTypeExist = false;
		}
	}
	fitToBlocks(flag) {
		if (flag) {
			this.fitForFollowup = false;
		}
	}
	fitForFollowups(flag) {
		if (flag) {
			this.fitToBlock = false;
		}
	}
	deleteSubCallType(callTypeID, flag) {
		if (flag === true) {
			this.alertService.confirm("Are you sure you want to Deactivate?").subscribe(response => {
				if (response) {
					let obj = {
						"callTypeID": callTypeID,
						"deleted": flag
					}
					console.log(obj);
					this.callTypeSubtypeService.deleteSubCallType(obj).subscribe(response => this.deletedSuccess(response, "Deactivated"));
				}
			});
		}
		if (flag === false) {
			this.alertService.confirm("Are you sure you want to Activate?").subscribe(response => {
				if (response) {
					let obj = {
						"callTypeID": callTypeID,
						"deleted": flag
					}
					console.log(obj);
					this.callTypeSubtypeService.deleteSubCallType(obj).subscribe(response => this.deletedSuccess(response, "Activated"));
				}
			});
		}


	}
	deletedSuccess(res, action) {
		if (res) {
			this.alertService.alert(action + " Successfully");
			this.get_calltype_subtype_history();
			console.log(res);
		}

	}

	editCallDisposition(obj) {

		obj['service'] = this.service;
		let dialogReff = this.dialog.open(EditCallType, {
			height: '500px',
			width: '450px',
			disableClose: true,
			data: obj

		});
		dialogReff.afterClosed().subscribe(() => {

			this.get_calltype_subtype_history();
		});
		// this.disableSelect = true;
		// this.showTable = false;
		// this.showForm = true;
		// this.subCallTypeExist = false;
		// this.callType = obj.callGroupType;
		// this.callSubType = obj.callType;
		// this.fitToBlock = obj.fitToBlock;
		// this.fitForFollowup = obj.fitForFollowup;
	}
	clear() {
		this.provider_services = [];
		this.data = [];
		this.showTable = false;
	}

}
@Component({
	selector: 'edit-call-type',
	templateUrl: './edit-call-type-model.html'
})
export class EditCallType {
	constructor( @Inject(MD_DIALOG_DATA) public data: any,
		public dialog: MdDialog,
		public callTypeSubtypeService: CallTypeSubtypeService,
		public commonDataService: dataService,
		public dialogReff: MdDialogRef<EditCallType>,
		private alertService: ConfirmationDialogsService) { }

	callType: any;
	callSubType: any;
	fitToBlock: any;
	fitForFollowup: any;
	service: any;

	providerServiceMapID: any;
	existingName: any;
	subCallTypeExist: boolean = false;

	isInbound: boolean;
	isOutbound: boolean;
	maxRedial:any;


	ngOnInit() {

		console.log(this.data);
		this.service = this.data.service;
		this.callType = this.data.callGroupType;
		this.callSubType = this.data.callType;
		this.fitToBlock = this.data.fitToBlock;
		this.fitForFollowup = this.data.fitForFollowup;

		this.providerServiceMapID = this.data.providerServiceMapID;
		this.existingName = this.data.callType;
		this.isInbound = this.data.isInbound;
		this.isOutbound = this.data.isOutbound;
		if(this.data.maxRedial.toString())
		{
			this.maxRedial=this.data.maxRedial.toString();
		}
		

		this.get_calltype_subtype_history();

	}

	setIsInbound(ev) {
		console.log(ev, "INBOUND CHECKBOX");
		this.isInbound = ev.checked;
	}

	setIsOutbound(ev) {
		console.log(ev, "OUTBOUND CHECKBOX");
		this.isOutbound = ev.checked;
	}


	CTS(callType) {
		this.tempCorrespondingSubCallType = [];
		this.tempCorrespondingSubCallType = this.tableData.filter(function (obj) {
			return obj.callGroupType == callType;
		});

		console.log(this.tempCorrespondingSubCallType, "array to check dupes from");
	}


	tableData: any = [];
	get_calltype_subtype_history() {
		this.callTypeSubtypeService.getCallTypeSubType(this.providerServiceMapID).subscribe(response => this.getCallTypeSubTypeSuccessHandeler(response));
	}

	getCallTypeSubTypeSuccessHandeler(response) {
		console.log("call type subtype history", response);
		this.tableData = response;
		console.log(this.tableData);

		this.CTS(this.data.callGroupType);


	}


	fitToBlocks(flag) {
		if (flag) {
			this.fitForFollowup = false;
		}
	}
	fitForFollowups(flag) {
		if (flag) {
			this.fitToBlock = false;
		}
	}

	/**/
	tempCorrespondingSubCallType: any = [];
	callTypeSelected(callType) {
		this.tempCorrespondingSubCallType = [];
		this.callSubType = "";
		this.tempCorrespondingSubCallType = this.tableData.filter(function (obj) {
			return obj.callGroupType == callType;
		});

		console.log(this.tempCorrespondingSubCallType, "array to check dupes from");
	}

	validateCallSubtype(value) {

		let a: boolean = false;
		let b: boolean = false;
		for (var i = 0; i < this.tempCorrespondingSubCallType.length; i++) {
			if (value.trim().toLowerCase() == this.tempCorrespondingSubCallType[i].callType.toLowerCase()) {
				this.subCallTypeExist = true;
				a = true;
				break;
			}
			else {
				a = false;
			}
		}
		// for(var i=0; i<this.temporarySubtypeArray.length; i++) {
		// 	if(value.trim().toLowerCase() == this.temporarySubtypeArray[i].callType.toLowerCase()) {
		// 		this.subCallTypeExist = true;
		// 		b = true;
		// 		break;
		// 	}
		// 	else {
		// 		b = false;
		// 	}
		// }
		if (a == false) {
			this.subCallTypeExist = false;
		}
		if (value.trim().length == 0) {
			this.subCallTypeExist = true;
		}
		if (value.trim().toLowerCase() === this.existingName.toLowerCase()) {
			this.subCallTypeExist = false;
		}
	}



	/**/








	modify(value) {
		console.log(value);
		if (this.isInbound === false && this.isOutbound === false) {
			this.alertService.alert('Select checkbox Inbound/Outbound/Both');
		}
		else {
			let object = {
				"callTypeID": this.data.callTypeID,
				"callGroupType": value.callType,
				"callType": value.callSubType.trim(),
				"providerServiceMapID": this.data.providerServiceMapID,
				"callTypeDesc": value.callType,
				"fitToBlock": value.fitToBlock,
				"fitForFollowup": value.fitForFollowup,
				"isInbound": this.isInbound,
				"isOutbound": this.isOutbound,
				"maxRedial": this.maxRedial,
				"createdBy": this.commonDataService.uname

			}
			this.callTypeSubtypeService.modificallType(object).subscribe(response => this.modifySuccess(response));
		}
	}

	modifySuccess(res) {
		if (res) {
			this.alertService.alert("Edited Call type/Sub type Successfully");
			this.dialogReff.close();
		}
	}
}
