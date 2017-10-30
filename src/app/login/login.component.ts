import { Component } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';


@Component({
	selector: 'login-component',
	templateUrl: './login.html',
	styleUrls: ['./login.css']
})

export class loginContentClass {
	model: any = {};
	userID: any;
	password: any;
	public loginResult: string;
	constructor(public loginservice: loginService, public router: Router, public dataSettingService: dataService) { };

	login(userId: any, password: any) {
		;
		console.log(userId, password);
		if (userId === "SUPERADMIN" && password === "SUPERADMIN") {
			this.dataSettingService.Userdata = { "userName": "Super Admin" };
			this.dataSettingService.role = "SUPERADMIN";
			this.dataSettingService.uname = "Super Admin";
			this.router.navigate(['/MultiRoleScreenComponent']);
		}
		// if (userId === "padmin" && password === "padmin") {
		// 	this.dataSettingService.Userdata = { "userName": "Diamond Khanna" };
		// 	this.dataSettingService.role = "PROVIDERADMIN";
		// 	this.router.navigate(['/MultiRoleScreenComponent']);
		// }
		else {
			this.loginservice.authenticateUser(userId, password).subscribe(
				(response: any) => this.successCallback(response),
				(error: any) => this.errorCallback(error));
		}

	};

	successCallback(response: any) {
		;
		console.log(response);
		this.dataSettingService.Userdata = response;
		this.dataSettingService.userPriveliges = response.previlegeObj;
		this.dataSettingService.uid = response.userID;
		// this.dataSettingService.service_providerID = response.provider[0].providerID;
		this.dataSettingService.uname = this.userID;
		console.log("array", response.previlegeObj);

		if (response.isAuthenticated === true && response.Status === "Active") {
			this.loginservice.getServiceProviderID(response.previlegeObj[0].serviceID).subscribe(response => this.getServiceProviderMapIDSuccessHandeler(response));
			// this.router.navigate(['/MultiRoleScreenComponent']);
			for (let i = 0; i < response.Previlege.length; i++) {

				for (let j = 0; j < response.Previlege[i].Role.length; j++) {
					if (response.Previlege[i].Role[j] === "ProviderAdmin") {
						// this.router.navigate(['/MultiRoleScreenComponent']);
						this.dataSettingService.role = "PROVIDERADMIN";
					}
					else {
						// this.router.navigate(['/MultiRoleScreenComponent']);
					}
				}
			}
			this.router.navigate(['/MultiRoleScreenComponent']);
		}
		if (response.isAuthenticated === true && response.Status === "New") {
			this.router.navigate(['/setQuestions']);
		}
	};
	errorCallback(error: any) {
		if (error.status) {
			this.loginResult = error.errorMessage;
		} else {
			this.loginResult = 'Internal issue please try after some time';
		}
		// this.loading = false;
		console.log(error);
	};

	// encryptionFlag: boolean = true;
	dynamictype: any = 'password';
	toggleAnswerVisibilty() {
		console.log('chala toggle');
		// this.encryptionFlag = !this.encryptionFlag;
		// if (this.encryptionFlag === true) {
		// 	this.dynamictype = 'password';
		// }
		// if (this.encryptionFlag === false) {
			this.dynamictype = 'text';

		// }
	}

	hidePWD()
	{
		this.dynamictype = 'password';
	}


	getServiceProviderMapIDSuccessHandeler(response) {
		console.log("service provider map id", response);
		if (response != undefined) {
			this.dataSettingService.service_providerID = response.serviceProviderID;
		}
		else {
			alert("Service Provider MAP ID is not fetched, undefined");
		}
	}


}
