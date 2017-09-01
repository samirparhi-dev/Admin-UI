import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import {MdDatepickerModule,MdInputModule,MdNativeDateModule,MdTooltipModule,
  MdRadioModule, MdSelectModule, MdButtonModule, MaterialModule, MdMenuModule,
  MdGridListModule, MdCardModule, MdDialogModule, MdCheckboxModule, MdSliderModule
} from '@angular/material';
import { Md2Module } from 'md2';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
// login components
import { loginContentClass } from './login/login.component';
import { ResetComponent } from './resetPassword/resetPassword.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { SetSecurityQuestionsComponent } from './set-security-questions/set-security-questions.component';
// directives
import { myPassword } from './directives/password/myPassword.directive';
import { myName } from './directives/name/myName.directive';
import { myMobileNumber } from './directives/MobileNumber/myMobileNumber.directive';
import { myEmail } from './directives/email/myEmail.directive';
// multi role screen component
import { MultiRoleScreenComponent } from './multi-role-screen/multi-role-screen.component';
import { ServiceRoleSelectionComponent } from './service-role-selection/service-role-selection.component';
// admin components
import { SuperAdminComponent } from './super-admin/super-admin.component'
import { AdminServiceProviderComponent } from './admin-service-provider/admin-service-provider.component';
import { AdminLanguageMasterComponent } from './admin-language-master/admin-language-master.component';
import { AdminRoleMasterComponent } from './admin-role-master/admin-role-master.component';
import { AdminServiceMasterComponent } from './admin-service-master/admin-service-master.component';
import { AdminScreenMasterComponent } from './admin-screen-master/admin-screen-master.component';
import { AdminStateServiceComponent } from './admin-state-service/admin-state-service.component';
import { ProviderOnBoardComponent } from './provider-on-board/provider-on-board.component';
import { BlockServiceProviderComponent } from './block-service-provider/block-service-provider.component';
import { CreateGenderComponent } from './create-gender/create-gender.component';
import { CreateQualificationComponent } from './create-qualification/create-qualification.component';
import { CreateCasteComponent } from './create-caste/create-caste.component';
import { CreateReligionComponent } from './create-religion/create-religion.component';
import { CreateStateComponent } from './create-state/create-state.component';
import { NewServiceProviderSetupComponent } from './new-service-provider-setup/new-service-provider-setup.component';
import { ProviderAdminRoleMasterComponent } from './provider-admin-role-master/provider-admin-role-master.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { EmployeeDetailsCapturingComponent } from './employee-details-capturing/employee-details-capturing.component';
import { LocationServicelineMappingComponent } from './location-serviceline-mapping/location-serviceline-mapping.component';
import { ProviderAdminComponent } from './provider-admin/provider-admin.component';
import { CallDispositionTypeMasterComponent } from './call-disposition-type-master/call-disposition-type-master.component';
import { CategorySubcategoryProvisioningComponent } from './category-subcategory-provisioning/category-subcategory-provisioning.component';
import { DrugMasterComponent } from './drug-master/drug-master.component';


import { EditLocationModal } from './location-serviceline-mapping/location-serviceline-mapping.component';
import { EditEmployeeDetailsModal } from './employee-master/employee-master.component';

// services
import { loginService } from './services/loginService/login.service';
import { RegisterService } from './services/register-services/register-service';
import { dataService } from './services/dataService/data.service';
import { DashboardHttpServices } from './http-service/http-service.service';
import { SPService } from './services/adminServices/AdminServiceProvider/admin_service_provider.service';
import { UserService } from './services/adminServices/AdminUser/user.service';
import { LanguageService } from './services/adminServices/AdminLanguage/language.service';
import { RoleService } from './services/adminServices/AdminRole/Role.service';
import { ServicemasterService } from './services/adminServices/AdminService/servicemaster.service';
import { ScreenService } from './services/adminServices/AdminScreen/screen.service';
import { HttpServices } from './services/http-services/http_services.service';
import { UserBeneficiaryData } from './services/common/userbeneficiarydata.service'
import { LocationService } from "./services/common/location.service";
import { CoReferralService } from "./services/coService/co_referral.service";
import { CoFeedbackService } from "./services/coService/co_feedback.service";
import { FeedbackTypes } from "./services/common/feedbacktypes.service";
import { UpdateService } from "./services/update-services/update-service";
import { CallServices } from "./services/callservices/callservice.service";
import { ConfigService } from "./services/config/config.service";
import { StateServiceMapp } from "./services/adminServices/AdminServiceProvider/Stateservice.service";
import { SuperAdmin_ServiceProvider_Service } from "./services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service";
import { ProviderAdminRoleService } from "./services/ProviderAdminServices/state-serviceline-role.service";
import { LocationServicelineMapping } from "./services/ProviderAdminServices/location-serviceline-mapping.service";
import { EmployeeMasterService } from "./services/ProviderAdminServices/employee-master-service.service";
import { CallTypeSubtypeService } from "./services/ProviderAdminServices/calltype-subtype-master-service.service";


