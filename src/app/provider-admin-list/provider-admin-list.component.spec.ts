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
