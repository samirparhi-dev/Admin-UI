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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderAdminListComponent } from './provider-admin-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';

describe('ProviderAdminListComponent', () => {
  let component: ProviderAdminListComponent;
  let fixture: ComponentFixture<ProviderAdminListComponent>;

  const fakeDataService = {
    current_user: { userID: '100' }
  }
  const providerAdminForFakeDataService = {
    provide: dataService, useValue: fakeDataService
  }

  const fakeConfirmationDialogsService = {
    current_user: { userID: '100' }
  }

  const providerAdminForFakeConfirmationDialogService = {
    provide: ConfirmationDialogsService, useValue: fakeConfirmationDialogsService
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAdminListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
