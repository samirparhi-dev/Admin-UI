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
import { LanguageMappingComponent } from './language-mapping.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { LanguageMapping } from '../services/ProviderAdminServices/language-mapping.service';
import { not } from '@angular/compiler/src/output/output_ast';

let component: LanguageMappingComponent;
let fixture: ComponentFixture<LanguageMappingComponent>;

const FakeConfirmationDialogsService = {

}

const providerForFakeConfirmationDialogsService = {
  provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
};
const FakeDataService = {
  service_providerID: 'serviceProviderID',
  uname: 'admin'
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};
class FakeLanguageMapping {

  getUserName(data) {
    return Observable.of([{
      userID: '1'
    }])
  }
  getLanguageList() {
    return Observable.of([{
      userLangID: '1'
    }])
  }
  getMappedLanguagesList() {
    return Observable.of([{
      languageID: '1',
      LanguageName: 'english'
    }])
  }
}

const providerForLanguageMappingService = {
  provide: LanguageMapping, useClass: FakeLanguageMapping
};


function InitializeAdminTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageMappingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [Md2Module, FormsModule],
      providers: [providerForFakeConfirmationDialogsService, providerForFakeDataService,
        providerForLanguageMappingService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}
describe('Language-mapping', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    InitializeAdminTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('checking the value of uname should not be null and shoul have some value username', () => {
      expect(component.createdBy).not.toBe('1');
      expect(component.createdBy).toBe('admin');
    });
    it('should set the ProviderServiceId after OnInit', () => {
      expect(component.serviceProviderID).not.toBe('');
      expect(component.serviceProviderID).toBe('serviceProviderID');
    });
    it(' getUserName should be called after OnInit', () => {
      spyOn(component, 'getUserName');
      component.ngOnInit();
      expect(component.getUserName).toHaveBeenCalled;
      expect(component.userNamesList).not.toBe('');
    });
    it('getAllLanguagesList method should be called after OnInit', () => {
      spyOn(component, 'getAllLanguagesList');
      component.ngOnInit();
      expect(component.getAllLanguagesList).toHaveBeenCalled;
    });
    it(' getAllMappedLanguagesList should be called after OnInit', () => {
      spyOn(component, 'getAllMappedLanguagesList');
      component.ngOnInit();
      expect(component.getAllMappedLanguagesList).toHaveBeenCalled;
      expect(component.LanguageMappedList).not.toBe('');
    });
  });

});