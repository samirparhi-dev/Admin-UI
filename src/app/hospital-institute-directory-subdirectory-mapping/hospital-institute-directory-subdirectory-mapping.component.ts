import { Component, OnInit } from '@angular/core';
import { HospitalInstituteMappingService } from '../services/ProviderAdminServices/hospital-institute-mapping-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';


@Component({
	selector: 'app-hospital-institute-directory-subdirectory-mapping',
	templateUrl: './hospital-institute-directory-subdirectory-mapping.component.html',
	styleUrls: ['./hospital-institute-directory-subdirectory-mapping.component.css']
})
export class HospitalInstituteDirectorySubdirectoryMappingComponent implements OnInit {

	/*ngModels*/
	serviceProviderID:any;
	providerServiceMapID:any;

	state:any;
	service:any;
	district:any;
	taluk:any;
	hospital:any;
	institute_directory:any;
	institute_subdirectory:any;

	/*arrays*/
	states:any=[];
	services:any=[];
	districts:any=[];
	taluks:any=[];
	hospitals:any=[];
	institute_directories:any=[];
	institute_subdirectories:any=[];



	constructor(public hospitalInstituteMappingService:HospitalInstituteMappingService,
	            public commonDataService:dataService,
	            public alertService:ConfirmationDialogsService) 
	{
		this.serviceProviderID =this.commonDataService.service_providerID;
	}

	ngOnInit() 
	{
		this.hospitalInstituteMappingService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response));

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
        this.service="";
        this.district="";
        this.taluk="";

        this.hospitalInstituteMappingService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServiceSuccessHandeler(response));
    }

    getServiceSuccessHandeler(response)
    {
        if(response)
        {
            this.services=response;
        }
    }

    getDistrict(stateID)
    {
        this.service="";
        this.district="";
        this.taluk="";

        this.hospitalInstituteMappingService.getDistricts(stateID).subscribe(response=>this.getDistrictSuccessHandeler(response));

    }

    getDistrictSuccessHandeler(response)
    {
        console.log(response,"Districts");
        if(response)
        {
            this.districts=response;
        }
    }

    setProviderServiceMapID(providerServiceMapID)
    {
        this.district="";
        this.taluk="";
        this.providerServiceMapID=providerServiceMapID;

        this.getInstituteDirectory();
    }

     getTaluk(districtID)
    {
        this.taluk="";
        this.hospitalInstituteMappingService.getTaluks(districtID).subscribe(response=>this.getTalukSuccessHandeler(response));
    }

    getTalukSuccessHandeler(response)
    {
        console.log(response,"Taluk")
        if(response)
        {
            this.taluks=response;
        }
    }


    getInstitutions()
    {
        let request_obj={
            "providerServiceMapID" : this.providerServiceMapID,
            "stateID" : this.state,
            "districtID" : this.district,
            "blockID": this.taluk
        }
        this.hospitalInstituteMappingService.getInstitutions(request_obj).subscribe(response=>this.getInstitutionSuccessHandeler(response));
    }

    getInstitutionSuccessHandeler(response)
    {
        console.log(response,"GET HOSPITAL LIST");
        if(response)
        {
            this.hospitals=response;
        }
    }

    getInstituteDirectory()
	{
		this.hospitalInstituteMappingService.getInstituteDirectory(this.providerServiceMapID).subscribe(response=>this.getInstituteDirectorySuccessHandeler(response));
	}

	getInstituteDirectorySuccessHandeler(response)
	{
		if(response)
		{
			console.log("institute directory",response);
			this.institute_directories=response;	
		}
	}

	getInstituteSubdirectory(institute_directory)
	{
		let data={
			"instituteDirectoryID" : institute_directory,
			"providerServiceMapId" :this.providerServiceMapID
		}

		this.hospitalInstituteMappingService.getInstituteSubDirectory(data).subscribe(response=>this.getInstituteSubDirectorySuccessHandeler(response));


	}

	getInstituteSubDirectorySuccessHandeler(response)
	{
		if(response)
		{
			console.log("INSTITUTE SUB DIRECTORY",response);
			this.institute_subdirectories=response;
		}
	}

}