@NgModule( {
  declarations: [
  AppComponent,loginContentClass,ResetComponent,myPassword,MultiRoleScreenComponent,
  AdminServiceProviderComponent,myName,myMobileNumber,myEmail,
  ServiceRoleSelectionComponent,SuperAdminComponent,AdminLanguageMasterComponent,
  AdminRoleMasterComponent,AdminServiceMasterComponent,AdminScreenMasterComponent,
  SetSecurityQuestionsComponent,SetPasswordComponent,ProviderOnBoardComponent,
  BlockServiceProviderComponent,AdminStateServiceComponent,CreateGenderComponent,
  CreateQualificationComponent, CreateCasteComponent, CreateReligionComponent,
  CreateStateComponent,NewServiceProviderSetupComponent,ProviderAdminRoleMasterComponent,
  EmployeeMasterComponent, EmployeeDetailsCapturingComponent,
    LocationServicelineMappingComponent, ProviderAdminComponent, EditLocationModal, EditEmployeeDetailsModal, CallDispositionTypeMasterComponent, CategorySubcategoryProvisioningComponent, DrugMasterComponent
  ],

  imports: [
  BrowserModule,
  FormsModule,
  HttpModule,
  MaterialModule,
  MdMenuModule,
  MdDatepickerModule,
  MdNativeDateModule,
  ReactiveFormsModule,
  NgxPaginationModule,
  MdInputModule,
  MdTooltipModule,
  BrowserAnimationsModule,
  MdRadioModule,
  MdSelectModule,
  MdButtonModule,
  MdGridListModule,
  MdCardModule,
  Md2Module,
  MdDialogModule,
  MdCheckboxModule,
  MdSliderModule,
  RouterModule.forRoot( [
  {
    path: 'resetPassword',
    component: ResetComponent
  },
  {
    path: 'loginContentClass',
    component: loginContentClass
  },
  {
    path: 'setQuestions',
    component: SetSecurityQuestionsComponent
  },
  {
    path: 'MultiRoleScreenComponent',
    component: MultiRoleScreenComponent,
    children: [
    {
      path: '',
      component: ServiceRoleSelectionComponent,
      outlet: 'postLogin_router'
    },
    {
      path: 'superAdmin',
      component: SuperAdminComponent,
      outlet: 'postLogin_router'
    },
    {
      path: 'providerAdmin',
      component: ProviderAdminComponent,
      outlet: 'postLogin_router'
    }
    ]
  },
  {
    path: 'setPassword',
    component: SetPasswordComponent
  },
  {
    path: '',
    redirectTo: '/loginContentClass',
    pathMatch: 'full'
  }
  ] ) ],

  providers: [ 
  loginService, dataService, DashboardHttpServices, SPService,
  RegisterService,UserService, LanguageService, RoleService,ServicemasterService,
  ScreenService, HttpServices,UserBeneficiaryData,LocationService, CoReferralService,
  CoFeedbackService, FeedbackTypes,UpdateService, CallServices, ConfigService,
  StateServiceMapp, SuperAdmin_ServiceProvider_Service, ProviderAdminRoleService,
    LocationServicelineMapping, EmployeeMasterService, CallTypeSubtypeService
  ],

  entryComponents: [ 
    EditLocationModal,
    EditEmployeeDetailsModal
   ],

  bootstrap: [ AppComponent ]
} )

export class AppModule { }
