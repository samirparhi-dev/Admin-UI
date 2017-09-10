import { Component, OnInit } from '@angular/core';
import { CategorySubcategoryService } from "../services/ProviderAdminServices/category-subcategory-master-service.service";
import { dataService } from '../services/dataService/data.service';

@Component({
	selector: 'app-category-subcategory-provisioning',
	templateUrl: './category-subcategory-provisioning.component.html',
	styleUrls: ['./category-subcategory-provisioning.component.css']
})
export class CategorySubcategoryProvisioningComponent implements OnInit {

	serviceproviderID: any;
	// ngmodels
	state:any;
	service:any;
	sub_service:any;

	api_choice: any;

	// flags
	Add_Category_Subcategory_flag: boolean;
	showTable: boolean;



	request_object: any;


	constructor(public commonDataService: dataService, public CategorySubcategoryService: CategorySubcategoryService) {
		this.api_choice = "0";
		this.Add_Category_Subcategory_flag = true;
		this.showTable = true;

		this.serviceproviderID = this.commonDataService.service_providerID;

	}

	ngOnInit() {
		
	 }

	hideTable()
	{
		this.showTable=false;
	}

	hideForm()
	{
		this.showTable = true;
	}

	changeRequestObject(flag_value)
	{
		if (flag_value === "0")
		{
			this.Add_Category_Subcategory_flag = true;
			this.resetFields();

		}
		if (flag_value === "1")
		{
			this.Add_Category_Subcategory_flag = false;
			this.resetFields();
		}
	}

	resetFields(){

	}

}


