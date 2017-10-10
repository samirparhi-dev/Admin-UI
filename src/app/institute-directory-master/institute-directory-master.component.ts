import { Component, OnInit } from '@angular/core';
import { InstituteDirectoryMasterService } from '../services/ProviderAdminServices/institute-directory-master-service.service';
import { dataService } from '../services/dataService/data.service';


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

  constructor(public instituteDirectoryService:InstituteDirectoryMasterService,
              public commonDataService:dataService) {
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
  	this.services=response;
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
  	this.showTableFlag=true;
  	this.searchResultArray=response;
  }

  clear()
  {
  	/*resetting the search fields*/
  	this.state="";
  	this.service="";
  	this.providerServiceMapID="";

  	/*resetting the flag*/
  	this.showTableFlag=false;
  	/*resetting the search result array*/
  	this.searchResultArray=[];
  }

  showForm()
  {
  	this.showTableFlag=false;
  	this.showFormFlag=true;
  }

  back()
  {
  	this.showTableFlag=true;
  	this.showFormFlag=false;
  	/*reset the infut fields of the form*/
  }

  add_obj(institute_directory,description)
  {
  	let obj={
  		"institute_directory":institute_directory,
  		"description":description
  	}

  	if(this.bufferArray.length==0 && (obj.institute_directory!="" && obj.institute_directory!=undefined))
  	{
  		this.bufferArray.push(obj);
  	}
  	else
  	{
  		let count=0;
  		for(let i=0;i<this.bufferArray.length;i++)
  		{
  			if(obj.institute_directory===this.bufferArray[i].institute_directory)
  			{
  				count=count+1;
  			}
  		}
  		if(count==0  && (obj.institute_directory!="" && obj.institute_directory!=undefined))
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

}
