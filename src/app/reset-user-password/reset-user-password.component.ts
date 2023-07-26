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
import { Component, OnInit, ViewChild } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { ResetUserPasswordService } from '../services/ProviderAdminServices/reset-user-password.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styleUrls: ['./reset-user-password.component.css']
})
export class ResetUserPasswordComponent implements OnInit {

  /*NgModel*/
  serviceProviderID: any;
  user: any;
  password: any;

  /*Arrays*/
  userNamesList: any = [];
  userDetails: any = [];

  tableMode: Boolean = false;

  SALT: string = "RandomInitVector";
  Key_IV: string = "Piramal12Piramal";
  encPassword: string;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;
  encryptPassword: any;

  /*Patter*/
  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  constructor(private alertService: ConfirmationDialogsService,
    private data_service: dataService,
    private resetUserPasswordService: ResetUserPasswordService) { 
      this._keySize = 256;
      this._ivSize = 128;
      this._iterationCount = 1989;
    }

  ngOnInit() {
    this.serviceProviderID = this.data_service.service_providerID;
    this.getAllUserName(this.serviceProviderID);
  }

  /*Fetch all user name*/
  getAllUserName(serviceProviderID) {
    this.resetUserPasswordService.getUserList(serviceProviderID)
      .subscribe(response => {
        console.log('All user name under this provider Success Handeler', response);
        this.userNamesList = response;
      }, err => {
        console.log('Error', err);
      });
  }

  /*Fetch particular user detail*/
  getUserDetail(userName) {
    console.log('getUserDetail', userName);
    this.tableMode = true;
    this.resetUserPasswordService.getUserDetail(userName)
      .subscribe(response => {
        this.userDetails = response;
      }, err => {
        console.log('Error', err);
      });

  }

  get keySize() {
    return this._keySize;
  }

  set keySize(value) {
    this._keySize = value;
  }



  get iterationCount() {
    return this._iterationCount;
  }



  set iterationCount(value) {
    this._iterationCount = value;
  }



  generateKey(salt, passPhrase) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
    hasher: CryptoJS.algo.SHA512,
      keySize: this.keySize / 32,
      iterations: this._iterationCount
    })
  }



  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  encrypt(passPhrase, plainText) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    let salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
    let ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + ciphertext;
  }


  /*Reset Password*/
  resetPassword(userName, password) {
    let resetObj = {
      "userName": userName,
      "password": this.encrypt(this.Key_IV, password),
      // "password": password,
      // this.encryptPassword = this.encrypt(this.Key_IV, password)
      //"statusID": 1
    }
    console.log("resetObj", resetObj);
    this.resetUserPasswordService.resetUserPassword(resetObj)
      .subscribe(response => {
        this.alertService.alert(response.response);
        this.tableMode = false;
        this.user = null;
        this.password = null;
        this.userDetails = null;
      }, err => {
        console.log('Error', err);
      });
  }
}
