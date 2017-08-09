import { Component, OnInit } from '@angular/core';
import { EmployeeMasterService } from "../services/ProviderAdminServices/employee-master-service.service";
import { dataService } from '../services/dataService/data.service';

@Component({
	selector: 'app-employee-master',
	templateUrl: './employee-master.component.html',
	styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {

	serviceProviderID: any;
	// ngmodel
	state_filter:any;
	service_filter:any;
	role_filter:any;
	name_filter:any;
	employee_id_filter:any;

	// arrays
	states:any=[];
	services:any=[];
	roles:any=[];

	tableitems: any=[];

	// flags
	createEmployeeFlag: boolean;


	constructor(public EmployeeMasterService: EmployeeMasterService,
				public CommonDataService: dataService) {
		this.serviceProviderID = this.CommonDataService.service_providerID;
		// this.one = "";
		// this.two = "";
		// this.three = "";

		// this.items1 = ["RO","CO","MO","HAO","SIO","PD","ADMIN"];
		// this.items2 = ["Diamond","AKhilesh","Kumar","Pradeep","Prateek","Pankush"];
		// this.items3 = ["11123","11124","11125","22134","23221"];

		// this.tableitems = [
		// {
		// 	"service": "104",
		// 	"state": "Karnataka",
		// 	"role": "RO",
		// 	"empName": "Diamond Khanna",
		// 	"empID": 1
		// },
		// {
		// 	"service": "104",
		// 	"state": "Karnataka",
		// 	"role": "HAO",
		// 	"empName": "Prateek Kumar",
		// 	"empID": 2
		// },
		// {
		// 	"service": "MCTS",
		// 	"state": "Karnataka",
		// 	"role": "Admin",
		// 	"empName": "Sabya",
		// 	"empID": 3
		// },
		// {
		// 	"service": "1097",
		// 	"state": "Assam",
		// 	"role": "CO",
		// 	"empName": "Kuldeep Dhar",
		// 	"empID": 4
		// },
		// {
		// 	"service": "104",
		// 	"state": "Assam",
		// 	"role": "SIO",
		// 	"empName": "Pradeep",
		// 	"empID": 19
		// }
		// ];


		this.createEmployeeFlag = false;


	}

	ngOnInit() {
		this.EmployeeMasterService.getStatesOfServiceProvider(this.serviceProviderID).subscribe((response: Response) => this.getStatesOfServiceProviderSuccessHandeler(response));
	}

	searchEmployee(state,service,role,empname,empid)
	{
		console.log(state + "--" + service + "--" + role + "--" + empname + "--" + empid);
		let request_obj={
			"serviceProviderID": this.serviceProviderID,
			"pSMStateID" : state,
			"serviceID" : service, 
			"roleID": role,
			"userName" :empname, 
			"userID": empid
		}
		if (request_obj.pSMStateID === undefined)
		{
			request_obj.pSMStateID = null;
		}
		if (request_obj.serviceID===undefined)
		{
			request_obj.serviceID=null;
		}
		if (request_obj.roleID === undefined) {

			request_obj.roleID=null;			
		}
		if (request_obj.userName === undefined) {

			request_obj.userName=null;
		}
		else
		{
			request_obj.userName = "%" + request_obj.userName + "%";
		}
		if (request_obj.userID === undefined) {

			request_obj.userID=null;
		}
		console.log(request_obj, "reqOBJ");
		this.EmployeeMasterService.getEmployees(request_obj).subscribe((response:Response)=>this.getEmployeesSuccessHandeler(response));
	}

	changeFlagValue(boolean_value)
	{
		this.createEmployeeFlag = boolean_value;
	}

	
	getServices(stateID) {
		console.log(this.serviceProviderID, stateID);
		this.EmployeeMasterService.getServices(this.serviceProviderID, stateID).subscribe((response:Response) => this.servicesSuccesshandeler(response));
	}

	getRoles(stateID,serviceID)
	{
		this.EmployeeMasterService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe((response: Response) => this.rolesSuccesshandeler(response));
	}

	deleteUser(employeeID) {
		let confirmation = confirm("do you want to delete the user with employeeID as " + employeeID + "???");
		if (confirmation) {
			this.EmployeeMasterService.deleteEmployee(employeeID).subscribe((response: Response) => this.userDeleteHandeler(response));
		}
	}

	getStatesOfServiceProviderSuccessHandeler(response)
	{
		console.log(response, "states of provider");
		this.states = response;
	}

	servicesSuccesshandeler(response) {
		console.log(response, "services of provider");
		this.services = response;
	}

	rolesSuccesshandeler(response)
	{
		console.log(response, "roles of provider for that state");
		this.roles = response;
	}

	getEmployeesSuccessHandeler(response)
	{
		console.log(response,"employees fetched as per condition");
		this.tableitems = response;
	}

	userDeleteHandeler(response) {
		console.log(response, "user delete successfully");
	}


}
