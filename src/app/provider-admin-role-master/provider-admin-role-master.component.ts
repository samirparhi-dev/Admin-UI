import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';

declare var jQuery: any;

@Component({
  selector: 'app-provider-admin-role-master',
  templateUrl: './provider-admin-role-master.component.html',
  styleUrls: ['./provider-admin-role-master.component.css']
})
export class ProviderAdminRoleMasterComponent implements OnInit {

  role: any;
  description: any;
  feature: any;
  screen_name: any;
  sRSMappingID: any;
  editedFeatureID: any;
  existingFeatureID: any;
  serviceProviderID: any;
  state: any;
  service: any;
  toBeEditedRoleObj: any;
  states: any;
  services: any;
  searchresultarray: any;
  userID: any;
  finalResponse: any;
  selectedRole: any;
  STATE_ID: any;
  SERVICE_ID: any;
  confirmMessage : any;
  editScreenName: any;
  filterScreens: any;

  tempFilterScreens: any = [];
  combinedFilterArray: any = [];
  bufferArray: any = [];
  objs: any = [];
  features: any = [];
  editFeatures: any = [];
  tempfeatureMaster: any = [];
  filteredsearchresultarray: any = [];

  // flags
  showRoleCreationForm: boolean = false;
  setEditSubmitButton: boolean = false;
  showAddButtonFlag: boolean = false;
  updateFeaturesToRoleFlag = false;
  showUpdateFeatureButtonFlag = false;
  correctInput: boolean = false;
  showAddButton: boolean = false;
  disableSelection: boolean = false;
  hideAdd: boolean = false;
  noRecordFound: boolean = false;
  othersExist: boolean = false;
  nationalFlag: boolean;

  multipleFeaturesServiceList = [3, 7];

  @ViewChild('addingForm') addingForm: NgForm

