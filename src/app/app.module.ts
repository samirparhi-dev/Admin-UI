import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import {
  MdDatepickerModule, MdInputModule, MdNativeDateModule, MdTooltipModule,
  MdRadioModule, MdSelectModule, MdButtonModule, MaterialModule, MdMenuModule,
  MdGridListModule, MdCardModule, MdDialogModule, MdCheckboxModule, MdSliderModule
} from '@angular/material';
import { Md2Module } from 'md2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
import { myUserName } from './directives/address/myAddress.directive';

import { myAddress } from './directives/address/myAddress.directive';
import { myProviderName } from './directives/name/myName.directive';
import { PAN } from './directives/name/myName.directive';
import { InterceptedHttp } from './http.interceptor'
import { ConfirmationDialogsService } from './services/dialog/confirmation.service'
import { httpFactory } from './http.factory';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/common/loader.service';
// multi role screen component
import { MultiRoleScreenComponent } from './multi-role-screen/multi-role-screen.component';
import { ServiceRoleSelectionComponent } from './service-role-selection/service-role-selection.component';
// admin components
import { SuperAdminComponent } from './super-admin/super-admin.component'
import { AdminLanguageMasterComponent } from './admin-language-master/admin-language-master.component';
import { AdminRoleMasterComponent } from './admin-role-master/admin-role-master.component';
import { AdminServiceMasterComponent } from './admin-service-master/admin-service-master.component';
import { AdminScreenMasterComponent } from './admin-screen-master/admin-screen-master.component';
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
import { EditCallType } from './call-disposition-type-master/call-disposition-type-master.component';
import { CategorySubcategoryProvisioningComponent } from './category-subcategory-provisioning/category-subcategory-provisioning.component';
import { DrugMasterComponent } from './drug-master/drug-master.component';
import { DrugGroupComponent } from './drug-group/drug-group.component';
import { DrugListComponent } from './drug-list/drug-list.component';
import { DrugMappingComponent } from './drug-mapping/drug-mapping.component';
import { ZoneMasterComponent } from './zone-master/zone-master.component';
import { ZoneComponent } from './zone-list/zone.component';
import { ZoneDistrictMappingComponent } from './zone-district-mapping/zone-district-mapping.component';
import { ParkingPlaceComponent } from './parking-place-master/parking-place-master.component';
import { ServicePointComponent } from './service-point-master/service-point.component';
import { ServicePointVillageMapComponent } from './service-point-village-mapping/service-point-village-mapping.component';
import { VanComponent } from './van-master/van-master.component';
import { VanTypeComponent } from './van-type-master/van-type-master.component';
import { VanServicePointMappingComponent } from './van-service-point-mapping/van-service-point-mapping.component';
import { EmployeeParkingPlaceMappingComponent } from './employee-parking-place-mapping/employee-parking-place-mapping.component';

import { CommonDialogComponent } from './common-dialog/common-dialog.component'

import { EditLocationModal } from './location-serviceline-mapping/location-serviceline-mapping.component';
import { EditEmployeeDetailsModal } from './employee-master/employee-master.component';
import { UpdateServiceProviderComponent } from './update-service-provider/update-service-provider.component';
import { EditFeedbackModal } from './feedback-type-master/feedback-type-master.component';


// services
import { loginService } from './services/loginService/login.service';
import { dataService } from './services/dataService/data.service';
import { DashboardHttpServices } from './http-service/http-service.service';
import { LanguageService } from './services/adminServices/AdminLanguage/language.service';
import { RoleService } from './services/adminServices/AdminRole/Role.service';
import { ServicemasterService } from './services/adminServices/AdminService/servicemaster.service';
import { ScreenService } from './services/adminServices/AdminScreen/screen.service';
import { HttpServices } from './services/http-services/http_services.service';
import { UserBeneficiaryData } from './services/common/userbeneficiarydata.service'
import { LocationService } from './services/common/location.service';
import { FeedbackTypes } from './services/common/feedbacktypes.service';
import { CallServices } from './services/callservices/callservice.service';
import { ConfigService } from './services/config/config.service';
import { SuperAdmin_ServiceProvider_Service } from './services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';
import { ProviderAdminRoleService } from './services/ProviderAdminServices/state-serviceline-role.service';
import { LocationServicelineMapping } from './services/ProviderAdminServices/location-serviceline-mapping.service';
import { EmployeeMasterService } from './services/ProviderAdminServices/employee-master-service.service';
import { CallTypeSubtypeService } from './services/ProviderAdminServices/calltype-subtype-master-service.service';
import { BlockProvider } from './services/adminServices/AdminServiceProvider/block-provider-service.service';
import { DrugMasterService } from './services/ProviderAdminServices/drug-master-services.service';
import { CategorySubcategoryService } from './services/ProviderAdminServices/category-subcategory-master-service.service';
import { FeedbackTypeService } from './services/ProviderAdminServices/feedback-type-master-service.service';

