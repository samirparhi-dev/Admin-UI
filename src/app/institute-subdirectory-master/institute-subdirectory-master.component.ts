import { Component, OnInit,Inject } from '@angular/core';
import { InstituteSubDirectoryMasterService } from '../services/ProviderAdminServices/institute-subdirectory-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
	selector: 'app-institute-subdirectory-master',
	templateUrl: './institute-subdirectory-master.component.html',
	styleUrls: ['./institute-subdirectory-master.component.css']
})
export class InstituteSubdirectoryMasterComponent implements OnInit {
	/*ngModel*/
	serviceProviderID:any;
	providerServiceMapID:any;

	state:any;
	service:any;
	institute_directory:any;
	institute_subdirectory:any;
	description:any;

	/*arrays*/
	states:any=[];
	services:any=[];
	instituteDirectories:any=[];

	searchResultArray:any=[];
	bufferArray:any=[];

	/*flags*/
	showTableFlag:boolean=false;
	showFormFlag:boolean=false;
	disableSelection:boolean=false;

	constructor(public instituteSubDirectoryMasterService:InstituteSubDirectoryMasterService,
	            public commonDataService:dataService,
	            public dialog:MdDialog,
	            public alertService:ConfirmationDialogsService) 
	{
		this.serviceProviderID =this.commonDataService.service_providerID; 
	}

	ngOnInit() 
	{
		this.instituteSubDirectoryMasterService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response));

	}

	getStatesSuccessHandeler(response)
	{
		if(response)
		{
			this.states=response;
		}

	}

	getServices(stateID)
	{
		this.service=""; //resetting the field on changing state
		this.institute_directory="";
		this.instituteSubDirectoryMasterService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServicesSuccessHandeler(response));
	}

	getServicesSuccessHandeler(response)
	{
		if(response)
		{
			this.services=response;
		}

	}

	setProviderServiceMapID(providerServiceMapID)
	{
		console.log("providerServiceMapID",providerServiceMapID);
		this.providerServiceMapID=providerServiceMapID;
		this.getInstituteDirectories();
	}

	getInstituteDirectories()
	{
		this.institute_directory="";
		this.instituteSubDirectoryMasterService.getInstituteDirectory(this.providerServiceMapID).subscribe(response=>this.getInstituteDirectorySuccessHandeler(response));

	}

	getInstituteDirectorySuccessHandeler(response)
	{
		console.log(response,"Institiute Directories");
		if(response)
		{
			this.instituteDirectories=response;
		}
	}

	getInstituteSubdirectory(institute_directory)
	{
		let data={
			"instituteDirectoryID" : institute_directory,
			"providerServiceMapId" :this.providerServiceMapID
		}

		this.instituteSubDirectoryMasterService.getInstituteSubDirectory(data).subscribe(response=>this.getInstituteSubDirectorySuccessHandeler(response));


	}

	getInstituteSubDirectorySuccessHandeler(response)
	{
		if(response)
		{
			console.log("INSTITUTE SUB DIRECTORY",response);
			this.showTableFlag=true;
			this.searchResultArray=response;
		}
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
		this.institute_subdirectory="";
		this.description="";
		this.bufferArray=[];

		this.disableSelection=false;
	}


	clear()
	{
		/*resetting the search fields*/
		this.state="";
		this.service="";
		this.institute_directory="",
		this.providerServiceMapID="";

		/*resetting the flag*/
		this.showTableFlag=false;
		/*resetting the search result array*/
		this.searchResultArray=[];
	}

	add_obj(institute_subdirectory,description)
	{
		let obj={
			"instituteDirectoryID":this.institute_directory,
			"instituteSubDirectoryName" : institute_subdirectory,
			"instituteSubDirectoryDesc" : description,
			"providerServiceMapId" : this.providerServiceMapID,
			"createdBy" : this.commonDataService.uname
		}

		if(this.bufferArray.length==0 && (obj.instituteSubDirectoryName!="" && obj.instituteSubDirectoryName!=undefined))
		{
			this.bufferArray.push(obj);
		}
		else
		{
			let count=0;
			for(let i=0;i<this.bufferArray.length;i++)
			{
				if(obj.instituteSubDirectoryName===this.bufferArray[i].instituteSubDirectoryName)
				{
					count=count+1;
				}
			}
			if(count==0  && (obj.instituteSubDirectoryName!="" && obj.instituteSubDirectoryName!=undefined))
			{
				this.bufferArray.push(obj);
			}
		}

		/*resetting fields after entering in buffer array/or if duplicate exist*/
		this.institute_subdirectory="";
		this.description="";

	}

	removeObj(index)
	{
		this.bufferArray.splice(index,1);
	}

	save()
	{
		this.instituteSubDirectoryMasterService.saveInstituteSubDirectory(this.bufferArray).subscribe(response=>this.saveSuccessHandeler(response));
	}

	saveSuccessHandeler(response)
	{
		if(response)
		{
			this.alertService.alert("Institute Subdirectory Saved Successfully!");
			this.back();
			this.getInstituteSubdirectory(this.institute_directory);
		}
	}

	toggle_activate(instituteSubDirectoryID,isDeleted)
	{
		if(isDeleted===true)
		{
			this.alertService.confirm("Are you sure you want to Deactivate?").subscribe(response=>{
				if(response)
				{
					let obj={
						"instituteSubDirectoryID":instituteSubDirectoryID,
						"deleted":isDeleted
					};

					this.instituteSubDirectoryMasterService.toggle_activate_InstituteSubDirectory(obj).subscribe(response=>this.toggleActivateSuccessHandeler(response,"Deactivated"))
				}
			});
		}

		if(isDeleted===false)
		{
			this.alertService.confirm("Are you sure you want to Activate?").subscribe(response=>{
				if(response)
				{
					let obj={
						"instituteSubDirectoryID":instituteSubDirectoryID,
						"deleted":isDeleted
					};

					this.instituteSubDirectoryMasterService.toggle_activate_InstituteSubDirectory(obj).subscribe(response=>this.toggleActivateSuccessHandeler(response,"Activated"))
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
			this.getInstituteSubdirectory(this.institute_directory);
		}
	}


	openEditModal(toBeEditedOBJ)
	{
		let dialog_Ref = this.dialog.open(EditInstituteSubDirectory, {
			height: '400px',
			width: '500px',
			data: toBeEditedOBJ
		});

		dialog_Ref.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
			if (result === "success") {
				this.getInstituteSubdirectory(this.institute_directory);
			}

		});

	}



}



@Component({
	selector: 'edit-institute-subdirectory',
	templateUrl: './edit-institute-subdirectory-modal.html'
})
export class EditInstituteSubDirectory {

	instituteSubDirectory:any;
	description:any;

	constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
	            public instituteSubDirectoryMasterService: InstituteSubDirectoryMasterService,
	            public commonDataService:dataService,
	            public dialogReff: MdDialogRef<EditInstituteSubDirectory>) { }

	ngOnInit()
	{
		console.log("dialog data",this.data);
		this.instituteSubDirectory=this.data.instituteSubDirectoryName;
		this.description=this.data.instituteSubDirectoryDesc;
	}


	update(edited_subdirectory_name,edited_description)
	{
		let obj={
			
			"instituteSubDirectoryID" : this.data.instituteSubDirectoryID,	
			"instituteSubDirectoryName" : edited_subdirectory_name,
			"instituteSubDirectoryDesc" : edited_description,
			"modifiedBy" : this.commonDataService.uname

		}
		this.instituteSubDirectoryMasterService.editInstituteSubDirectory(obj).subscribe(response=>this.updateSuccessHandeler(response));
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
