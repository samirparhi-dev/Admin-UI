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
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import {
  MdDatepickerModule, MdInputModule, MdNativeDateModule, MdTooltipModule,
  MdRadioModule, MdSelectModule, MdButtonModule, MdMenuModule,
  MdGridListModule, MdCardModule, MdDialogModule, MdCheckboxModule, MdSliderModule, MdAutocompleteModule
} from '@angular/material';
import { MaterialModule } from './material.module';
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
import { myName2 } from './directives/name/myName.directive';
import { agentID_one } from './directives/name/myName.directive';
import { agentID_two } from './directives/name/myName.directive';
import { myMobileNumber } from './directives/MobileNumber/myMobileNumber.directive';
import { myEmail } from './directives/email/myEmail.directive';
import { StringValidator } from './directives/stringValidator/stringValidator.directive';
import { myUserName } from './directives/address/myAddress.directive';
import { myAddress } from './directives/address/myAddress.directive';
import { myProviderName } from './directives/name/myName.directive';
import { VehicleNO } from './directives/name/myName.directive';
import { VehicleNONew } from './directives/name/myName.directive';
import { PAN } from './directives/name/myName.directive';
import { DLNO } from './directives/name/myName.directive';
import { measuringUnit } from './directives/name/myName.directive';
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
import { ZoneComponent } from './zone-list/zone.component';
import { ZoneDistrictMappingComponent } from './zone-district-mapping/zone-district-mapping.component';
import { ParkingPlaceComponent } from './parking-place-master/parking-place-master.component';
import { ServicePointComponent } from './service-point-master/service-point.component';
import { ServicePointVillageMapComponent } from './service-point-village-mapping/service-point-village-mapping.component';
import { VanComponent } from './van-master/van-master.component';
import { VanTypeComponent } from './van-type-master/van-type-master.component';
import { VanServicePointMappingComponent } from './van-service-point-mapping/van-service-point-mapping.component';
import { EmployeeParkingPlaceMappingComponent } from './employee-parking-place-mapping/employee-parking-place-mapping.component';
import { VillageMasterComponent } from './village-master/village-master.component';
import { EditVillageModal } from './village-master/village-master.component';

import { CommonDialogComponent } from './common-dialog/common-dialog.component'

import { EditLocationModal } from './location-serviceline-mapping/location-serviceline-mapping.component';
import { EditEmployeeDetailsModal } from './employee-master/employee-master.component';
import { UpdateServiceProviderComponent } from './update-service-provider/update-service-provider.component';
import { EditFeedbackModal } from './feedback-type-master/feedback-type-master.component';
import { EditFeedbackNatureModal } from './feedback-complaint-nature-master/feedback-complaint-nature-master.component';


// services
import { loginService } from './services/loginService/login.service';
import { dataService } from './services/dataService/data.service';
import { DashboardHttpServices } from './http-service/http-service.service';
import { LanguageService } from './services/adminServices/AdminLanguage/language.service';
import { RoleService } from './services/adminServices/AdminRole/role.service';
import { ServicemasterService } from './services/adminServices/AdminService/servicemaster.service';
import { ScreenService } from './services/adminServices/AdminScreen/screen.service';
import { HttpServices } from './services/http-services/http_services.service';
import { UserBeneficiaryData } from './services/common/userbeneficiarydata.service'
import { LocationService } from './services/common/location.service';
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