import { ZoneMasterService } from './services/ProviderAdminServices/zone-master-services.service';
import { ParkingPlaceMasterService } from './services/ProviderAdminServices/parking-place-master-services.service';
import { ServicePointMasterService } from './services/ProviderAdminServices/service-point-master-services.service';
import { ServicePointVillageMapService } from './services/ProviderAdminServices/service-point-village-map.service';
import { VanMasterService } from './services/ProviderAdminServices/van-master-service.service';
import { VanTypeMasterService } from './services/ProviderAdminServices/van-type-master.service';
import { VanServicePointMappingService } from './services/ProviderAdminServices/van-service-point-mapping.service';
import { EmployeeParkingPlaceMappingService } from './services/ProviderAdminServices/employee-parking-place-mapping.service';

import { SeverityTypeService } from './services/ProviderAdminServices/severity-type-service';

import { CreateSubServiceComponent } from './create-sub-service/create-sub-service.component';
import { EditProviderDetailsComponent } from './edit-provider-details/edit-provider-details.component';
import { SeverityTypeComponent } from './severity-type/severity-type.component';
import { FeedbackTypeComponent } from './feedback-type/feedback-type.component';
import { EditSeverityModalComponent } from './severity-type/severity-type.component';
import { EditCategorySubcategoryComponent } from './category-subcategory-provisioning/edit-category-subcategory/edit-category-subcategory.component';
import { FeedbackTypeMasterComponent } from './feedback-type-master/feedback-type-master.component';
import { FeedbackComplaintNatureMasterComponent } from './feedback-complaint-nature-master/feedback-complaint-nature-master.component';



@NgModule({
  declarations: [

    AppComponent, loginContentClass, ResetComponent, myPassword, MultiRoleScreenComponent,
    myName, myMobileNumber, myEmail, myAddress, myProviderName, PAN, myUserName,
    ServiceRoleSelectionComponent, SuperAdminComponent, AdminLanguageMasterComponent,
    AdminRoleMasterComponent, AdminServiceMasterComponent, AdminScreenMasterComponent,
    SetSecurityQuestionsComponent, SetPasswordComponent, ProviderOnBoardComponent,
    BlockServiceProviderComponent, CreateGenderComponent,
    CreateQualificationComponent, CreateCasteComponent, CreateReligionComponent,
    CreateStateComponent, NewServiceProviderSetupComponent, ProviderAdminRoleMasterComponent, UpdateServiceProviderComponent,
    EmployeeMasterComponent, EmployeeDetailsCapturingComponent, DrugGroupComponent, DrugListComponent, DrugMappingComponent,
    LocationServicelineMappingComponent, ProviderAdminComponent, EditLocationModal, EditEmployeeDetailsModal,
    CallDispositionTypeMasterComponent, EditSeverityModalComponent, EditCallType,
    CategorySubcategoryProvisioningComponent, DrugMasterComponent, CreateSubServiceComponent, EditProviderDetailsComponent,
    ZoneMasterComponent, ZoneComponent, ZoneDistrictMappingComponent, ParkingPlaceComponent, ServicePointComponent,
    CommonDialogComponent, LoaderComponent, ServicePointVillageMapComponent, SeverityTypeComponent, FeedbackTypeComponent,EditFeedbackModal,
    VanComponent, VanTypeComponent, VanServicePointMappingComponent, EmployeeParkingPlaceMappingComponent, EditCategorySubcategoryComponent, FeedbackTypeMasterComponent, FeedbackComplaintNatureMasterComponent

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
    RouterModule.forRoot([
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
    ])],

  providers: [
    loginService, dataService, DashboardHttpServices, RoleService, ServicemasterService,
    ScreenService, HttpServices, UserBeneficiaryData, LocationService, FeedbackTypes,
    CallServices, ConfigService, SuperAdmin_ServiceProvider_Service, ProviderAdminRoleService,
    LocationServicelineMapping, EmployeeMasterService, CallTypeSubtypeService, BlockProvider,
    DrugMasterService, CategorySubcategoryService, ZoneMasterService, ParkingPlaceMasterService, ServicePointMasterService,
    ConfirmationDialogsService, LoaderService, SeverityTypeService, {
      provide: InterceptedHttp,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService, ConfirmationDialogsService]
    },
    ServicePointVillageMapService, VanMasterService, VanTypeMasterService, VanServicePointMappingService, EmployeeParkingPlaceMappingService,
    FeedbackTypeService
  ],

  entryComponents: [
    EditLocationModal,
    EditEmployeeDetailsModal,
    EditProviderDetailsComponent,
    CommonDialogComponent,
    EditSeverityModalComponent,
    EditCallType,
    EditCategorySubcategoryComponent,
    EditFeedbackModal
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
