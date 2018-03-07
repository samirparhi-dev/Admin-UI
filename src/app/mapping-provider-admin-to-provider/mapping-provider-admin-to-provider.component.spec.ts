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
