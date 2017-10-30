import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from '../services/http-services/http_services.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';

import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';


@Component({
  selector: 'app-set-security-questions',
  templateUrl: './set-security-questions.component.html',
  styleUrls: ['./set-security-questions.component.css']
})
export class SetSecurityQuestionsComponent implements OnInit {

  constructor(
    public getUserData: dataService,
    public http_calls: HttpServices,
    public router: Router,
    private configService: ConfigService,
    private alertService:ConfirmationDialogsService
  ) {

  }

  handleSuccess(response) {
    this.questions = response.data;
    console.log(this.questions);
  }
  handleError(response) {
    console.log('error', this.questions);
  }

  ngOnInit() {

    this.http_calls.getData(this.configService.getCommonBaseURL() + "user/getsecurityquetions").subscribe(
      (response: any) => this.handleSuccess(response),
      (error: any) => this.handleError(error));

  }

  uid: any = this.getUserData.uid;
  passwordSection: boolean = false;
  questionsection: boolean = true;
  uname: any = this.getUserData.uname;

  switch() {
    this.passwordSection = true;
    this.questionsection = false;
  }



  question1: any = "";
  question2: any = "";
  question3: any = "";

  answer1: any = '';
  answer2: any = '';
  answer3: any = '';

  questions: any = [];

  selectedQuestions: any = [];

  updateQuestions(selectedques,position) {

    if (this.selectedQuestions.indexOf(selectedques) == -1) {
      this.selectedQuestions[position]=selectedques;
      if(position==0)
      {
        this.answer1="";
      }
      if(position==1)
      {
        this.answer2="";
      }
      if(position==2)
      {
        this.answer3="";
      }
    }
    else {
      // alert('choose a different question... this question is already selected');
      this.alertService.alert("This Question is already selected. Choose a different Question");
      if(position==0)
      {
        this.answer1="";
        this.question1="";
      }
      if(position==1)
      {
        this.answer2="";
        this.question2="";
      }
      if(position==2)
      {
        this.answer3="";
        this.question3="";
      }

    }
  }

  dataArray: any = [];

  setSecurityQuestions() {

    console.log(this.selectedQuestions);
    if (this.selectedQuestions.length == 3) {

      this.dataArray = [{
        'userID': this.uid,
        'questionID': this.question1,
        'answers': this.answer1,
        'mobileNumber': '1234567890',
        'createdBy': this.uname
      },
      {
        'userID': this.uid,
        'questionID': this.question2,
        'answers': this.answer2,
        'mobileNumber': '1234567890',
        'createdBy': this.uname
      },
      {
        'userID': this.uid,
        'questionID': this.question3,
        'answers': this.answer3,
        'mobileNumber': '1234567890',
        'createdBy': this.uname
      }
      ]
      
      console.log(JSON.stringify(this.dataArray));
      console.log(this.selectedQuestions);

      this.http_calls.postData(this.configService.getCommonBaseURL() + 'user/saveUserSecurityQuesAns', this.dataArray).subscribe(
        (response: any) => this.handleQuestionSaveSuccess(response),
        (error: any) => this.handleQuestionSaveError(error));

    } else {
      this.alertService.alert("All 3 questions should be different. Please check your selected Questions");
    }


  }

  handleQuestionSaveSuccess(response) {
    console.log('saved questions', response);
    this.switch();

  }
  handleQuestionSaveError(response) {
    console.log('question save error', response);
  }

  oldpwd: any;
  newpwd: any;
  confirmpwd: any;

  updatePassword(new_pwd) {
    if (new_pwd === this.confirmpwd) {
      this.http_calls.postData(this.configService.getCommonBaseURL() + 'user/setForgetPassword', { 'userName': this.uname, 'password': new_pwd }).
        subscribe(
        (response: any) => this.successCallback(response),
        (error: any) => this.errorCallback(error));
    }
    else {
      this.alertService.alert("Password doesn't match");
    }
  }

  successCallback(response) {

    console.log(response);
    this.alertService.alert("Password changed Successfully");
    this.router.navigate(['']);
  }
  errorCallback(response) {
    console.log(response);
  }

}
