import { Component, OnInit,Inject } from '@angular/core';
import { InstituteDirectoryMasterService } from '../services/ProviderAdminServices/institute-directory-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';



@Component({
	selector: 'app-institute-directory-master',
	templateUrl: './institute-directory-master.component.html',
	styleUrls: ['./institute-directory-master.component.css']
})
export class InstituteDirectoryMasterComponent implements OnInit {

	/*ngModels*/
	serviceProviderID:any;
	providerServiceMapID:any;
	state:any;
	service:any;
	instituteDirectory:any;
	description:any;

	/*arrays*/
	states:any=[];
	services:any=[];

	searchResultArray:any=[];
	bufferArray:any=[];

	/*flags*/
	showTableFlag:boolean=false;
	showFormFlag:boolean=false;
	disableSelection:boolean=false;

	constructor(public instituteDirectoryService:InstituteDirectoryMasterService,
	            public commonDataService:dataService,
	            public dialog:MdDialog,
	            public alertService:ConfirmationDialogsService) {
		this.serviceProviderID =this.commonDataService.service_providerID;

	}

	ngOnInit() {
		this.instituteDirectoryService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response));
	}

	getStatesSuccessHandeler(response)
	{
		console.log("STATE",response);
		this.states=response;
	}

	getServices(stateID)
	{
		this.service=""; //resetting the field on changing state
		this.instituteDirectoryService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServicesSuccessHandeler(response));
	}

	getServicesSuccessHandeler(response)
	{
		console.log("SERVICES",response);
		this.services=response.filter(function(item)
		                              {
		                              	if(item.serviceID!=6)
		                              	{
		                              		return item;
		                              	}
		                              });
	}

	setProviderServiceMapID(providerServiceMapID)
	{
		console.log("providerServiceMapID",providerServiceMapID);
		this.providerServiceMapID=providerServiceMapID;
		this.search();
	}

	search()
	{
		this.instituteDirectoryService.getInstituteDirectory(this.providerServiceMapID).subscribe(response=>this.getInstituteDirectorySuccessHandeler(response));
	}

	getInstituteDirectorySuccessHandeler(response)
	{
		console.log("search result",response);
		if(response)
		{
		this.showTableFlag=true;
		this.searchResultArray=response;
		}
	}

	clear()
	{
		/*resetting the search fields*/
		this.state="";
		this.service="";
		this.providerServiceMapID="";

		this.services=[];
		/*resetting the flag*/
		this.showTableFlag=false;
		/*resetting the search result array*/
		this.searchResultArray=[];
	}

	showForm()
	{
		this.showTableFlag=false;
		this.showFormFlag=true;

		this.disableSelection=true;
	}

	back()
	{
		this.showTableFlag=true;
		this.showFormFlag=false;
		/*reset the input fields of the form*/
		this.instituteDirectory="";
		this.description="";
		this.bufferArray=[];

		this.disableSelection=false;
	}

	add_obj(institute_directory,description)
	{
		let obj={

			"instituteDirectoryName" : institute_directory,
			"instituteDirectoryDesc" : description,
			"providerServiceMapId" : this.providerServiceMapID,
			"createdBy" : this.commonDataService.uname
		}

		if(this.bufferArray.length==0 && (obj.instituteDirectoryName!="" && obj.instituteDirectoryName!=undefined))
		{
			this.bufferArray.push(obj);
		}
		else
		{
			let count=0;
			for(let i=0;i<this.bufferArray.length;i++)
			{
				if(obj.instituteDirectoryName===this.bufferArray[i].instituteDirectoryName)
				{
					count=count+1;
				}
			}
			if(count==0  && (obj.instituteDirectoryName!="" && obj.instituteDirectoryName!=undefined))
			{
				this.bufferArray.push(obj);
			}
		}

		/*resetting fields after entering in buffer array/or if duplicate exist*/
		this.instituteDirectory="";
		this.description="";

	}

	removeObj(index)
	{
		this.bufferArray.splice(index,1);
	}

	save()
	{
		this.instituteDirectoryService.saveInstituteDirectory(this.bufferArray).subscribe(response=>this.saveSuccessHandeler(response));
	}

	saveSuccessHandeler(response)
	{
		console.log("response",response);
		if(response)
		{
			this.alertService.alert("Institute Directory Saved Successfully!");
			this.back();
			this.search();
		}
	}

	toggle_activate(instituteDirectoryID,isDeleted)
	{
		if(isDeleted===true)
		{
			this.alertService.confirm("Are you sure you want to Deactivate?").subscribe(response=>{
				if(response)
				{
					let obj={
						"instituteDirectoryID":instituteDirectoryID,
						"deleted":isDeleted
					};

					this.instituteDirectoryService.toggle_activate_InstituteDirectory(obj).subscribe(response=>this.toggleActivateSuccessHandeler(response,"Deactivated"))
				}
			});
		}

		if(isDeleted===false)
		{
			this.alertService.confirm("Are you sure you want to Activate?").subscribe(response=>{
				if(response)
				{
					let obj={
						"instituteDirectoryID":instituteDirectoryID,
						"deleted":isDeleted
					};

					this.instituteDirectoryService.toggle_activate_InstituteDirectory(obj).subscribe(response=>this.toggleActivateSuccessHandeler(response,"Activated"))
				}
			});
		}
		
	}

	toggleActivateSuccessHandeler(response,action)
	{
		console.log(response,"delete Response");
		if(response)
		{
			this.alertService.alert(action+" Successfully!")
			this.search();
		}
	}

	openEditModal(toBeEditedOBJ)
	{
		let dialog_Ref = this.dialog.open(EditInstituteDirectory, {
			height: '400px',
			width: '500px',
			data: toBeEditedOBJ
		});

		dialog_Ref.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
			if (result === "success") {
				this.alertService.alert("Institute Directory Edited Successfully");
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

	instituteDirectory:any;
	description:any;

	constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
	            public instituteDirectoryService: InstituteDirectoryMasterService,
	            public commonDataService:dataService,
	            public dialogReff: MdDialogRef<EditInstituteDirectory>) { }

	ngOnInit()
	{
		console.log("dialog data",this.data);
		this.instituteDirectory=this.data.instituteDirectoryName;
		this.description=this.data.instituteDirectoryDesc;
	}


	update(edited_directory_name,edited_description)
	{
		let obj={
			
			"instituteDirectoryID" : this.data.instituteDirectoryID,	
			"instituteDirectoryName" : edited_directory_name,
			"instituteDirectoryDesc" : edited_description,
			"modifiedBy" : this.commonDataService.uname

		}
		this.instituteDirectoryService.editInstituteDirectory(obj).subscribe(response=>this.updateSuccessHandeler(response));
	}

	updateSuccessHandeler(response)
	{
		console.log(response,"edit response success");
		if(response)
		{
			this.dialogReff.close("success");
		}
	}
}

