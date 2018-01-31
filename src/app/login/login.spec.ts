import { async, tick, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loginContentClass } from './login.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { loginService } from '../services/loginService/login.service';
import { Router } from '@angular/router';
import { MaterialModule, MdGridListModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';




let component: loginContentClass;
let fixture: ComponentFixture<loginContentClass>;

class fakeLoginService {
    superAdminAuthenticate(userID, password) {
        return Observable.of({
            'isAuthenticated': true,
            'key': 1234567890,
            'previlegeObj': [{ 'serviceID': 1 }],
            'Previlege': []

        })
    }

    authenticateUser(userID, password) {
        return Observable.of({
            'isAuthenticated': true,
            'key': 1234567890,
            'previlegeObj': [{ 'serviceID': 1 }],
            'Previlege': [{ 'Role': 'ProviderAdmin' }],
            'Status': 'Active'

        })
    }

    getServiceProviderID() {
        return Observable.of({
            'serviceProviderID': '007'

        })
    }
};
const providerForFakeLoginService = {
    provide: loginService, useClass: fakeLoginService
};

const fakeDataService = {
    Userdata: '',
    role: '',
    uname: '',
    userPriveliges: '',
    uid: '',
    service_providerID: ''
};
const providerForFakeDataService = {
    provide: dataService, useValue: fakeDataService
};

const fakeRouterService = {
    navigate: jasmine.createSpy('navigate')
};
const providerForFakeRoutes = {
    provide: Router, useValue: fakeRouterService
};


describe('LOGIN COMPONENT', () => {

    let loginServiceInstance: loginService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({

            declarations: [loginContentClass],
            imports: [FormsModule, MaterialModule, MdGridListModule, NoopAnimationsModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [providerForFakeLoginService,
                providerForFakeDataService,
                providerForFakeRoutes]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(loginContentClass);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loginServiceInstance = TestBed.get(loginService);

        var store = {};

        spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
            return store[key] || null;
        });
        spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
            delete store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
            return store[key] = <string>value;
        });
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });
    });

    fdescribe('When the Login component is getting loaded', () => {

        it('should be created', () => {
            expect(component).toBeTruthy();
        });

        it('should have password field encrypted', () => {
            const dt = component.dynamictype;
            expect(dt).toEqual('password');
        });

        it('should show the password on icon mouse down by calling showPWD()', fakeAsync(() => {
            spyOn(component, 'showPWD');
            const btn = fixture.debugElement.query(By.css('#eye'));
            btn.triggerEventHandler('mousedown', null);
            const dt = component.dynamictype;
            tick();
            expect(component.showPWD).toHaveBeenCalled();
        }));

        it('should show the password on icon mouse down by setting the type of password field as "text" ', fakeAsync(() => {
            component.showPWD();
            fixture.detectChanges();
            expect(component.dynamictype).toBe('text');
        }));

        it('should hide the password on icon mouse up by calling hidePWD()', fakeAsync(() => {
            spyOn(component, 'hidePWD');
            component.dynamictype = 'text';
            const btn = fixture.debugElement.query(By.css('md-grid-list'));
            btn.triggerEventHandler('mouseup', null);
            const dt = component.dynamictype;
            tick();
            expect(component.hidePWD).toHaveBeenCalled();

        }));

        it('should hide the password on icon mouse up by setting the type of password field as "password"', fakeAsync(() => {
            component.dynamictype = 'text';
            component.hidePWD();
            fixture.detectChanges();
            expect(component.dynamictype).toBe('password');
        }));

        // it('should call Login function, if Login Button clicked/submitted', fakeAsync(() => {
        //     spyOn(component, 'login');
        //     const btn = fixture.debugElement.query(By.css('#login_btn'));
        //     btn.triggerEventHandler('submit', null);
        //     tick();
        //     expect(component.login).toHaveBeenCalled();
        // }));

        it('should authenticate SUPERADMIN on login, if username is SUPERADMIN(case insensitive)', () => {
            component.login('SUPERADMIN', '12345');
            expect(fakeRouterService.navigate).toHaveBeenCalledWith(['/MultiRoleScreenComponent']);
        });

        it('should authenticate on login with status ACTIVE and go inside app', () => {
            component.login('di242323', 'abcde');
            fixture.detectChanges();
            expect(fakeRouterService.navigate).toHaveBeenCalledWith(['/MultiRoleScreenComponent']);

        });

        it('should authenticate on login with status NEW and go to SET SECURITY QUESTION page', () => {

            spyOn(loginServiceInstance, 'authenticateUser').and.returnValue(
                Observable.of({
                    'isAuthenticated': true,
                    'key': 1234567890,
                    'previlegeObj': [{ 'serviceID': 1 }],
                    'Previlege': [{ 'Role': 'ProviderAdmin' }],
                    'Status': 'New'
                })
            )
            component.login('di242323', 'abcde');
            fixture.detectChanges();
            expect(component.status).toBe('new');
            expect(fakeRouterService.navigate).toHaveBeenCalledWith(['/setQuestions']);

        });

        it('should get Service Provider ID if authentication succeeds (except Superadmin login)', () => {
            component.login('di352929', '12345');
            fixture.detectChanges();
            expect(component.serviceProviderID).toBe('007');
        });
    });
});
