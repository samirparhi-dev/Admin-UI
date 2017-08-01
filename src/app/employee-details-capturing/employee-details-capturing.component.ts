import { Component, OnInit, ElementRef } from '@angular/core';
import { EmployeeMasterService } from "../services/ProviderAdminServices/employee-master-service.service";

declare var jQuery:any;

@Component({
	selector: 'app-employee-details-capturing',
	templateUrl: './employee-details-capturing.component.html',
	styleUrls: ['./employee-details-capturing.component.css']
})


export class EmployeeDetailsCapturingComponent implements OnInit {


// ngModels

	index: any;
	
	

// arrays

	Qualifications: any;
	languages: any;


	constructor(public EmployeeMasterService:EmployeeMasterService) {
	this.Qualifications=[];
	this.languages= [];
	this.index = 0;

	}

	ngOnInit() {
		jQuery("#UD0").css("font-size", "130%");
	}

	MOVE2NEXT(value)
	{
		this.index = value;

		jQuery("#UD"+value).css("font-size", "130%");
			
		for (let i = 0; i < 6;i++)
		{
			if(i===value)
			{
				continue;
			}
			else{

				jQuery("#UD"+i).css("font-size", "13px");
			}
		}
	
	}

	

	

	
}
