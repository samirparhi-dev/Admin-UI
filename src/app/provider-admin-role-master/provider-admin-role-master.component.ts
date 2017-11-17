import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

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
  screen_name:any;

sRSMappingID:any;
editedFeatureID:any;
existingFeatureID:any;


  serviceProviderID: any;
    provider_service_mapID: any = 11;  // has to be dynamic, as of now hardcoded

    state: any;
    service: any;
    othersExist: boolean = false;
    toBeEditedRoleObj: any;


    // arrays
    states: any;
    services: any;
    searchresultarray: any;

    objs: any = [];
    finalResponse: any;
    disableSelection: boolean = false;
    selectedRole: any;
    STATE_ID: any;
    SERVICE_ID: any;

    features: any = [];

    hideAdd: boolean = false;
    // flags
    showRoleCreationForm: boolean = false;
    setEditSubmitButton: boolean = false;
    showAddButtonFlag: boolean = false;

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


      }

      ngOnInit() {
        this.ProviderAdminRoleService.getStates(this.serviceProviderID).subscribe(response=>this.states=this.successhandeler(response));
     //    this.ProviderAdminRoleService.getRoles(this.serviceProviderID,"","").subscribe(response => this.searchresultarray = this.fetchRoleSuccessHandeler(response));
   }

   getFeatures(serviceID)
   {
    console.log(serviceID,"b4 feature get");
    this.ProviderAdminRoleService.getFeature(serviceID).subscribe(response=>this.getFeaturesSuccessHandeler(response));

  }

  getServices(stateID) {
    console.log(this.serviceProviderID, stateID);
    this.ProviderAdminRoleService.getServices(this.serviceProviderID, stateID).subscribe(response => this.servicesSuccesshandeler(response));
  }

  setProviderServiceMapID(ProviderServiceMapID) {
    this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
    console.log("psmid", ProviderServiceMapID);
  }

  servicesSuccesshandeler(response) {
    this.service = "";
    this.services = response;
    this.showAddButtonFlag = false;

  }

  getFeaturesSuccessHandeler(response) {
    console.log("features", response);
    this.features = response;
  }
  correctInput: boolean = false;
  showAddButton: boolean = false;;
  findRoles(stateID, serviceID) {
    this.showAddButtonFlag = true;
    this.STATE_ID = stateID;
    this.SERVICE_ID = serviceID;

    console.log(this.serviceProviderID, stateID, serviceID);
    this.ProviderAdminRoleService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe((response) => {
      this.searchresultarray = this.fetchRoleSuccessHandeler(response);
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

    this.ProviderAdminRoleService.createRoles(this.objs).subscribe(response => this.createRolesSuccessHandeler(response));

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
        this.alertService.confirm("Are you sure you want to " + this.confirmMessage + "?").subscribe((res) => {
          if (res) {
            this.ProviderAdminRoleService.deleteRole(obj).subscribe(response => this.edit_delete_RolesSuccessHandeler(response, "delete"));
          }
        },
        (err) => {

        })

      }

      editRole(roleObj) {

        this.setRoleFormFlag(true);
        this.sRSMappingID=roleObj.sRSMappingID;
        this.role = roleObj.roleName;
        this.selectedRole = roleObj.roleName;
        this.description = roleObj.roleDesc;
        this.setEditSubmitButton = true;

        this.toBeEditedRoleObj = roleObj;
        this.hideAdd = false;
        this.showAddButtonFlag = false;

        for(let x=0;x<this.features.length;x++)
        {
          if(this.features[x].screenName===roleObj.screenName)
          {
            this.existingFeatureID=this.features[x].screenID;
            break;
          }
        }

        this.editedFeatureID=this.existingFeatureID;
      }

      saveEditChanges() {

        let obj = {
          "roleID": this.toBeEditedRoleObj.roleID,
          "roleName": this.role,
          "roleDesc": this.description,
          // "providerServiceMapID": this.toBeEditedRoleObj.providerServiceMapID,
          "sRSMappingID" : this.sRSMappingID,
          "screenID":this.editedFeatureID,
          "createdBy": this.commonDataService.uname,
          "createdDate":new Date()
        }


        this.ProviderAdminRoleService.editRole(obj).subscribe(response => this.edit_delete_RolesSuccessHandeler(response, 'edit'));
      }

      edit_delete_RolesSuccessHandeler(response, choice) {
        if (choice == 'edit') {
          this.alertService.alert('Role Edited successfully');
        }
        else {
          this.alertService.alert(this.confirmMessage + 'd successfully');
        }
        console.log(response, 'edit/delete response');
        this.showRoleCreationForm = false;
        this.setEditSubmitButton = false;
        this.findRoles(this.STATE_ID, this.SERVICE_ID);
        this.role = '';
        this.description = '';
        this.objs = [];
        this.selectedRole = undefined;
        this.disableSelection = false;
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
        this.alertService.alert('Role created successfully');
        console.log(response, 'in create role success in component.ts');
        this.finalResponse = response;
        if (this.finalResponse[0].roleID) {
            this.objs = []; //empty the buffer array
            this.setRoleFormFlag(false);
            this.findRoles(this.STATE_ID, this.SERVICE_ID);
          }

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
          }

        }


        setFeatureName(screen_name)
        {
          this.screen_name=screen_name;
        }

        add_obj(role, desc, feature) {
          var result = this.validateRole(role);
          console.log(feature,"feature wala array");
          if (result) {
            let count = 0;
            if (this.objs.length < 1) {

              for(let z=0;z<feature.length;z++)
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
                  
                }

              }
              else 
              {
                for (let i = 0; i < this.objs.length; i++) 
                {
                  if (this.objs[i].roleName.toLowerCase().trim() === role.toLowerCase().trim()) 
                  {
                    count = count + 1;
                  }
                }
                if (count < 1) 
                {
                  for(let k=0;k<feature.length;k++)
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

        remove_obj(index) 
        {
          this.objs.splice(index, 1);
        }

        clear() 
        {
          this.services = [];
          this.searchresultarray = [];
          this.showAddButtonFlag = false;
        }

      }