import { ZoneMasterService } from './services/ProviderAdminServices/zone-master-services.service';
import { ParkingPlaceMasterService } from './services/ProviderAdminServices/parking-place-master-services.service';
import { ServicePointMasterService } from './services/ProviderAdminServices/service-point-master-services.service';
import { ServicePointVillageMapService } from './services/ProviderAdminServices/service-point-village-map.service';
import { VanMasterService } from './services/ProviderAdminServices/van-master-service.service';
import { ProcedureMasterServiceService } from './services/ProviderAdminServices/procedure-master-service.service';
import { ProcedureComponentMappingServiceService } from './services/ProviderAdminServices/procedure-component-mapping-service.service';
import { ComponentMasterServiceService } from './services/ProviderAdminServices/component-master-service.service';
import { VanTypeMasterService } from './services/ProviderAdminServices/van-type-master.service';
import { VanServicePointMappingService } from './services/ProviderAdminServices/van-service-point-mapping.service';
import { EmployeeParkingPlaceMappingService } from './services/ProviderAdminServices/employee-parking-place-mapping.service';
import { VillageMasterService } from './services/adminServices/AdminVillage/village-master-service.service';

import { SeverityTypeService } from './services/ProviderAdminServices/severity-type-service';

import { CreateSubServiceComponent } from './create-sub-service/create-sub-service.component';
import { EditProviderDetailsComponent } from './edit-provider-details/edit-provider-details.component';
import { SeverityTypeComponent } from './severity-type/severity-type.component';
import { FeedbackTypeComponent } from './feedback-type/feedback-type.component';
import { EditSeverityModalComponent } from './severity-type/severity-type.component';
import { EditCategorySubcategoryComponent } from './category-subcategory-provisioning/edit-category-subcategory/edit-category-subcategory.component';

import { FeedbackTypeMasterComponent } from './feedback-type-master/feedback-type-master.component';
import { FeedbackComplaintNatureMasterComponent } from './feedback-complaint-nature-master/feedback-complaint-nature-master.component';
// import { FeedbackTypeService } from './services/ProviderAdminServices/feedback-type-master-service.service';
import { InstituteDirectoryMasterComponent } from './institute-directory-master/institute-directory-master.component';
import { EditInstituteDirectory } from './institute-directory-master/institute-directory-master.component';
import { InstituteDirectoryMasterService } from './services/ProviderAdminServices/institute-directory-master-service.service';

import { FeedbackTypeService } from './services/ProviderAdminServices/feedback-type-master-service.service';

import { HospitalMasterComponent } from './hospital-master/hospital-master.component';
import { HospitalMasterService } from './services/ProviderAdminServices/hospital-master-service.service';
import { EditHospitalModal } from './hospital-master/hospital-master.component';

import { InstituteSubdirectoryMasterComponent } from './institute-subdirectory-master/institute-subdirectory-master.component';
import { InstituteSubDirectoryMasterService } from './services/ProviderAdminServices/institute-subdirectory-master-service.service';
import { EditInstituteSubDirectory } from './institute-subdirectory-master/institute-subdirectory-master.component';

import { HospitalInstituteDirectorySubdirectoryMappingComponent } from './hospital-institute-directory-subdirectory-mapping/hospital-institute-directory-subdirectory-mapping.component';
import { HospitalInstituteMappingService } from './services/ProviderAdminServices/hospital-institute-mapping-service.service';

import { ProvideCtiMappingComponent } from './provide-cti-mapping/provide-cti-mapping.component';

import { AgentListCreationComponent } from './agent-list-creation/agent-list-creation.component';
import { AgentListCreationService } from './services/ProviderAdminServices/agent-list-creation-service.service';

import { InstituteTypeMasterComponent } from './institute-type-master/institute-type-master.component';
import { InstituteTypeMasterService } from './services/ProviderAdminServices/institute-type-master-service.service';
import { EditInstituteType } from './institute-type-master/institute-type-master.component';

import { UserRoleAgentIDMappingComponent } from './user-role-agent-id-mapping/user-role-agent-id-mapping.component';
import { UserRoleAgentID_MappingService } from './services/ProviderAdminServices/user-role-agentID-mapping-service.service';
import { AgentIDMappingModal } from './user-role-agent-id-mapping/user-role-agent-id-mapping.component';
import { ServiceProviderMasterComponent } from './service-provider-master/service-provider-master.component';
// tslint:disable-next-line:max-line-length
import { ProviderServicelineStateMappingComponent } from './provider-serviceline-state-mapping/provider-serviceline-state-mapping.component';

