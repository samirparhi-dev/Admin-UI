import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';
@Component({
  selector: 'app-provider-serviceline-state-mapping',
  templateUrl: './provider-serviceline-state-mapping.component.html',
  styleUrls: ['./provider-serviceline-state-mapping.component.css']
})
/* Created By: Diamond Khanna , 15 Jan,2018
   Intention: Creates provider-service-state mappings
 */

export class ProviderServicelineStateMappingComponent implements OnInit {
  // ngModels
  provider: any;
  serviceline: any;
  state: any;

  // arrays
  providers: any = [];
  servicelines: any = [];
  states: any = [];

  searchResult: any = [];
  bufferArray: any = [];

  // flags
  formMode = false;
  tableMode = true;

  // variables
  createdBy: any;
  countryID: any = 1;

  @ViewChild('mappingFieldsForm') mappingFieldsForm: NgForm;




  constructor(public superadminService: SuperAdmin_ServiceProvider_Service,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.getAllMappings();
    this.getAllProviders();
    this.getAllStates();
    this.getAllServicelines();
  }

  showForm() {
    this.tableMode = false;
    this.formMode = true;
  }

  showTable() {
    this.tableMode = true;
    this.formMode = false;
  }

  getAllProviders() {
    this.superadminService.getAllProvider()
      .subscribe(response => {
        if (response) {
          console.log('All Providers Success Handeler', response);
          this.providers = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }

  getAllMappings() {
    this.superadminService.getAllProviderMappings()
      .subscribe(response => {
        if (response) {
          console.log('All Providers Mapping Success Handeler', response);
          this.searchResult = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }

  getAllStates() {
    this.superadminService.getAllStates(this.countryID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all states success handeler');
          this.states = response;
        }
      }, err => {

      });
  }

  getAllServicelines() {
    this.superadminService.getAllServiceLines()
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all servicelines success handeler');
          this.servicelines = response;
        }
      }, err => {

      });
  }

  add2bufferArray(form_values) {
    console.log(form_values, 'form values after adding');
    const object = {
      'providerID': form_values.provider.serviceProviderId,
      'providerName': form_values.provider.serviceProviderName,
      'serviceID': form_values.serviceline.serviceID,
      'serviceName': form_values.serviceline.serviceName,
      'states': []
    };

    let stateArray = [];
    if (form_values.state.length > 0) {
      for (let a = 0; a < form_values.state.length; a++) {
        let obj = {
          'stateID': form_values.state[a].stateID,
          'stateName': form_values.state[a].stateName
        }

        stateArray.push(obj);
      }

      object['states'] = stateArray;
    }

    this.checkDuplicates(object);
  }

  checkDuplicates(object) {
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }

    /* case:2 If the buffer array is not empty */
    else if (this.bufferArray.length > 0) {
      let servicelineMatched = false;
      for (let a = 0; a < this.bufferArray.length; a++) {
        /* if the serviceID of object in BufferArray is same as that of new object */

        if (this.bufferArray[a].serviceID === object.serviceID) {

          servicelineMatched = true;
          /* the loop will run i times , where i= no of objects in States Array
             of OBJECT sent for verification */
          for (let i = 0; i < object.states.length; i++) {
            let count = 0;
            /* running second loop which will run j times , where j= no of objects in States Array
             of an OBJECT in buffer array */
            for (let j = 0; j < this.bufferArray[a].states.length; j++) {
              if (this.bufferArray[a].states[j].stateID === object.states[i].stateID) {
                count = count + 1;
                console.log('Duplicate Combo Exists', count);
              }
            }
            if (count === 0) {
              this.bufferArray[a].states.push(object.states[i]);
              this.resetForm();
            }
            else if (count > 0) {
              console.log('Duplicate Entry Already exists for ' + object.states[i].stateName);
              this.resetForm();
            }
          }
        }
        else {
          continue;
        }
      }
      if (servicelineMatched === false) {
        this.bufferArray.push(object);
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.mappingFieldsForm.reset();
    this.provider = undefined;
    this.serviceline = undefined;
    this.state = undefined;
  }

  removeState(rowIndex, stateIndex) {
    this.bufferArray[rowIndex].states.splice(stateIndex, 1);

    if (this.bufferArray[rowIndex].states.length === 0) {
      this.bufferArray.splice(rowIndex, 1);
    }
  }

  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }

}