  constructor(public ProviderAdminRoleService: ProviderAdminRoleService,
    public commonDataService: dataService,
    private alertService: ConfirmationDialogsService) {
    this.role = "";
    this.description = "";

    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
    this.serviceProviderID = (this.commonDataService.service_providerID).toString();

    // array initialization
    this.states = [];
    this.services = [];
    this.searchresultarray = [];
    this.filteredsearchresultarray = [];
    this.filterScreens = [];
  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.getServiceLines();
  }
  getServiceLines() {
    this.ProviderAdminRoleService.getServiceLinesNew(this.userID).subscribe((response) => {
      this.services = this.successhandeler(response)
    }, (err) => {
      console.log(err, 'error');
    });
  }
  successhandeler(response) {
    return response;
  }
  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.ProviderAdminRoleService.getStatesNew(obj).
      subscribe(response => this.statesSuccesshandeler(response, value), (err) => {
        console.log(err, 'error');
      });
  }
  statesSuccesshandeler(response, value) {
    this.state = '';
    this.states = response;
    this.searchresultarray = [];
    this.filteredsearchresultarray = [];

    if (value.isNational) {
      this.nationalFlag = value.isNational;
      this.setProviderServiceMapID(response[0].providerServiceMapID);
      this.findRoles(undefined, value.serviceID, true)
    }
    else {
      this.nationalFlag = value.isNational;
    }

  }
  setProviderServiceMapID(ProviderServiceMapID) {
    this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
  }
  findRoles(stateID, serviceID, flagValue) {
    this.showAddButtonFlag = flagValue;
    this.STATE_ID = stateID;
    this.SERVICE_ID = serviceID;

    let obj = {
      'serviceProviderID': this.serviceProviderID,
      'stateID': stateID,
      'serviceID': serviceID,
      'isNational': this.nationalFlag
    }
    console.log(this.serviceProviderID, stateID, serviceID);
    this.ProviderAdminRoleService.getRole(obj).subscribe((response) => {
      this.searchresultarray = this.fetchRoleSuccessHandeler(response);
      this.filteredsearchresultarray = this.fetchRoleSuccessHandeler(response);
      this.filterScreens = [];
      for (var i = 0; i < this.searchresultarray.length; i++) {
        this.filterScreens.push(this.searchresultarray[i].screenName);
      }
    }, err => {
      console.log(err, 'error');
    });

    if (serviceID == "" || serviceID == undefined) {
      this.correctInput = false;
    }
    else {
      this.correctInput = true;
      this.showAddButton = true;
    }
  }
  fetchRoleSuccessHandeler(response) {
    if (response.length == 0) {
      this.noRecordFound = true;
    }
    else {
      this.noRecordFound = false;
    }
    return response;
  }
  setRoleFormFlag(flag) {
    this.hideAdd = true;
    this.setEditSubmitButton = false;
    this.showRoleCreationForm = flag;
    this.showAddButtonFlag = !flag;
    this.disableSelection = flag;

    if (!flag) {
      this.role = '';
      this.description = '';
      this.feature = undefined;
      this.selectedRole = undefined;
      this.objs = [];
      this.tempFilterScreens = [];
      this.editScreenName = undefined;
      this.showUpdateFeatureButtonFlag = false;
      this.updateFeaturesToRoleFlag = false;
    }
    else {
      this.getFeatures(this.service.serviceID);
    }

  }
  getFeatures(serviceID) {
    this.ProviderAdminRoleService.getFeature(serviceID)
      .subscribe(response => this.getFeaturesSuccessHandeler(response), err => {
        console.log(err, 'error');
      });
  }
  getFeaturesSuccessHandeler(response) {
    if (this.service.serviceID != 7) {
      let tempFeaturesArray: any = [];
      this.tempfeatureMaster = response;
      this.combinedFilterArray = [];
      this.combinedFilterArray = this.filterScreens.concat(this.tempFilterScreens);
      response.forEach((screenNames) => {
        let index = this.combinedFilterArray.indexOf(screenNames.screenName);
        if (index < 0) {
          tempFeaturesArray.push(screenNames);
        }

      })
      this.features = tempFeaturesArray.slice();
      this.editFeatures = response.filter((obj) => {
        if (obj.screenName == this.editScreenName) {
          this.editedFeatureID = obj.screenID;
        }
        return this.combinedFilterArray.indexOf(obj.screenName) == -1 || obj.screenName == this.editScreenName;
      }, this);
      console.log("editFeatures", this.editFeatures);
    } else {
      this.features = response;
    }
  }

  add_obj(role, desc, feature) {
    var result = this.validateRole(role);
    var selected_features = [];
    if (feature === null) {
      this.alertService.alert("No more features to add");
    }
    if (Array.isArray(feature)) {
      selected_features = feature;
    }
    else {
      selected_features.push(feature);
    }
    if (result) {
      if (this.objs.length < 1) {
        let obj = this.addtempRoleScreenMap(selected_features, role, desc);
        if (obj.roleName.trim().length > 0) {
          this.objs.push(obj);
          this.tempFilterScreens = this.tempFilterScreens.concat(obj.screen_name);
          this.getFeatures(this.service.serviceID);
        }
      }
      else {
        for (let i = 0; i < this.objs.length; i++) {
          if (this.objs[i].roleName.toLowerCase().trim() === role.toLowerCase().trim()) {
            this.alertService.alert("Role name already exists");
            return;
          }
        }
        let obj = this.addtempRoleScreenMap(selected_features, role, desc);
        if (obj.roleName.trim().length > 0 && obj.roleName != undefined) {
          this.objs.push(obj);
          if (this.service.serviceID != 7) {
            this.tempFilterScreens = this.tempFilterScreens.concat(obj.screen_name);
            this.getFeatures(this.service.serviceID);
          }

        }
      }
    }
    jQuery("#roleAddForm").trigger('reset');
    this.feature = undefined;
  }

  validateRole(role) {
    if (this.selectedRole != undefined && this.selectedRole.trim().toUpperCase() === role.trim().toUpperCase()) {
      this.othersExist = false;
    }
    else {
      var count = 0;
      for (let i = 0; i < this.searchresultarray.length; i++) {
        console.log((this.searchresultarray[i].roleName).toUpperCase());
        if ((this.searchresultarray[i].roleName).trim().toUpperCase() === role.trim().toUpperCase()) {
          count = count + 1;
        }
      }
      console.log(count);
      if (count > 0) {
        this.othersExist = true;
        return false;
      }
      else {
        this.othersExist = false;
        return true;
      }
    }
  }
  addtempRoleScreenMap(selected_features, role, desc) {
    let screenIDs = [];
    let screenNames = [];
    for (let z = 0; z < selected_features.length; z++) {
      screenIDs.push(selected_features[z].screenID);
      screenNames.push(selected_features[z].screenName);
    }
    let obj = {
      'roleName': role.trim(),
      'roleDesc': desc,
      'screenID': screenIDs,
      'screen_name': screenNames,
      'createdBy': this.commonDataService.uname,
      'createdDate': new Date(),
      'providerServiceMapID': this.commonDataService.provider_serviceMapID
    }
    return obj;
  }
  deleteRole(roleID, flag) {
    let obj = {
      "roleID": roleID,
      "deleted": flag
    }

    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.alertService.confirm('Confirm', 'Are you sure you want to ' + this.confirmMessage + '?').subscribe((res) => {
      if (res) {
        console.log("obj", obj);
        this.ProviderAdminRoleService.deleteRole(obj).subscribe((response) => {
          console.log('data', response);
          this.findRoles(this.state.stateID, this.service.serviceID, true);
          this.edit_delete_RolesSuccessHandeler('response', 'delete');
        }, err => {
          console.log(err, 'error');
        })

      }
    },
      (err) => {

      })

  }
  finalsave() {
    console.log(this.objs);
    this.ProviderAdminRoleService.createRoles(this.objs)
      .subscribe(response => this.createRolesSuccessHandeler(response), err => {
        console.log(err, 'error');
      });
  }
  createRolesSuccessHandeler(response) {
    this.alertService.alert('Saved successfully', 'success');
    console.log(response, 'in create role success in component.ts');
    this.finalResponse = response;
    if (this.finalResponse[0].roleID) {
      this.objs = []; //empty the buffer array
      this.tempFilterScreens = [];
      this.setRoleFormFlag(false);
      this.findRoles(this.STATE_ID, this.SERVICE_ID, true);
    }

  }
  toBeEditedRoleObject: any;
  editHeading: Boolean = false;
  editRole(roleObj) {
    this.editHeading = true;
    this.showRoleCreationForm = false;
    this.updateFeaturesToRoleFlag = false;
    this.toBeEditedRoleObj = roleObj;
    this.editScreenName = roleObj.screenName;

    this.setRoleFormFlag(true);

    if (this.service.serviceID == 3) {
      this.showUpdateFeatureButtonFlag = true;
    }

    this.sRSMappingID = roleObj.sRSMappingID;
    this.role = roleObj.roleName;
    this.selectedRole = roleObj.roleName;
    this.description = roleObj.roleDesc;
    this.setEditSubmitButton = true;

    this.toBeEditedRoleObj = roleObj;
    this.hideAdd = false;
    this.showAddButtonFlag = false;

    for (let x = 0; x < this.features.length; x++) {
      if (this.features[x].screenName === roleObj.screenName) {
        this.existingFeatureID = this.features[x].screenID;
        break;
      }
    }
    this.editedFeatureID = this.existingFeatureID;
  }
  saveEditChanges() {
    let obj = {
      'roleID': this.toBeEditedRoleObj.roleID,
      'roleName': this.role,
      'roleDesc': this.description,
      // "providerServiceMapID": this.toBeEditedRoleObj.providerServiceMapID,
      'sRSMappingID': this.sRSMappingID,
      'screenID': this.editedFeatureID,
      'createdBy': this.commonDataService.uname,
      'createdDate': new Date()
    }
    this.ProviderAdminRoleService.editRole(obj)
      .subscribe(response => this.edit_delete_RolesSuccessHandeler(response, 'edit'),
        err => {
          console.log(err, 'error');
        });
  }
  edit_delete_RolesSuccessHandeler(response, choice) {
    if (choice == 'edit') {
      this.alertService.alert('Updated successfully', 'success');
    }
    else {
      this.alertService.alert(this.confirmMessage + 'd successfully', 'success');
    }
    console.log(response, 'edit/delete response');
    this.showRoleCreationForm = false;
    this.setEditSubmitButton = false;
    this.findRoles(this.STATE_ID, this.SERVICE_ID, true);
    this.role = '';
    this.description = '';
    this.objs = [];
    this.tempFilterScreens = [];
    this.selectedRole = undefined;
    this.disableSelection = false;
    this.editHeading = false;
    this.showUpdateFeatureButtonFlag = false;
  }
  back(flag) {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.editHeading = false;
        this.setRoleFormFlag(flag);
      }
    })
  }
  remove_obj(index) {
    for (var k = 0; k < this.objs[index].screen_name.length; k++) {
      var delIndex = this.tempFilterScreens.indexOf(this.objs[index].screen_name[k]);
      if (delIndex != -1) {
        this.tempFilterScreens.splice(delIndex, 1);
        this.getFeatures(this.service.serviceID);
      }
    }
    this.objs.splice(index, 1);
  }
  removeFeature(rowIndex, FeatureIndex) {
    this.findRoles(this.STATE_ID, this.SERVICE_ID, false);
    if (rowIndex === 0) {
      for (let h = 0; h < this.tempFilterScreens.length; h++) {
        if (this.tempFilterScreens != undefined && this.objs[0].screen_name[h] != undefined && this.tempFilterScreens[h].toUpperCase() === this.objs[0].screen_name[h].toUpperCase()) {
          this.tempFilterScreens.splice(FeatureIndex, 1);
          this.getFeatures(this.service.serviceID);

        }
        else {
          continue;
        }
      }
    }
    else {
      let indexDel = 0;
      for (let i = 0; i < rowIndex; i++) {
        indexDel += this.objs[i].screen_name.length;

      }
      for (let h = 0; h < this.tempFilterScreens.length; h++) {
        if (this.tempFilterScreens != undefined && this.objs[0].screen_name[h] != undefined && this.tempFilterScreens[h].toUpperCase() === this.objs[0].screen_name[h].toUpperCase()) {
          this.tempFilterScreens.splice(indexDel + FeatureIndex, 1);
          this.getFeatures(this.service.serviceID);

        }
        else {
          continue;
        }
      }
    }
    this.objs[rowIndex].screen_name.splice(FeatureIndex, 1);
    this.objs[rowIndex].screenID.splice(FeatureIndex, 1);
    if (this.objs[rowIndex].screen_name.length === 0 && this.objs[rowIndex].screenID.length === 0) {

      this.objs.splice(rowIndex, 1);
    }
  }

  clear() {
    this.services = [];
    this.searchresultarray = [];
    this.filteredsearchresultarray = [];
    this.filterScreens = [];
    this.showAddButtonFlag = false;
  }

  // UPDATE MORE FEATURES TO ROLE

  role_update: any;
  description_update: any;
  feature_update: any;
  roleID_update: any;

  addMoreFeatures(toBeEditedRoleObject) {
    this.updateFeaturesToRoleFlag = true;
    this.showUpdateFeatureButtonFlag = false;
    this.showRoleCreationForm = false;
    console.log('available features', this.features);
    console.log('Role object to be edited', toBeEditedRoleObject);
    this.role_update = toBeEditedRoleObject.roleName;
    this.description_update = toBeEditedRoleObject.roleDesc;
    this.roleID_update = toBeEditedRoleObject.roleID;

  }
  saveUpdateFeatureChanges() {
    let requestArray = [];

    for (let i = 0; i < this.feature_update.length; i++) {
      let reqObj = {
        'roleID': this.roleID_update,
        'providerServiceMapID': this.commonDataService.provider_serviceMapID,
        'screenID': this.feature_update[i].screenID,
        'createdBy': this.commonDataService.uname
      }
      requestArray.push(reqObj);
    }
    console.log('RequestArray for feature update to role', requestArray);

    this.ProviderAdminRoleService.updateFeatureToRole(requestArray)
      .subscribe(response => {
        console.log(response, 'RESPONSE AFTER UPDATING FEATURE TO ROLE');
        if (response.length > 1) {
          this.alertService.alert('Updated successfully', 'success');
        }
        if (response.length == 1) {
          this.alertService.alert('Updated successfully', 'success');
        }
        this.editHeading = false;
        this.setRoleFormFlag(false);
        this.findRoles(this.STATE_ID, this.SERVICE_ID, true);

      }, err => {
        console.log('ERROR while updating feature to role', err);
        console.log(err, 'error');
      });

  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchresultarray = this.searchresultarray;
    } else {
      this.filteredsearchresultarray = [];
      this.searchresultarray.forEach((item) => {
        for (let key in item) {
          if (key == 'roleName' || key == 'screenName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchresultarray.push(item); break;
            }
          }
        }
      });
    }

  }

}