import { AuthService } from './services/authentication/auth.service';
import { SecurityFactory } from './http.security.factory';
import { SecurityInterceptedHttp } from './http.securityinterceptor';

import { ProviderAdminListComponent } from './provider-admin-list/provider-admin-list.component';
import { EditProviderAdminModal } from './provider-admin-list/provider-admin-list.component';
import { EmployeeMasterNewComponent } from './employee-master-new/employee-master-new.component';
import { EmployeeMasterNewServices } from './services/ProviderAdminServices/employee-master-new-services.service';
import { OrderByPipe } from './order-by.pipe';
import { UtcDatePipe } from './utc-date.pipe';

import { ProcedureMasterComponent } from './procedure-master/procedure-master.component';
import { ComponentMasterComponent } from './component-master/component-master.component';
import { ProcedureComponentMappingComponent } from './procedure-component-mapping/procedure-component-mapping.component';
import { MappingProviderAdminToProviderComponent } from './mapping-provider-admin-to-provider/mapping-provider-admin-to-provider.component';
import { LanguageMappingComponent } from './language-mapping/language-mapping.component';
import { LanguageMapping } from './services/ProviderAdminServices/language-mapping.service';
import { WorkLocationMappingComponent } from './work-location-mapping/work-location-mapping.component';
import { WorkLocationMapping } from './services/ProviderAdminServices/work-location-mapping.service';
import { FacilityTypeMasterComponent } from './facility-type-master/facility-type-master.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { EditItemMasterModal } from './item-master/item-master.component';
import { MainStoreAndSubStoreComponent } from './main-store-and-sub-store/main-store-and-sub-store.component';
import { AuthGuard } from './services/authGuardService/auth-guard.services';


/*Inventory Services*/
import { CommonServices } from './services/inventory-services/commonServices';
import { ItemService } from './services/inventory-services/item.service';
import { ItemCategoryService } from './services/inventory-services/item-category.service'
import { PharmacologicalMasterService } from './services/inventory-services/pharmacological-category-service';
import { ItemFormService } from './services/inventory-services/item-form-service';
import { RouteofAdminService } from './services/inventory-services/route-of-admin.service';
import { ManufacturemasterService } from './services/inventory-services/manufacturemaster.service';
import { PhysicalstockService } from './services/inventory-services/physicalstock.service';

import { ItemFacilityMappingService } from './services/inventory-services/item-facility-mapping.service';
import { StoreSelfConsumptionServiceService } from './services/inventory-services/store-self-consumption-service.service';

import { FacilityMasterService } from './services/inventory-services/facilitytypemaster.service';
import { Mainstroreandsubstore } from './services/inventory-services/mainstoreandsubstore.service';
import { SuppliermasterService } from './services/inventory-services/suppliermaster.service';
import { ItemIssueMethodConfigComponent } from './item-issue-method-config/item-issue-method-config.component';
import { ItemToStoreMappingComponent } from './item-to-store-mapping/item-to-store-mapping.component';
import { SupplierMasterComponent } from './supplier-master/supplier-master.component';
import { ManufacturerMasterComponent } from './manufacturer-master/manufacturer-master.component';
import { PharmacologicalCategoryMasterComponent } from './pharmacological-category-master/pharmacological-category-master.component';
import { ItemCategoryMasterComponent } from './item-category-master/item-category-master.component';
import { StoreSelfConsumptionComponent } from './store-self-consumption/store-self-consumption.component';
import { ItemFormMasterComponent } from './item-form-master/item-form-master.component';
import { RouteOfAdminComponent } from './route-of-admin/route-of-admin.component';
import { CreateUomMasterComponent } from './uom-master/create-uom-master/create-uom-master.component';
import { SearchUomMasterComponent } from './uom-master/search-uom-master/search-uom-master.component';
import { EditItemCategoryComponent } from './item-category-master/edit-item-category/edit-item-category.component';

