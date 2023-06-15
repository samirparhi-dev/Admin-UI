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

import { MappingProviderAdminToProviderComponent } from './mapping-provider-admin-to-provider.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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


let component: MappingProviderAdminToProviderComponent;
let fixture: ComponentFixture<MappingProviderAdminToProviderComponent>;


const FakeDataService = {
  current_service: { serviceID: '123' }
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};
const FakeConfirmationDialogsService = {
  current_service: { serviceID: '123' }
}

const providerForFakeConfirmationDialogsService = {
  provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
};
class FakeSuperAdmin_ServiceProvider_Service {

  getAllMappedProviders(data) {
    return Observable.of([{
      data: {
        RoleName: 'RO'
      }
    }])
  }

  getAllProviderAdmins(data) {
    return Observable.of([{
      data: {
        RoleName: 'RO'
      }
    }])
  }

  getAllProvider(data) {
    return Observable.of([{
      data: {
        RoleName: 'RO'
      }
    }])
  }
}

const providerForFakeSuperAdmin_ServiceProvider_Service = {
  provide: SuperAdmin_ServiceProvider_Service, useClass: FakeSuperAdmin_ServiceProvider_Service
};
function Initialize104TestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MappingProviderAdminToProviderComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [Md2Module, FormsModule],
      providers: [providerForFakeDataService, providerForFakeSuperAdmin_ServiceProvider_Service, providerForFakeConfirmationDialogsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingProviderAdminToProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}
describe('Mapping-Provider-Admin-To-Provider', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104TestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('checking the value of Providers list array should not be null and shoul have some value', () => {
      expect(component.service_provider_array).not.toBe('');
    });
    it('checking the value of service_provider_admin_array should not be null and shoul have some value', () => {
      expect(component.service_provider_admin_array).not.toBe('');
    });
    it('checking the value of providerAdminList should not be null and shoul have some value', () => {
      expect(component.providerAdminList).not.toBe('');
    });

  });

});
