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
  othersExist: boolean = false;
  toBeEditedRoleObj: any;


  // arrays
  states: any;
  services: any;
  searchresultarray: any;
  // new content
  filterScreens: any;
  tempFilterScreens: any = [];
  combinedFilterArray: any = [];
  bufferArray: any = [];
  // new content
  objs: any = [];
  finalResponse: any;
  disableSelection: boolean = false;
  selectedRole: any;
  STATE_ID: any;
  SERVICE_ID: any;

  features: any = [];
  editFeatures: any = [];

  editScreenName: any;

  hideAdd: boolean = false;
  // flags
  showRoleCreationForm: boolean = false;
  setEditSubmitButton: boolean = false;
  showAddButtonFlag: boolean = false;

  updateFeaturesToRoleFlag = false;
  showUpdateFeatureButtonFlag = false;
  userID: any;
  nationalFlag: boolean;
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
    this.filterScreens = [];


  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    // this.ProviderAdminRoleService.getStates(this.serviceProviderID).subscribe(response => this.states = this.successhandeler(response));  // commented on 10/4/18(1097 regarding changes) Gursimran
    this.ProviderAdminRoleService.getServiceLinesNew(this.userID).subscribe((response) => {
      this.services = this.successhandeler(response)
    }, (err) => {
      console.log('ERROR in fetching serviceline');
      this.alertService.alert(err, 'error');

    });
    //    this.ProviderAdminRoleService.getRoles(this.serviceProviderID,"","").
    // subscribe(response => this.searchresultarray = this.fetchRoleSuccessHandeler(response));
  }

  getFeatures(serviceID) {
    console.log(serviceID, 'b4 feature get');
    this.ProviderAdminRoleService.getFeature(serviceID)
      .subscribe(response => this.getFeaturesSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });

  }

  // getServices(stateID) {
  //   console.log(this.serviceProviderID, stateID);
  //   this.ProviderAdminRoleService.getServices(this.serviceProviderID, stateID).
  //     subscribe(response => this.servicesSuccesshandeler(response));
  // } //commented on 10/4/18(1097 regarding changes) Gursimran

  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }

    this.ProviderAdminRoleService.getStatesNew(obj).
      subscribe(response => this.statesSuccesshandeler(response, value), (err) => {
        console.log('error in fetching states');
        this.alertService.alert(err, 'error');
      });


  }


  setProviderServiceMapID(ProviderServiceMapID) {
    this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
    console.log('psmid', ProviderServiceMapID);
  }

  // servicesSuccesshandeler(response) {
  //   this.service = '';
  //   this.services = response;
  //   this.showAddButtonFlag = false;

  // }// commented on 10/4/18(1097 regarding changes) Gursimran
  statesSuccesshandeler(response, value) {
    this.state = '';
    this.states = response;
    this.showAddButtonFlag = false;

    if (value.isNational) {
      this.nationalFlag = value.isNational;
      this.setProviderServiceMapID(response[0].providerServiceMapID);
      this.findRoles(undefined, value.serviceID)
    }
    else {
      this.nationalFlag = value.isNational;
    }

  }

  getFeaturesSuccessHandeler(response) {
    console.log("features", response);
    this.combinedFilterArray = [];
    console.log("filterScreens", this.filterScreens);
    console.log("tempFilterScreens", this.tempFilterScreens);
    this.combinedFilterArray = this.filterScreens.concat(this.tempFilterScreens);
    console.log("combinedFilterArray", this.combinedFilterArray);
    this.features = response.filter((obj) => {
      return this.combinedFilterArray.indexOf(obj.screenName) == -1;
    }, this);
    this.editFeatures = response.filter((obj) => {
      if (obj.screenName == this.editScreenName) {
        this.editedFeatureID = obj.screenID;
      }
      return this.combinedFilterArray.indexOf(obj.screenName) == -1 || obj.screenName == this.editScreenName;
    }, this);
    console.log("editFeatures", this.editFeatures);
    if (this.features.length == 0 && this.hideAdd) {
      this.alertService.alert("No features available for mapping");
    }
  }
  correctInput: boolean = false;
  showAddButton: boolean = false;

  findRoles(stateID, serviceID) {
    this.showAddButtonFlag = true;
    this.STATE_ID = stateID;
    this.SERVICE_ID = serviceID;

    let obj = {
      'serviceProviderID': this.serviceProviderID,
      'stateID': stateID,
      'serviceID': serviceID,
      'isNational': this.nationalFlag
    }
    console.log(this.serviceProviderID, stateID, serviceID);
    this.ProviderAdminRoleService.getRoles(obj).subscribe((response) => {
      this.searchresultarray = this.fetchRoleSuccessHandeler(response);
      this.filterScreens = [];
      for (var i = 0; i < this.searchresultarray.length; i++) {
        this.filterScreens.push(this.searchresultarray[i].screenName);
      }
    }, err => {
      this.alertService.alert(err, 'error');
    });

    if (serviceID == "" || serviceID == undefined) {
      this.correctInput = false;
    }
    else {
      this.correctInput = true;
      this.showAddButton = true;

    }

  }

  finalsave() {
    console.log(this.objs);

    this.ProviderAdminRoleService.createRoles(this.objs)
      .subscribe(response => this.createRolesSuccessHandeler(response), err => {
        this.alertService.alert(err, 'error');
      });

  }
  confirmMessage : any;
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
    // let confirmation=confirm("Do you really want to delete the role with id:"+roleID+"?");
    this.alertService.confirm('Confirm', 'Are you sure you want to ' + this.confirmMessage + '?').subscribe((res) => {
      if (res) {
        console.log("obj", obj);
        this.ProviderAdminRoleService.deleteRole(obj).subscribe((response) => {
          console.log('data', response);
          this.findRoles(this.state.stateID, this.service.serviceID);
          this.edit_delete_RolesSuccessHandeler('response', 'delete');
          //this.edit_delete_RolesSuccessHandeler(response, "delete"));          
        }, err => {
          this.alertService.alert(err, 'error');
        })

      }
    },
      (err) => {

      })

  }

  toBeEditedRoleObject: any;
  editRole(roleObj) {
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
          this.alertService.alert(err, 'error');
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
    this.findRoles(this.STATE_ID, this.SERVICE_ID);
    this.role = '';
    this.description = '';
    this.objs = [];
    this.tempFilterScreens = [];
    this.selectedRole = undefined;
    this.disableSelection = false;

    this.showUpdateFeatureButtonFlag = false;
  }

  successhandeler(response) {
    return response;
  }
  noRecordFound: boolean = false;
  fetchRoleSuccessHandeler(response) {
    ;
    console.log(response, 'in fetch role success in component.ts');
    if (response.length == 0) {
      this.noRecordFound = true;
    }
    else {
      this.noRecordFound = false;
    }
    // this.showAddButtonFlag = true;
    // response = response.filter(function(obj){
    //     return obj.deleted!=true;
    // })
    return response;
  }

  createRolesSuccessHandeler(response) {
    this.alertService.alert('Saved successfully', 'success');
    console.log(response, 'in create role success in component.ts');
    this.finalResponse = response;
    if (this.finalResponse[0].roleID) {
      this.objs = []; //empty the buffer array
      this.tempFilterScreens = [];
      this.setRoleFormFlag(false);
      this.findRoles(this.STATE_ID, this.SERVICE_ID);
    }

  }


  setRoleFormFlag(flag) {
    console.log('service', this.service.serviceID);
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
  back(flag) {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.setRoleFormFlag(flag);
      }
    })
  }


  setFeatureName(screen_name) {
    this.screen_name = screen_name;
  }

  add_obj(role, desc, feature) {
    var result = this.validateRole(role);

    var selected_features = [];
    if (Array.isArray(feature)) {
      selected_features = feature;
    }
    else {
      selected_features.push(feature);
    }

    console.log(feature, 'feature wala array');
    if (result) {
      let count = 0;
      if (this.objs.length < 1) {
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

        if (obj.roleName.trim().length > 0) {
          this.objs.push(obj);
          this.tempFilterScreens = this.tempFilterScreens.concat(screenNames);
          this.getFeatures(this.service.serviceID);
        }

        /*for(let z=0;z<feature.length;z++)
        {
          let obj = {
            'roleName': role.trim(),
            'roleDesc': desc,
            'screenID': feature[z].screenID,
            'screen_name':feature[z].screenName,
            'createdBy': this.commonDataService.uname,
            'createdDate': new Date(),
              'providerServiceMapID': this.commonDataService.provider_serviceMapID    // this needs to be fed dynmically!!!
            };

            console.log("Pushed OBJ",obj);
            if(obj.roleName.trim().length>0)
            {
              this.objs.push(obj);
            }

          }*/

      }
      else {
        for (let i = 0; i < this.objs.length; i++) {
          if (this.objs[i].roleName.toLowerCase().trim() === role.toLowerCase().trim()) {
            count = count + 1;
          }
        }
        if (count < 1) {
          /*for(let k=0;k<feature.length;k++)
          {
            let obj = {
              'roleName': role.trim(),
              'roleDesc': desc,
              'screenID': feature[k].screenID,
              'screen_name':feature[k].screenName,
              'createdBy': this.commonDataService.uname,
              'createdDate': new Date(),
            'providerServiceMapID': this.commonDataService.provider_serviceMapID    // this needs to be fed dynmically!!!
          };
          console.log("Pushed OBJ",obj);
          if(obj.roleName.trim().length>0)
          {
            this.objs.push(obj);
          }

        }*/

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

          if (obj.roleName.trim().length > 0) {
            this.objs.push(obj);
            this.tempFilterScreens = this.tempFilterScreens.concat(screenNames);
            this.getFeatures(this.service.serviceID);
          }
        }
      }
    }
    // this.role = '';
    // this.description = '';
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

  clear() {
    this.services = [];
    this.searchresultarray = [];
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
  removeFeature(rowIndex, FeatureIndex) {
    this.objs[rowIndex].screen_name.splice(FeatureIndex, 1);
    this.objs[rowIndex].screenID.splice(FeatureIndex, 1);
    if (this.objs[rowIndex].screen_name.length === 0 && this.objs[rowIndex].screenID.length === 0) {
      this.objs.splice(rowIndex, 1);
    }
  }
  removeObj(index) {
    this.objs.splice(index, 1);
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

        this.setRoleFormFlag(false);
        this.findRoles(this.STATE_ID, this.SERVICE_ID);

      }, err => {
        console.log('ERROR while updating feature to role', err);
        this.alertService.alert(err, 'error');
      });

  }

}