import { UomMasterService } from './services/inventory-services/uom-master.service';
import { UpdateUomMasterComponent } from './uom-master/update-uom-master/update-uom-master.component';
import { CreateStoreMappingComponent } from './store-mapping/create-store-mapping/create-store-mapping.component';
import { UpdateStoreMappingComponent } from './store-mapping/update-store-mapping/update-store-mapping.component';
import { ViewStoreMappingComponent } from './store-mapping/view-store-mapping/view-store-mapping.component';
import { ExpiryDateAlertConfigurationComponent } from '././expiry-date-alert-configuration/expiry-date-alert-configuration.component';
import { StoreMappingService } from './services/inventory-services/store-mapping.service';
import { ExpiryAlertConfigurationService } from './services/inventory-services/expiryalertconfiguration.service';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';

import { EmailConfigurationService } from './services/ProviderAdminServices/email-configuration-services.service';
import { ResetUserPasswordComponent } from './reset-user-password/reset-user-password.component';
import { ResetUserPasswordService } from './services/ProviderAdminServices/reset-user-password.service';
import { DrugStrengthComponent } from './drug-strength/drug-strength.component';
import { DrugStrengthService } from './services/ProviderAdminServices/drug-strength.service';
import { ParkingPlaceSubDistrictMappingComponent } from './parking-place-sub-district-mapping/parking-place-sub-district-mapping.component';
import {
  NatureOfComplaintCategoryMappingComponent
} from './nature-of-complaint-category-mapping/nature-of-complaint-category-mapping.component';
import { NatureOfCompaintCategoryMappingService } from './services/ProviderAdminServices/nature-of-complaint-category-mapping.service';
import { SpecialistMappingComponent } from './specialist-mapping/specialist-mapping.component';
import { SpecialistMappingService } from './services/ProviderAdminServices/specialist-mapping.service';
import { SwymedUserMappingComponent } from './swymed-user-mapping/swymed-user-mapping.component';
import { SwymedUserConfigurationService } from './services/ProviderAdminServices/swymed-user-service';
import { MappedVansComponent } from './mapped-vans/mapped-vans.component';
import { ViewVersionDetailsComponent } from './view-version-details/view-version-details.component';
import { WrapupTimeConfigurationComponent } from './wrapup-time-configuration/wrapup-time-configuration.component';
import { WrapupTimeConfigurationService } from './services/ProviderAdminServices/wrapup-time-configuration.service';
import { UserSignatureMappingComponent } from './user-signature-mapping/user-signature-mapping.component';
import { SmsTemplateComponent } from './sms-template/sms-template.component';
import { SmsTemplateService } from './services/adminServices/SMSMaster/sms-template-service.service';
import { adminDataService } from './services/adminServices/SMSMaster/data.service';
import { AddQuestionnaireComponent } from './add-questionnaire/add-questionnaire.component';
import { EditQuestionnaireComponent } from './edit-questionnaire/edit-questionnaire.component';
import { QuestionnaireServiceService } from './services/questionnaire-service.service';
import { ComponentNameSearchComponent } from './component-name-search/component-name-search.component';
import { SnomedCodeSearchComponent } from './snomed-code-search/snomed-code-search.component';
import { SnomedMasterService } from './services/ProviderAdminServices/snomed-master.service';
import { MapSnommedCTCodeComponent } from './map-snommed-ctcode/map-snommed-ctcode.component';
import { NodalOfficerConfigurationComponent } from './nodal-officer-configuration/nodal-officer-configuration.component';
import { NodalOfficerConfigurationService } from './services/ProviderAdminServices/nodal-officer-configuration.service';
import { VanSpokeMappingComponent } from './van-spoke-mapping/van-spoke-mapping.component';
import { VanSpokeMappingService } from './services/ProviderAdminServices/van-spoke-mapping.service';
import { CalibrationMasterComponent } from './calibration-master/calibration-master.component';
import { CallibrationMasterServiceService } from './services/ProviderAdminServices/callibration-master-service.service';
import { ProviderAdminFetosenseTestMasterService } from './services/ProviderAdminServices/fetosense-test-master-service.service';
import { FetosenseTestMasterComponent } from './fetosense-test-master/fetosense-test-master.component';
import { DeviceIdMasterComponent} from './device-id-master/device-id-master.component';
import { FetosenseDeviceIdMasterService } from './services/ProviderAdminServices/fetosense-device-id-master-service.service';
import { VanDeviceIdMappingComponent } from './van-device-id-mapping/van-device-id-mapping.component';
import { userNameDirective } from './directives/userName/userName.directive';
import { userNameWithSpaceDirective } from './directives/userName/userNameWithSpace.directive';
import { textareaDirective } from './directives/textarea/textArea.directive';
import { SmsTemplateDirective } from './directives/smsTemplate/smsTemplate.directive';
import { QuestionnaireDirective } from './directives/questionnaire/questionnaire.directive';
import { itemNameMasterDirective } from './directives/itemNameMaster/itemNameMaster.directive';
import { InputAreaDirective } from './directives/Inputfeild/inputFeild.directive';
import { AnswerDirective } from './directives/answer/answer.directive';
import { DrugStrengthWithCopyPaste } from './directives/drugStrength/drugStrengthWithCopyPaste.directive';
import { MyNameWithCopyPaste, MyProviderNameWithCopyPaste, NameWithSpecialCharCopyPasteDirective, PanWithCopyPaste, VehicleNoWithCopyPaste, VehicleNoWithSpecialCharCopyPaste } from './directives/name/myNameWithCopyPaste.directive';
import { ItemNameWithSpecialCharCopyPasteDirective } from './directives/itemNameMaster/itemNameWithSpecialCharCopyPaste.directive';
import { MyAddressWithCopyPasteDirective } from './directives/address/myAddressWithCopyPaste.directive';
import { TextAreaWithCopyPaste } from './directives/textarea/textAreaWithCopyPaste.directive';
import { MyMobileNumberWithCopyPaste } from './directives/MobileNumber/myMobileNumberWithCopyPaste.directive';
import { DataMappingBlockSubcenterComponent } from './data-mapping-block-subcenter/data-mapping-block-subcenter.component';
import { BlockSubcenterMappingService } from './services/ProviderAdminServices/block-subcenter-mapping-service';

