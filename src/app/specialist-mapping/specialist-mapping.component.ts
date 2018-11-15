import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProcedureMasterServiceService } from '../services/ProviderAdminServices/procedure-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';
import { SpecialistMappingService } from './../services/ProviderAdminServices/specialist-mapping.service';
@Component({
  selector: 'app-specialist-mapping',
  templateUrl: './specialist-mapping.component.html',
  styleUrls: ['./specialist-mapping.component.css']
})
export class SpecialistMappingComponent implements OnInit {

  alreadyExistcount: Boolean;
  serviceProviderID: any;
  uname: any;
  screenName = 'TC Specialist';

  tableMode: Boolean = false;
  creationMode: Boolean = false;

  mappingForm: FormGroup;

  specializationList: any;
  filteredspecializationList: any;

  alreadyExist: Boolean = false;
  bufferArray: any = [];
  services_array: any = [];

  specializations: any;
  users: any;

  constructor(private commonDataService: dataService,
    public alertService: ConfirmationDialogsService,
    private fb: FormBuilder,
    public providerAdminRoleService: ProviderAdminRoleService,
    private procedureMasterServiceService: ProcedureMasterServiceService,
    public stateandservices: ServicePointMasterService,
    private specialistMappingService: SpecialistMappingService) {

  }

  ngOnInit() {

    this.initiateTable();
    this.getSpecializationsList();
    this.getUsersList();
    console.log(this.specializations, this.users, 'called');
    console.log(this.mappingForm)
  }
  /**
   * Initiate Form
  */
  initiateTable() {

    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
    this.serviceProviderID = (this.commonDataService.service_providerID).toString();
    this.uname = this.commonDataService.uname;

    // this.mappingForm = this.initmappingForm();
    // // By Default, it'll be set as enabled
    // this.mappingForm.patchValue({
    //   disable: false
    // })
    this.specializationList = [];
    this.filteredspecializationList = [];
    this.getAvailableMapping();



  }


  getSpecializationsList() {
     this.specialistMappingService.getSpecializationList()
    .subscribe(res => this.specializations = res);

  }

  getUsersList() {
     this.specialistMappingService.getDoctorList(this.serviceProviderID, this.screenName)
    .subscribe(res => this.users = res);

  }




  // initmappingForm(): FormGroup {
  //   return this.fb.group({
  //     id: null,
  //     name: [null, Validators.required],
  //     type: null,
  //     description: null,
  //     gender: null,
  //     male: null,
  //     female: null,
  //     disable: null
  //   })
  // }

  /**
   * Get Details of Mapping available for this Service PRovider
  */

  getAvailableMapping() {
    this.specialistMappingService.getCurrentMappings(this.serviceProviderID)
      .subscribe((res) => {
        console.log(res, 'current mappings');
        this.specializationList = this.successhandeler(res);
        this.filteredspecializationList = this.successhandeler(res);
        this.tableMode = true;
      });

  }


  toggleMapping(id, obj, val) {
    console.log(id, obj, val, 'brr')
    this.specialistMappingService.toggleMapping(id, val, this.uname)
      .subscribe((res) => {
        if (res) {
          this.filteredspecializationList[obj].deleted = val;
          this.setChangeMainList(id, val);
          // this.spe
        }
      })
  }
  setChangeMainList(id, val){
    this.specializationList.map(element => {
      if (element.userSpecializationMapID === id) {
        element.deleted = val
      }
    });
    console.log(this.specializationList)
  }


  back() {
    this.alertService.confirm('Confirm', 'Do you really want to cancel? Any unsaved data would be lost').subscribe(res => {
      if (res) {
        this.showTable();
        // this.alreadyExist = false;
        this.resetProcedure();
      }
    })
  }
  showTable() {
    this.tableMode = true;
    this.creationMode = false;
  }
  showForm() {
    this.tableMode = false;
    this.creationMode = true;
  }

  // procedureUnique() {
  //   this.alreadyExist = false;
  //   console.log("filteredprocedureList", this.filteredprocedureList);
  //   let count = 0;
  //   for (let a = 0; a < this.filteredprocedureList.length; a++) {

