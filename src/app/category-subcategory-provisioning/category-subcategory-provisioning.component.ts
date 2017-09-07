import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-category-subcategory-provisioning',
	templateUrl: './category-subcategory-provisioning.component.html',
	styleUrls: ['./category-subcategory-provisioning.component.css']
})
export class CategorySubcategoryProvisioningComponent implements OnInit {

	// ngmodels
	state:any;
	service:any;
	sub_service:any;

	api_choice: any;

	// flags
	Add_Category_Subcategory_flag: boolean;
	showTable: boolean;


	constructor() {
		this.api_choice = "0";
		this.Add_Category_Subcategory_flag = true;
		this.showTable = true;
	}

	ngOnInit() { }

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


