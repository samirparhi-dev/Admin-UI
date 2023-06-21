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
import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";

@Component({
  selector: 'app-provider-admin',
  templateUrl: './provider-admin.component.html',
  styleUrls: ['./provider-admin.component.css']
})
export class ProviderAdminComponent implements OnInit {

  commitDetailsPath: any = "assets/git-version.json";
  version: any;
  commitDetails: any;

  constructor(public alertService:ConfirmationDialogsService,
    public HttpServices: HttpServices) { }

  ngOnInit() {
    this.getCommitDetails();
  }

  Activity_Number:any="0";

  show(value)
  {
    if(this.Activity_Number!="0" && this.Activity_Number!=value)
    {
      this.alertService.confirm('Confirm',"Do you really want to navigate? Any unsaved data would be lost").subscribe(response=>{
        if(response)
        {
          this.Activity_Number=value;
        }
      }); 
    }
    else
    {
      this.Activity_Number=value;
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
}
