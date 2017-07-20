import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-employee-master',
	templateUrl: './employee-master.component.html',
	styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {

	// ngmodel
	one: any;
	two: any;
	three: any;

	// arrays
	items1:any;
	items2:any;
	items3:any;

	tableitems: any;

	// flags
	showAccordianFlag: boolean;


	constructor() {
		this.one = "";
		this.two = "";
		this.three = "";

		this.items1 = ["RO","CO","MO","HAO","SIO","PD","ADMIN"];
		this.items2 = ["Diamond","AKhilesh","Kumar","Pradeep","Prateek","Pankush"];
		this.items3 = ["11123","11124","11125","22134","23221"];

		this.tableitems = [
		{
			"service": "104",
			"state": "Karnataka",
			"role": "RO",
			"empName": "Diamond Khanna",
			"empID": 1
		},
		{
			"service": "104",
			"state": "Karnataka",
			"role": "HAO",
			"empName": "Prateek Kumar",
			"empID": 2
		},
		{
			"service": "MCTS",
			"state": "Karnataka",
			"role": "Admin",
			"empName": "Sabya",
			"empID": 3
		},
		{
			"service": "1097",
			"state": "Assam",
			"role": "CO",
			"empName": "Kuldeep Dhar",
			"empID": 4
		},
		{
			"service": "104",
			"state": "Assam",
			"role": "SIO",
			"empName": "Pradeep",
			"empID": 19
		}
		];

		this.showAccordianFlag = false;
	}

	ngOnInit() {
	}

	selected(a,b,c)
	{
		console.log(a + "--" + b + "--" + c);
	}

	changeFlagValue(boolean_value)
	{
		this.showAccordianFlag = boolean_value;
	}

}
