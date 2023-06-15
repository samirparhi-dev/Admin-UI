/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { Router } from '@angular/router';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';



@Component({
	selector:'ResetComponent',
	templateUrl: './resetPassword.html',
	styles: ['body{ background:red !important; }']
})

export class ResetComponent{

	constructor(public loginservice: loginService, public getUserData: dataService, public router: Router,
	            public alertService:ConfirmationDialogsService) { };

	public response:any;
	public error:any;
	showQuestions: boolean = false;
	hideOnGettingQuestions: boolean = true;
	securityQuestions: any;
	answer: any=undefined;

	dynamictype: any = 'password';

	public questionId: any[] = [];
	public questions: any[]=[];
	//public correctAnswers: any[]=[];
	public userAnswers: any[]=[];
	userFinalAnswers: any[] = [];

	wrong_answer_msg:any="";
	getQuestions(username:any)
	{
		this.getUserData.uname=username;

		this.loginservice.getSecurityQuestions(username).
		subscribe((response: any) => {
			if (response !== undefined && response !== null) {
			if (response.error !== undefined && response.error !== null && response.error.statusCode === 5002){	
				this.router.navigate(["/"]);
				this.alertService.alert("User Not Found");
			}
				else{
					this.handleSuccess(response)
			
			}
		}
			},
			(error: any) => this.error = <any>error
		);

	}

	handleSuccess(data:any)
	{
		console.log(data);
		if (data !== undefined && data !== null && data.forgetPassword!="user Not Found")
		{
			if(data.SecurityQuesAns !== undefined && data.SecurityQuesAns !==null && data.SecurityQuesAns.length>0)
			{
				this.securityQuestions = data.SecurityQuesAns;
				this.showQuestions = true;
				this.hideOnGettingQuestions = false;

				this.splitQuestionAndQuestionID();
			}
			else
			{
				this.router.navigate(["/"]);
				this.alertService.alert("Questions are not set for this User");
			}
		}
	}

	showPWD() {
		this.dynamictype = 'text';
	}

	hidePWD()
	{
		this.dynamictype = 'password';
	}

	
	splitQuestionAndQuestionID() {
		
		console.log('Q n A', this.securityQuestions);
		for (var i = 0; i < this.securityQuestions.length; i++) {
			this.questions.push(this.securityQuestions[i].question);
			this.questionId.push(this.securityQuestions[i].questionId);

		}
		console.log('questions', this.questions);
		console.log('questionID', this.questionId);

		this.showMyQuestion();
		
	}


	bufferQuestionId: any;
	bufferQuestion: any;
	counter: number = 0;

	showMyQuestion()
	{
		console.log('this is question' + (this.counter+1));
		this.bufferQuestion = this.questions[this.counter];
		this.bufferQuestionId = this.questionId[this.counter];
	}

	nextQuestion()
	{
		if (this.counter < 3) {
			let reqObj = {
				"questionId": this.questionId[this.counter],
				"answer": this.answer,

			}
			this.userFinalAnswers.push(reqObj);
			this.wrong_answer_msg = "";
			this.counter = this.counter + 1;
			if (this.counter < 3) {
				this.showMyQuestion();
				this.answer = undefined;
			}
			else {
				this.checking();
		}
	}
		console.log('user Final Answers are:', this.userFinalAnswers);
	}

	checking() {
		this.loginservice.validateSecurityQuestionAndAnswer(this.userFinalAnswers, this.getUserData.uname).
			subscribe((response: any) => {
				if (response.statusCode === 200 && response.data.transactionId !== undefined && response.data.transactionId !== null) {
					this.counter = 0;
					this.router.navigate(['/setPassword']);
					this.loginservice.transactionId = response.data.transactionId;
				}

				else {
					if (response.error !==undefined && response.error !== null){
					this.showQuestions = true;
					this.counter = 0;
					this.alertService.alert(response.error.errorMessage, 'error');
					this.getQuestions(this.getUserData.uname);
					this.router.navigate(['/resetPassword']);
					this.splitQuestionAndQuestionID();
				}
			
			}
			},
				(error: any) => {
					this.showQuestions = true;
					this.counter = 0;
					this.alertService.alert(error.errorMessage, 'error');
					this.router.navigate(['/resetPassword']);
					this.splitQuestionAndQuestionID();
				}
			);

		this.answer = undefined;
		this.userFinalAnswers = [];

		}
}