  //     if (this.filteredprocedureList[a].procedureName === this.name && !this.filteredprocedureList[a].deleted) {
  //       count = count + 1;
  //       console.log("count", count);

  //       if (count > 0) {
  //         this.alreadyExist = true;
  //       }
  //     }
  //   }
  // }

  // procedureUnique_actvate(name) {
  //   console.log("name", name);
  //   this.alreadyExistcount = false;
  //   console.log("filteredprocedureList", this.filteredprocedureList);
  //   let count = 0;
  //   for (let a = 0; a < this.filteredprocedureList.length; a++) {

  //     if (this.filteredprocedureList[a].procedureName === name && !this.filteredprocedureList[a].deleted) {
  //       count = count + 1;
  //       console.log("count", count);

  //       if (count >= 1) {
  //         this.alreadyExistcount = true;
  //       }
  //     }
  //   }
  // }

  get name() {
    return this.mappingForm.controls['name'].value;
  }

  // saveProcedure() {
  //   let apiObject = this.objectManipulate();
  //   let obj = Object.assign({}, this.mappingForm.value);
  //   let count = 0;
  //   console.log('here to check available', apiObject);
  //   for (let a = 0; a < this.filteredprocedureList.length; a++) {
  //     if (this.filteredprocedureList[a].procedureName === apiObject["procedureName"] && !this.filteredprocedureList[a].deleted) {
  //       count = count + 1;
  //       console.log('here to check available', count);
  //     }
  //   }
  //   if (count == 0) {
  //     console.log('here to check available', apiObject);

  //     if (apiObject) {
  //       delete apiObject['modifiedBy'];
  //       delete apiObject['procedureID'];
  //       console.log('here to check available', apiObject);

  //       this.procedureMasterServiceService.postProcedureData(apiObject)
  //         .subscribe((res) => {
  //           this.procedureList.unshift(res);
  //           this.mappingForm.reset();
  //           this.alertService.alert('Saved successfully', 'success')
  //           this.showTable();
  //         })

  //     }
  //   }
  //   else {
  //     this.alertService.alert('Already exists')
  //   }
  // }

  /**
   * Update Changes for The Procedure
  // */
  // updateProcedure() {
  //   const apiObject = this.objectManipulate();
  //   if (apiObject) {
  //     delete apiObject['createdBy'];
  //     apiObject['procedureID'] = this.editMode;

  //     this.procedureMasterServiceService.updateProcedureData(apiObject)
  //       .subscribe((res) => {
  //         // this.updateList(res);
  //         this.mappingForm.reset();
  //         this.editMode = false;
  //         this.alertService.alert('Updated successfully', 'success')
  //         this.showTable();
  //       })

  //   }
  // }

  resetProcedure() {
    this.mappingForm.reset();
  }


  /**
   * Manipulate Form Object to as per API Need
  */
  // objectManipulate() {
  //   const obj = Object.assign({}, this.mappingForm.value);

  //   console.log('this.mappingForm.value', this.mappingForm.value, obj);

  //   if (!obj.name || !obj.type || !obj.description || (!obj.gender)) {
  //     this.unfilled = true;
  //     return false
  //   } else {
  //     this.unfilled = false;

  //     let apiObject = {};
  //     apiObject = {
  //       procedureID: '',
  //       modifiedBy: this.commonDataService.uname,
  //       procedureName: obj.name,
  //       procedureType: obj.type,
  //       procedureDesc: obj.description,
  //       createdBy: this.commonDataService.uname,
  //       providerServiceMapID: this.searchStateID.providerServiceMapID,
  //       gender: obj.gender
  //     };
  //     console.log(JSON.stringify(apiObject, null, 3), 'apiObject');
  //     return apiObject;
  //   }

  // }



  // setProviderServiceMapID() {
  //   this.commonDataService.provider_serviceMapID = this.searchStateID.ProviderServiceMapID;
  //   this.providerServiceMapID = this.searchStateID.ProviderServiceMapID;

