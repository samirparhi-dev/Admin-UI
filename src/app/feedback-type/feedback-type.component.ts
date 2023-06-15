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
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-feedback-type',
  templateUrl: './feedback-type.component.html',
  styleUrls: ['./feedback-type.component.css']
})
export class FeedbackTypeComponent implements OnInit {

  states: any= [];
  stateId: any;
  serviceProviderID: any;
  service: any;
  services: any =[];
  firstPage: boolean = true;
  description: any;
  feebback: any;
  
  constructor(public ProviderAdminRoleService: ProviderAdminRoleService, public commonDataService: dataService) { }

  ngOnInit() {
  	this.serviceProviderID =(this.commonDataService.service_providerID).toString();
  	this.ProviderAdminRoleService.getStates(this.serviceProviderID).subscribe(response=>this.states=this.successhandeler(response));
  }
  successhandeler(response) {
  	return response;
  }
  getServices(state) {
  	this.ProviderAdminRoleService.getServices(this.serviceProviderID, state).subscribe(response => this.servicesSuccesshandeler(response));
  }
  servicesSuccesshandeler(response) {
  	console.log(response);
  	this.services = response.filter(function(obj){
  		return obj.serviceName == 104 || obj.serviceName == 1097 || obj.serviceName == "MCTS"
  	});
  }
  findSeverity(state,service) {

  }
  addSeverity() {
  	this.handlingFlag(false);
  }
  add() {

  }
  handlingFlag(flag) {
  	this.firstPage = flag;
  }
}
