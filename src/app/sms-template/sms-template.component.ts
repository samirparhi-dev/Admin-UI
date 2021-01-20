import { Component, OnInit, ViewChild } from '@angular/core';
// import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { dataService } from '../services/dataService/data.service';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { SmsTemplateService } from 'app/services/adminServices/SMSMaster/sms-template-service.service';
import { CommonServices } from '../services/inventory-services/commonServices';
@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsTemplateComponent implements OnInit {

  providerServiceMapID: any;
  serviceID: any;
  existing_templates: Array<any> = [];
  userID:any;
  service:any;
  showTableFlag :boolean;
  // new
  viewTemplate = false;
  viewSMSparameterTable:Array<any> = [];

  showParameters = false;
  isReadonly = false;

  SMS_Types:Array<any> = [];
  smsType_ID_array:Array<any> = [];

  Parameters:Array<any> = [];
  Parameters_count;
  services:any=[];
  smsParameters:Array<any> = [];
  selectedParameterType;
  selectedParameterValues:Array<any> = [];

  smsParameterMaps:Array<any> = [];

  @ViewChild('smsForm') Smsform1: NgForm;
  @ViewChild('smsViewForm') smsViewForm: NgForm;
  states: any;
  createForm: boolean;
state:any;

  constructor(public commonData: dataService,
    public sms_service: SmsTemplateService,
    public commonServices: CommonServices,
    public commonDataService: dataService,
    public commonDialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    // this.providerServiceMapID = this.commonData.current_service.serviceID; // check for each module
    // this.serviceID = this.commonData.current_serviceID; // check for each module
    //this.providerServiceMapID = 1247; 
    //this.serviceID = 3; 
    //this.getSMStemplates(this.providerServiceMapID);
    // this.createdBy = this.commonDataService.uname;
    // console.log("this.createdBy", this.createdBy);

    this.userID = this.commonDataService.uid;
    console.log('userID', this.userID);
    this.getAllServices();
  }
  getAllServices() {
    this.commonServices.getServiceLines(this.userID).subscribe((response) => {
      console.log("serviceline", response);
      this.servicesSuccesshandler(response),
        (err) => console.log("ERROR in fetching serviceline")
    });
  }
  servicesSuccesshandler(res) {
    console.log("serviceres",res);
    this.services = res;
    // this.services = res.filter((item) => {
    //   console.log('item', item);
    // })
  }
  getStates(service) {
    this.serviceID=service.serviceID;
    this.commonServices.getStatesOnServices(this.userID, service.serviceID, false).
      subscribe(response => this.getStatesSuccessHandeler(response, service), (err) => {
        console.log("error in fetching states")
      });


  }
  setProviderServiceMapID(providerServiceMapID) {
    console.log("providerServiceMapID", providerServiceMapID);
    this.providerServiceMapID = providerServiceMapID;
    console.log('psmid', this.providerServiceMapID);
    this.getSMStemplates(this.providerServiceMapID);
  }

  getStatesSuccessHandeler(response, service) {
    this.states = response;
  }

  getSMStemplates(providerServiceMapID) {
    this.sms_service.getSMStemplates(providerServiceMapID)
      .subscribe(response => {
        if (response != undefined && response.length >= 0) {
          this.existing_templates = response;

          // code to extract(IDs) all those non deleted SMS-Types
          this.smsType_ID_array = [];
          this.showTableFlag=true;
          this.createForm=false;
          for (let i = 0; i < this.existing_templates.length; i++) {
            if (this.existing_templates[i].deleted === false) {
              this.smsType_ID_array.push(this.existing_templates[i].smsType.smsTypeID);
            }
          }
        }
      }, err => {
        console.log('Error while fetching SMS templates', err);
      })
  }

  showForm() {
    this.showTableFlag = false;
    this.createForm=true;
    this.getSMStypes(this.serviceID);
  }

  getSMStypes(serviceID) {
    this.sms_service.getSMStypes(serviceID)
      .subscribe(response => {
        this.SMS_Types = response;

        if (this.smsType_ID_array.length > 0) {
          this.SMS_Types = this.SMS_Types.filter(object => {
            return !this.smsType_ID_array.includes(object.smsTypeID);
          });
        }


        if (this.SMS_Types.length == 0) {
          this.commonDialogService.alert('All SMS Types have been used and are those templates are active', 'info');
        }

      }, err => {
        console.log(err, 'error while fetching sms types');
        this.commonDialogService.alert(err.errorMessage, 'error');
      })
  }

  showTable() {
    this.showTableFlag = true;
    this.createForm=false;
    this.viewTemplate = false;
    this.cancel();
    this.getSMStemplates(this.providerServiceMapID);

  }

  ActivateDeactivate(object, flag) {

    object.deleted = flag;
    object.modifiedBy = this.commonData.Userdata.userName;
    this.sms_service.updateSMStemplate(object)
      .subscribe(response => {
        if (response) {
          if (flag) {
            this.commonDialogService.alert('Deactivated successfully', 'success');
            this.getSMStemplates(this.providerServiceMapID);

          } else {
            this.commonDialogService.alert('Activated successfully', 'success');
            this.getSMStemplates(this.providerServiceMapID);

          }
        }
      }, err => {

      });

  }

  extractParameters(string) {
    this.Parameters = [];
    let parameters = [];

    let string_contents = [];

    var regex = /[!?.,\n]/g;
    string_contents = string.replace(regex, ' ').split(' ');

    for (let i = 0; i < string_contents.length; i++) {
      if (string_contents[i].startsWith('$$') && string_contents[i].endsWith('$$')) {
        let item = string_contents[i].substr(2).slice(0, -2);
        console.log(item);
        parameters.push(item);
      }
    }

    this.Parameters = parameters.filter(function (elem, index, self) {
      return index == self.indexOf(elem);
    });

    this.Parameters.push('SMS_PHONE_NO');
    this.Parameters_count = this.Parameters.length;

    if (this.Parameters.length > 0) {
      this.showParameters = true;
      this.isReadonly = true;
      // this.getSMSparameters();
    } else {
      this.commonDialogService.alert('No parameters identified in sms template', 'info');
    }
  }


  getSMSparameters() {
    this.smsParameters = [];
    this.selectedParameterValues = [];
    this.sms_service.getSMSparameters(this.serviceID)
      .subscribe(response => {
        this.smsParameters = response;
      }, err => {
        console.log(err, 'error while fetching sms parameters');
        this.commonDialogService.alert(err.errorMessage, 'error');
      })
  }

  setValuesInDropdown(parameter_object) {
    this.selectedParameterType = parameter_object.smsParameterType;
    this.selectedParameterValues = parameter_object.smsParameters;
  }

  cancel() {
    this.Parameters_count = undefined;
    this.isReadonly = false;
    this.showParameters = false;
    this.smsParameterMaps = [];
  }

  add(form_values) {
    let reqObj = {
      'createdBy': this.commonData.Userdata.userName,
      'modifiedBy': this.commonData.Userdata.userName,
      'smsParameterName': form_values.parameter,
      'smsParameterType': form_values.value.smsParameterType,
      'smsParameterID': form_values.value.smsParameterID,
      'smsParameterValue': form_values.value.smsParameterName
    }
    if (reqObj.smsParameterName != undefined &&
      reqObj.smsParameterType != undefined &&
      reqObj.smsParameterID != undefined) {
      this.smsParameterMaps.push(reqObj);
    } else {
      this.commonDialogService.alert('Parameter, Value Type and Value should be selected', 'info');
    }

    // removing of the parameters pushed into buffer from the Parameters array and resetting of next two dropdowns
    this.Parameters.splice(this.Parameters.indexOf(form_values.parameter), 1);
    this.smsParameters = [];
    this.selectedParameterValues = [];
  }

  remove(obj, S_no) {
    let index = S_no - 1;
    this.smsParameterMaps.splice(index, 1);

    // putting back the respective Parameter if is row is deleted from buffer array
    this.Parameters.push(obj.smsParameterName);
    // this.smsParameters = [];
    // this.selectedParameterValues = [];

    //getting sms parameters

    this.getSMSparameters();
  }

  saveSMStemplate(form_values) {
    let requestObject = {
      'createdBy': this.commonData.Userdata.userName,
      'providerServiceMapID': this.providerServiceMapID,
      'smsParameterMaps': this.smsParameterMaps,
      'smsTemplate': form_values.smsTemplate,
      'smsTemplateName': form_values.templateName,
      'smsTypeID': form_values.smsType
    }

    console.log('Save Request', requestObject);

    this.sms_service.saveSMStemplate(requestObject)
      .subscribe(res => {
        this.commonDialogService.alert('Template saved successfully', 'success');
        this.showTable();
      }, err => {
        this.commonDialogService.alert(err.errorMessage, 'error');
      });
  }


  view(object) {
    console.log('templateID', object);

    this.sms_service.getFullSMSTemplate(object.providerServiceMapID, object.smsTemplateID)
      .subscribe(response => {
        console.log(response, 'getfullSMStemplate success');
        this.viewSMSparameterTable = response.smsParameterMaps;
        this.viewTemplate = true;
        this.showTableFlag = false;
        this.smsViewForm.form.patchValue({
          'templateName': response.smsTemplateName,
          'smsType': response.smsType.smsType,
          'smsTemplate': response.smsTemplate
        });

      }, err => {
        console.log(err, 'getfullSMStemplate error');
      })

  }
}