  //   console.log('psmid', this.searchStateID.ProviderServiceMapID);
  //   console.log(this.service);
  //   this.getAvailableMapping();
  //   this.getAvailableProcedures();
  // }




  // For State List
  successhandeler(response) {
    return response;
  }


  /**
   *Enable/ Disable Mapping
   *
   */
  // toggleProcedure(procedureID, index, toggle, procedureName) {
  //   let activateProcdure = false;
  //   this.procedureUnique_actvate(procedureName);
  //   if (this.alreadyExistcount) {
  //     this.alertService.confirm('Confirm', "Duplicate procedure already exists do you want to enable it?").subscribe(response => {
  //       if (response) {
  //         this.activate(procedureID, index, toggle);
  //       }
  //     })
  //   }
  //   else {
  //     this.activate(procedureID, index, toggle);
  //   }

  // }
  activate(procedureID, index, toggle) {
    let text;
    if (!toggle)
      text = "Are you sure you want to Activate?";
    else
      text = "Are you sure you want to Deactivate?";

    this.alertService.confirm('Confirm', text).subscribe(response => {
      if (response) {
        console.log(procedureID, index, 'index');
        this.procedureMasterServiceService.toggleProcedure({ procedureID: procedureID, deleted: toggle })
          .subscribe((res) => {
            console.log(res, 'changed');
            if (res) {
              if (!toggle)
                this.alertService.alert("Activated successfully", 'success');
              else
                this.alertService.alert("Deactivated successfully", 'success');
              // this.updateList(res);
              // this.procedureList[index] = res;
            }
          })
      }

    })
  }
  deactivatetoggleProcedure(procedureID, index, toggle) {
    let text;
    if (!toggle)
      text = "Are you sure you want to Activate?";
    else
      text = "Are you sure you want to Deactivate?";
    this.alertService.confirm('Confirm', text).subscribe(response => {
      if (response) {
        console.log(procedureID, index, 'index');
        this.procedureMasterServiceService.toggleProcedure({ procedureID: procedureID, deleted: toggle })
          .subscribe((res) => {
            console.log(res, 'changed');
            if (res) {
              if (!toggle)
                this.alertService.alert("Activated successfully", 'success');
              else
                this.alertService.alert("Deactivated successfully", 'success');
              // this.updateList(res);
              // this.procedureList[index] = res;
            }
          })
      }
    })
  }

  // updateList(res) {
  //   this.procedureList.forEach((element, i) => {
  //     console.log(element, 'elem', res, 'res')
  //     if (element.procedureID == res.procedureID) {
  //       this.procedureList[i] = res;
  //     }

  //   });

  //   this.filteredprocedureList.forEach((element, i) => {
  //     console.log(element, 'elem', res, 'res')
  //     if (element.procedureID == res.procedureID) {
  //       this.filteredprocedureList[i] = res;
  //     }

  //   });

  // }

  filterSpecializationList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredspecializationList = this.specializationList;
    } else {
      this.filteredspecializationList = [];
      this.specializationList.forEach((item) => {
        for (let key in item) {
          if (key == 'userName' || key == 'specializationName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredspecializationList.push(item); break;
            }
          }
        }
      });
    }

  }

  // configProcedure(item, index) {
  //   this.editMode = true;
  //   let male: any;
  //   let female: any;
  //   let unisex: any;
  //   if (item.gender == 'unisex') {
  //     unisex = "unisex";
  //   } else if (item.gender == 'male') {
  //     male = "male";
  //   } else if (item.gender == 'female') {
  //     female = "female";
  //   }
  //   this.editMode = index >= 0 ? item.procedureID : false; // setting edit mode on
  //   console.log(JSON.stringify(item, null, 4));
  //   this.mappingForm.patchValue({
  //     id: item.procedureID,
  //     name: item.procedureName,
  //     type: item.procedureType,
  //     description: item.procedureDesc,
  //     gender: item.gender,
  //     disable: item.deleted
  //   })



  // }



}