@NgModule({
  declarations: [
    AppComponent, loginContentClass, ResetComponent, myPassword, MultiRoleScreenComponent,
    myName, myName2, agentID_one, agentID_two, myMobileNumber, myEmail, myAddress,
    myProviderName, VehicleNO, VehicleNONew, PAN, DLNO, myUserName, ServiceRoleSelectionComponent, SuperAdminComponent,
    AdminLanguageMasterComponent, AdminRoleMasterComponent, AdminServiceMasterComponent,
    AdminScreenMasterComponent, SetSecurityQuestionsComponent, SetPasswordComponent,
    ProviderOnBoardComponent, BlockServiceProviderComponent, CreateGenderComponent,
    CreateQualificationComponent, CreateCasteComponent, CreateReligionComponent,
    CreateStateComponent, NewServiceProviderSetupComponent, ProviderAdminRoleMasterComponent,
    UpdateServiceProviderComponent, EmployeeMasterComponent, EmployeeDetailsCapturingComponent,
    DrugGroupComponent, DrugListComponent, DrugMappingComponent, LocationServicelineMappingComponent,
    ProviderAdminComponent, EditLocationModal, EditEmployeeDetailsModal,
    CallDispositionTypeMasterComponent, EditSeverityModalComponent, EditCallType,
    CategorySubcategoryProvisioningComponent, DrugMasterComponent, CreateSubServiceComponent,
    EditProviderDetailsComponent, ZoneComponent,
    ZoneDistrictMappingComponent, ParkingPlaceComponent, ServicePointComponent,
    CommonDialogComponent, LoaderComponent, ServicePointVillageMapComponent,
    SeverityTypeComponent, FeedbackTypeComponent, EditFeedbackModal, EditFeedbackNatureModal,
    VanComponent, VanTypeComponent, VanServicePointMappingComponent,
    EmployeeParkingPlaceMappingComponent, EditCategorySubcategoryComponent,
    FeedbackTypeMasterComponent, FeedbackComplaintNatureMasterComponent,
    InstituteDirectoryMasterComponent, EditInstituteDirectory, HospitalMasterComponent,
    EditHospitalModal, InstituteSubdirectoryMasterComponent, EditInstituteSubDirectory,
    HospitalInstituteDirectorySubdirectoryMappingComponent, ProvideCtiMappingComponent,
    AgentListCreationComponent, VillageMasterComponent, InstituteTypeMasterComponent,
    EditInstituteType, UserRoleAgentIDMappingComponent, AgentIDMappingModal,
    ProviderAdminListComponent,
    EditProviderAdminModal, EmployeeMasterNewComponent,
    EditVillageModal, ServiceProviderMasterComponent,
    ProviderServicelineStateMappingComponent,
    ProcedureMasterComponent,
    ComponentMasterComponent, ProcedureComponentMappingComponent,
    MappingProviderAdminToProviderComponent,
    LanguageMappingComponent,
    WorkLocationMappingComponent,
    OrderByPipe, UtcDatePipe,
    FacilityTypeMasterComponent,
    ItemMasterComponent, MainStoreAndSubStoreComponent,
    ItemIssueMethodConfigComponent,
    ItemToStoreMappingComponent,
    SupplierMasterComponent, EditItemMasterModal,
    ManufacturerMasterComponent, PharmacologicalCategoryMasterComponent, ItemCategoryMasterComponent,
    VehicleNO, VehicleNONew,
    StoreSelfConsumptionComponent,
    measuringUnit,
    ItemFormMasterComponent,
    RouteOfAdminComponent,
    ExpiryDateAlertConfigurationComponent,
    CreateUomMasterComponent,
    SearchUomMasterComponent,
    UpdateUomMasterComponent,
    EditItemCategoryComponent,
    CreateStoreMappingComponent,
    UpdateStoreMappingComponent,
    ViewStoreMappingComponent,
    EmailConfigurationComponent,
    ResetUserPasswordComponent,
    DrugStrengthComponent,
    StringValidator,
    ParkingPlaceSubDistrictMappingComponent,
    NatureOfComplaintCategoryMappingComponent,
    SpecialistMappingComponent,
    SwymedUserMappingComponent,
    MappedVansComponent,
    ViewVersionDetailsComponent,
    WrapupTimeConfigurationComponent,
    UserSignatureMappingComponent,
    SmsTemplateComponent,
    AddQuestionnaireComponent,
    EditQuestionnaireComponent,
    ComponentNameSearchComponent,
    SnomedCodeSearchComponent,
    MapSnommedCTCodeComponent,
    NodalOfficerConfigurationComponent,
    VanSpokeMappingComponent,
    CalibrationMasterComponent,
    FetosenseTestMasterComponent,
    DeviceIdMasterComponent,
    VanDeviceIdMappingComponent,
    userNameDirective,
    userNameWithSpaceDirective,
    textareaDirective,
    SmsTemplateDirective,
    QuestionnaireDirective,
    itemNameMasterDirective,
    InputAreaDirective,
    AnswerDirective,
    DrugStrengthWithCopyPaste,
    NameWithSpecialCharCopyPasteDirective,
    TextAreaWithCopyPaste,
    MyAddressWithCopyPasteDirective,
    ItemNameWithSpecialCharCopyPasteDirective,
    VehicleNoWithCopyPaste,
    VehicleNoWithSpecialCharCopyPaste,
    PanWithCopyPaste,
    MyNameWithCopyPaste,
    MyMobileNumberWithCopyPaste,
    MyProviderNameWithCopyPaste,
    DataMappingBlockSubcenterComponent
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
    MdAutocompleteModule,
    RouterModule.forRoot([
     
      {
        path: 'resetPassword',
        component: ResetComponent
      },
      {
        path: 'setQuestions',
        component: SetSecurityQuestionsComponent
      },
      {
        path: 'MultiRoleScreenComponent',
        component: MultiRoleScreenComponent,
        canActivate: [AuthGuard],
        children: [
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
        component: loginContentClass
      }
    ])],

  providers: [
    loginService, dataService, DashboardHttpServices, RoleService, ServicemasterService,
    ScreenService, HttpServices, UserBeneficiaryData, LocationService,
    CallServices, ConfigService, SuperAdmin_ServiceProvider_Service,
    ProviderAdminRoleService, LocationServicelineMapping, EmployeeMasterService,
    CallTypeSubtypeService, BlockProvider, FeedbackTypeService,
    DrugMasterService, CategorySubcategoryService, ZoneMasterService,
    ParkingPlaceMasterService, ServicePointMasterService, ConfirmationDialogsService,
    LoaderService, SeverityTypeService, InstituteDirectoryMasterService,
    ServicePointVillageMapService, VanMasterService, VanTypeMasterService,
    VanServicePointMappingService, EmployeeParkingPlaceMappingService,
    InstituteDirectoryMasterService, FeedbackTypeService, HospitalMasterService, BlockSubcenterMappingService,
    InstituteSubDirectoryMasterService, HospitalInstituteMappingService,
    AgentListCreationService, VillageMasterService, InstituteTypeMasterService,
    UserRoleAgentID_MappingService, AuthService, ProcedureMasterServiceService,
    ProcedureComponentMappingServiceService, AuthGuard,
    ComponentMasterServiceService, LanguageMapping, EmployeeMasterNewServices, WorkLocationMapping, ItemService,
    CommonServices, FacilityMasterService,
    Mainstroreandsubstore, SuppliermasterService, PharmacologicalMasterService, ManufacturemasterService, PhysicalstockService,
    ItemFacilityMappingService, SpecialistMappingService, StoreSelfConsumptionServiceService,
    UomMasterService, ItemCategoryService, ItemFormService, RouteofAdminService, StoreMappingService, ExpiryAlertConfigurationService,
    EmailConfigurationService, ResetUserPasswordService, DrugStrengthService, NatureOfCompaintCategoryMappingService,
    SwymedUserConfigurationService, WrapupTimeConfigurationService,adminDataService,SmsTemplateService,QuestionnaireServiceService,
    SnomedMasterService,NodalOfficerConfigurationService,VanSpokeMappingService,CallibrationMasterServiceService,ProviderAdminFetosenseTestMasterService,
    FetosenseDeviceIdMasterService,
    {
      provide: InterceptedHttp,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService, Router, AuthService, ConfirmationDialogsService]
    },
    {
      provide: SecurityInterceptedHttp,
      useFactory: SecurityFactory,
      deps: [XHRBackend, RequestOptions, Router, AuthService, ConfirmationDialogsService]
    }
  ],

  entryComponents: [
    EditLocationModal,
    EditEmployeeDetailsModal,
    EditProviderDetailsComponent,
    CommonDialogComponent,
    EditSeverityModalComponent,
    EditCallType,
    EditCategorySubcategoryComponent,
    EditFeedbackModal,
    EditFeedbackNatureModal,
    EditCategorySubcategoryComponent,
    EditInstituteDirectory,
    EditHospitalModal,
    EditInstituteSubDirectory,
    EditInstituteType,
    AgentIDMappingModal,
    EditVillageModal,
    EditProviderAdminModal,
    EditItemMasterModal,
    EditItemCategoryComponent,
    MappedVansComponent,
    ViewVersionDetailsComponent,
    EditQuestionnaireComponent,
    ComponentNameSearchComponent,
    SnomedCodeSearchComponent
   
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
