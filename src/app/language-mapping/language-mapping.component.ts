import { Component, OnInit, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { EmployeeMasterService } from '../services/ProviderAdminServices/employee-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { LanguageMapping } from '../services/ProviderAdminServices/language-mapping.service';

@Component({
  selector: 'app-language-mapping',
  templateUrl: './language-mapping.component.html',
  styleUrls: ['./language-mapping.component.css']
})
export class LanguageMappingComponent implements OnInit {
  language: any;
  weightage: any = 1;
  serviceProviderID: any;
  userLangID: any;
  edit_Details: any;
  // preferredlanguage: any;
  allLanguagesList: any = [];
  dummy_allLanguages: any = [];// just for visual tricks
  selected_languages: any = [];
  language_weightage: any = [];
  Weightage: any = [];
  readWeightage: any = [];
  writeWeightage: any = [];
  speakWeightage: any = [];
  multiLanguages: any = [];
  LanguageMappedList: any = [];
  bufferArray: any = [];
  userNamesList: any = [];
  lang: any;
  showCheckboxes: boolean = false;
  showCheckboxes1: boolean = false;
  formMode = false;
  tableMode = true;
  editMode = false;
  status: boolean;


  @ViewChild('editlanguagesForm') eForm: NgForm;
  @ViewChild('languagesForm') Form: NgForm;
  constructor(public commonDataService: dataService, private alertService: ConfirmationDialogsService,
    private saved_data: dataService, private languageMapping: LanguageMapping) {
  }

  ngOnInit() {
    this.serviceProviderID = this.saved_data.service_providerID;
    this.language
    this.Weightage = [
      { value: 1, Name: '25%' },
      { value: 2, Name: '50%' },
      { value: 3, Name: '75%' },
      { value: 4, Name: '100%' }
    ];
    // this.EmployeeMasterService.getCommonRegistrationData()
    //   .subscribe(response => this.commonRegistrationDataSuccessHandeler(response));
    this.getUserName(this.serviceProviderID);
    this.getAllLanguagesList();
    this.getAllMappedLanguagesList();
  }
  // commonRegistrationDataSuccessHandeler(response) {
  //   debugger;
  //   console.log(response, 'emp master component common reg data');

  //   this.allLanguages = response.m_language;
  //   this.dummy_allLanguages = response.m_language;

  // }
  getUserName(providerId: any) {
    debugger;
    this.languageMapping.getUserName(providerId)

      .subscribe(response => {
        if (response) {
          console.log('All User names under this provider Success Handeler', response);
          this.userNamesList = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }
  getAllLanguagesList() {
    debugger;
    this.languageMapping.getLanguageList()
      .subscribe(response => {
        if (response) {
          console.log('All languages Success Handeler', response);
          this.allLanguagesList = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }
  getAllMappedLanguagesList() {
    this.languageMapping.getMappedLanguagesList()
      .subscribe(response => {
        if (response) {
          console.log('All Providers Success Handeler', response);
          this.LanguageMappedList = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }
  activate(userLangID) {
    const object = {
      'userLangID': userLangID,
      'deleted': false
    };

    this.languageMapping.DeleteLanguageMapping(object)
      .subscribe(response => {
        if (response) {
          this.alertService.alert('Language mapped admin activated successfully');
          /* refresh table */
          this.getAllMappedLanguagesList();
        }
      },
      err => {
        console.log('error', err);
      });
  }
  deactivate(userLangID) {
    const object = { 'userLangID': userLangID, 'deleted': true };

    this.languageMapping.DeleteLanguageMapping(object)
      .subscribe(response => {
        if (response) {
          this.alertService.alert('Language mapped deactivated successfully');
          /* refresh table */
          this.getAllMappedLanguagesList();
        }
      },
      err => {
        console.log('error', err);
      });
  }
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;

    }

  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    // this.showCheckboxes = true;
  }
  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  Language(languageArray: any) {
    this.showCheckboxes = true;
    this.showCheckboxes1 = true;
  }
  read: boolean = false;
  setRead(value) {
    if (value.checked) {
      this.read = true;
    }
    else {
      this.read = false;
    }
  }

  write: boolean = false;
  setWrite(value) {
    if (value.checked) {
      this.write = true;
    }
    else {
      this.write = false;
    }
  }

  speak: boolean = false;
  setSpeak(value) {
    if (value.checked) {
      this.speak = true;
    }
    else {
      this.speak = false;
    }
  }

  addLanguage(language: any, readWeightage: any, writeWeightage: any, speakWeightage: any) {
    let langObj = {};
    langObj['languageName'] = language.languageName;
    langObj['languageID'] = language.languageID;
    langObj['userName'] = language.userName;
    langObj['userID'] = language.userName;
    langObj['read'] = this.read;
    langObj['readWeightage'] = readWeightage;
    langObj['write'] = this.write;
    langObj['writeWeightage'] = writeWeightage;
    langObj['speak'] = this.speak;
    langObj['speakWeightage'] = speakWeightage;
    if (this.multiLanguages.length === 0) {
      this.multiLanguages.push(langObj);

      /*resetting*/
      this.read = false;
      this.write = false;
      this.speak = false;
      this.lang = [];

      // jQuery("#languagesForm").trigger('reset');
      this.readWeightage = [];
      this.writeWeightage = [];
      this.speakWeightage = [];
      this.showCheckboxes = false;
    } else {
      // this.multiLanguages.push(langObj);
      // this.multiLanguages = this.filterArray(this.multiLanguages);
      this.checkDuplicates(langObj);

      /*resetting*/
      this.read = false;
      this.write = false;
      this.speak = false;
      this.lang = [];

      // jQuery("#languagesForm").trigger('reset');
      this.readWeightage = [];
      this.writeWeightage = [];
      this.speakWeightage = [];

      this.showCheckboxes = false;
    }
  }

  deleteRow(i) {
    this.multiLanguages.splice(i, 1);
  }

  checkDuplicates(object) {
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
      this.resetForm();
    }

    /* case:2 If the buffer array is not empty */
    else if (this.bufferArray.length > 0) {
      let LanguageMatched = false;
      let Count = 0;
      for (let a = 0; a < this.bufferArray.length; a++) {
        if (this.bufferArray[a].userLangID === object.languageID) {
          Count = Count + 1;
          if (this.bufferArray[a].usedID === object.usedID) {
            LanguageMatched = true;
            if (this.bufferArray[a].languageID === object.languageID) {
              this.bufferArray.push(object);
              this.resetForm();
            }
          }
        }
        else {
          continue;
        }
      }

    }
  }

  save() {
    this.languageMapping.SaveLanguageMapping(this.bufferArray)
      .subscribe(response => {
        console.log(response, 'after successful mapping of language to provider');
        this.alertService.alert('language mapped successfully');
        this.showTable();
        this.getAllMappedLanguagesList();
        this.resetDropdowns();
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
      });
  }
  editRow(rowObject) {
    this.showEditForm();
    this.userLangID = rowObject.uSRMappingID;
    this.edit_Details = rowObject;
  }
  updateLanguage(language: any, readWeightage: any, writeWeightage: any, speakWeightage: any) {
    let langObj = {};
    langObj['languageName'] = language.languageName;
    langObj['languageID'] = language.languageID;
    langObj['userName'] = language.userName;
    langObj['userID'] = language.userName;
    langObj['read'] = this.read;
    langObj['readWeightage'] = readWeightage;
    langObj['write'] = this.write;
    langObj['writeWeightage'] = writeWeightage;
    langObj['speak'] = this.speak;
    langObj['speakWeightage'] = speakWeightage;
    if (this.multiLanguages.length === 0) {
      this.multiLanguages.push(langObj);

      this.languageMapping.UpdateLanguageMapping(this.multiLanguages)
        .subscribe(response => {
          console.log(response, 'after successful mapping of language to provider');
          this.alertService.alert('language mapping edited successfully');
          this.showTable();
          this.getAllMappedLanguagesList();
          this.resetDropdowns();
          this.bufferArray = [];
        }, err => {
          console.log(err, 'ERROR');
        });

    }
  }
  resetForm() {
    this.Form.reset();
    this.eForm.reset();
  }
  resetDropdowns() {
  }
}

