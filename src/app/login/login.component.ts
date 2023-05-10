import { Component, OnInit } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { Subscription } from 'rxjs/Subscription';
import { InterceptedHttp } from 'app/http.interceptor';

@Component({
  selector: 'login-component',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class loginContentClass implements OnInit {
  model: any = {};
  userID: any;
  password: any;
  serviceProviderID: any;
  status: any;
  dynamictype: any = 'password';
  public loginResult: string;
  commitDetailsPath: any = "assets/git-version.json";
  version: any;
  commitDetails: any;
  logoutUserFromPreviousSessionSubscription: Subscription;

  constructor(public loginservice: loginService,
    public router: Router,
    private alertMessage: ConfirmationDialogsService,
    public dataSettingService: dataService,
    public HttpServices: HttpServices,
    private httpService: InterceptedHttp) { };

  ngOnInit() {
    this.httpService.dologoutUsrFromPreSession(false);
    this.logoutUserFromPreviousSessionSubscription = this.httpService.logoutUserFromPreviousSessions$.subscribe((logoutUser) => {
      if(logoutUser) {
        this.loginUser(true);
      }
    })
    if (sessionStorage.getItem('authToken')) {
      this.loginservice.checkAuthorisedUser().subscribe((response) => this.gotLoginRes(response),
        (err) => console.log('Getting login response through auth token failed' + err));
    }
    this.getCommitDetails();
  }
  gotLoginRes(res: any) {
    if (res.userName == 'Super  Admin') {
      this.dataSettingService.Userdata = { 'userName': 'Super Admin' };
      this.dataSettingService.role = 'SUPERADMIN';
      this.dataSettingService.uname = 'Super Admin';
      this.router.navigate(['/MultiRoleScreenComponent']);
    } else {
      this.successCallback(res);
    }
  }
  login(userId: any, password: any, doLogout) {
    if (userId.toLowerCase() === 'SUPERADMIN'.toLowerCase()) {
      this.loginservice.superAdminAuthenticate(userId, password, doLogout)
        .subscribe(response => {
          if (response.isAuthenticated) {
            if (response.previlegeObj.length === 0) {
              console.log(response, 'SUPERADMIN VALIDATED');
              sessionStorage.setItem('authToken', response.key);
              this.dataSettingService.Userdata = { 'userName': 'Super Admin' };
              this.dataSettingService.role = 'SUPERADMIN';
              this.dataSettingService.uname = 'Super Admin';
              this.dataSettingService.uid = response.userID;
              this.router.navigate(['/MultiRoleScreenComponent']);
            } else {
              this.alertMessage.alert('User is not super admin');
            }

          }

        }, err => {
          this.alertMessage.alert(err, 'error')
          console.log(err, 'ERR while superadmin validation');
        });

    } else {
      this.loginservice.authenticateUser(userId, password, doLogout).subscribe(
        (response: any) => {
          sessionStorage.setItem('authToken', response.key);
          this.successCallback(response);
        },
        (error: any) => {
          this.errorCallback(error)
          // this.alertMessage.alert(error, 'error');
        });
    }

  };

  loginUser(doLogOut) {
    this.loginservice
    .userLogOutFromPreviousSession(this.userID)
    .subscribe(
      (userLogOutRes: any) => {
      if(userLogOutRes && userLogOutRes.response) {
        if (this.userID.toLowerCase() === 'SUPERADMIN'.toLowerCase()){
          this.loginservice.superAdminAuthenticate(this.userID, this.password, doLogOut)
          .subscribe(response => {
            if (response.isAuthenticated) {
              if (response.previlegeObj.length === 0) {
                console.log(response, 'SUPERADMIN VALIDATED');
                sessionStorage.setItem('authToken', response.key);
                this.dataSettingService.Userdata = { 'userName': 'Super Admin' };
                this.dataSettingService.role = 'SUPERADMIN';
                this.dataSettingService.uname = 'Super Admin';
                this.dataSettingService.uid = response.userID;
                this.router.navigate(['/MultiRoleScreenComponent']);
              } else {
                this.alertMessage.alert('User is not super admin');
              }
  
            }
  
          }, err => {
            this.alertMessage.alert(err, 'error')
            console.log(err, 'ERR while superadmin validation');
          });  
        }
        else {

        this.loginservice.authenticateUser(this.userID, this.password, doLogOut).subscribe(
          (response: any) => {
            sessionStorage.setItem('authToken', response.key);
            this.successCallback(response);
          },
          (error: any) => {
            this.errorCallback(error)
            // this.alertMessage.alert(error, 'error');
          });
      }
    }
      else
      {
            this.alertMessage.alert(userLogOutRes.errorMessage, 'error');
      }
      });
  }

  successCallback(response: any) {
    console.log(response);
    this.dataSettingService.Userdata = response;
    this.dataSettingService.userPriveliges = response.previlegeObj;
    this.dataSettingService.uid = response.userID;
    // this.dataSettingService.service_providerID = response.provider[0].providerID;
    this.dataSettingService.uname = response.userName;
    console.log('array', response.previlegeObj);

    if (response.isAuthenticated === true && response.Status === 'Active') {
      console.log('response.previlegeObj[0].serviceID', response.previlegeObj[0].serviceID);
      this.loginservice.getServiceProviderID(response.previlegeObj[0].serviceID)
        .subscribe(res => this.getServiceProviderMapIDSuccessHandeler(res),
          (err) => console.log('error in fetching service provider ID', err));
      // this.router.navigate(['/MultiRoleScreenComponent']);
      for (let i = 0; i < response.Previlege.length; i++) {

        // for (let j = 0; j < response.Previlege[i].Role.length; j++) {
        if (response.Previlege[i].Role === 'ProviderAdmin') {
          // this.router.navigate(['/MultiRoleScreenComponent']);
          this.dataSettingService.role = 'PROVIDERADMIN';
          console.log('VALUE SET HOGAYI');
        } else {
          this.dataSettingService.role = '';
        }
        // }
      }
      if (this.dataSettingService.role.toLowerCase() === 'PROVIDERADMIN'.toLowerCase()) {
        this.router.navigate(['/MultiRoleScreenComponent']);
      } else {
        this.alertMessage.alert('User is not a provider admin');
      }

    }
    if (response.isAuthenticated === true && response.Status === 'New') {
      this.status = 'new';
      sessionStorage.setItem('authToken', response.key);
      this.router.navigate(['/setQuestions']);
    }

    for (let i = 0; i < response.previlegeObj.length; i++) {
      if (response.previlegeObj[i].serviceDesc.toLowerCase() === '104 helpline') {
        this.dataSettingService.providerServiceMapID_104 = response.previlegeObj[i].providerServiceMapID;
      }
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

  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }


  getServiceProviderMapIDSuccessHandeler(response) {
    console.log('service provider map id', response);
    if (response != undefined) {
      this.dataSettingService.service_providerID = response.serviceProviderID;
      this.serviceProviderID = response.serviceProviderID;
    } else {
      this.alertMessage.alert('Service Provider map ID is not fetched', 'error');
    }
  }

  getCommitDetails() {
    let Data = this.commitDetailsPath;
    this.HttpServices.getCommitDetails(this.commitDetailsPath).subscribe((res) => this.successhandeler1(res), err => this.successhandeler1(err));
  }
  successhandeler1(response) {
    this.commitDetails = response;
    this.version = this.commitDetails['version']
  }

  ngOnDestroy() {
    if (this.logoutUserFromPreviousSessionSubscription) {
      this.logoutUserFromPreviousSessionSubscription.unsubscribe();
    }
  }
}
