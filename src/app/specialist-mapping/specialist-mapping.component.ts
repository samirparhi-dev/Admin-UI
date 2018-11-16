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

  specializationList: any;
  filteredspecializationList: any;

  alreadyExist: Boolean = false;
  bufferArray: any = [];
  services_array: any = [];

  specializations: any;
  users: any;


  userSelected: any;
  specializationSelected: any;

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
  }
  /**
   * Initiate Form
  */
  initiateTable() {

    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
    this.serviceProviderID = (this.commonDataService.service_providerID).toString();
    this.uname = this.commonDataService.uname;

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
    let msg = null;
    if (!val) {
      msg = 'Are you sure you want to Activate?';
    } else {
      msg = 'Are you sure you want to Deactivate?';
    }
    this.alertService.confirm('Confirm', msg).subscribe(response => {
      if (response) {

        this.specialistMappingService.toggleMapping(id, val, this.uname)
          .subscribe((res) => {
            if (res) {
              this.filteredspecializationList[obj].deleted = val;
              this.setChangeMainList(id, val);
              if (!val) {
                this.alertService.alert('Activated successfully', 'success');
              } else {
                this.alertService.alert('Deactivated successfully', 'success');

              }
            }
          })
      }
    });
  }
  setChangeMainList(id, val) {
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
      }
    })
  }
  showTable() {
    this.clearForm();
    this.tableMode = true;
    this.creationMode = false;
  }

  clearForm() {
    this.userSelected = null;
    this.specializationSelected = null;
  }
  showForm() {
    this.clearForm();
    this.tableMode = false;
    this.creationMode = true;
  }

  proceed() {
    const exists = this.checkExists();

    if (exists) {
      this.alertService.alert('Already exists');
    } else {
      const apiObj = [{
        specializationID: this.specializationSelected,
        userID: this.userSelected,
        createdBy: this.uname,
        deleted: false
      }];
      this.specialistMappingService.saveMappings(apiObj)
        .subscribe((res) => {
          this.alertService.alert('Mapping saved successfully', 'success');
          this.getAvailableMapping();
          this.showTable();
        })

    }
  }

  checkExists() {
    let exists = false;
    console.log(this.specializationList, 'listed')
    this.specializationList.map(element => {
      if (element.userID == this.userSelected && element.specializationID == this.specializationSelected) {
        exists = true;
      }
    })
    return exists;
  }

  successhandeler(response) {
    return response;
  }




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


}
