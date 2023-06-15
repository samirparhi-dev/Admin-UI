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
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-role-selection',
  templateUrl: './service-role-selection.component.html',
  styleUrls: ['./service-role-selection.component.css']
})
export class ServiceRoleSelectionComponent implements OnInit {

	constructor(public getCommonData: dataService, public router: Router) { }
  privleges: any;

  ngOnInit() {
	  this.privleges = this.getCommonData.userPriveliges;
	  this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': [''] } }]);
  }

  route2dashboard(role) {
	  if (role === 'CO') {
		  this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard'] } }]);
	  }
	  if (role === 'ADMIN') {
		  this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['superAdmin'] } }]);
	  }
  }

}
