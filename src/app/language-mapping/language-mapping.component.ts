import { Component, OnInit, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { EmployeeMasterService } from '../services/ProviderAdminServices/employee-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { LanguageMapping } from '../services/ProviderAdminServices/language-mapping.service';
import { MdCheckbox } from '@angular/material';
@Component({
  selector: 'app-language-mapping',
  templateUrl: './language-mapping.component.html',
  styleUrls: ['./language-mapping.component.css']
})
export class LanguageMappingComponent implements OnInit {
  language: any;
  serviceProviderID: any;
  userLangID: any;
  edit_Details: any;
  // preferredlanguage: any;
  allLanguagesList: any = [];
  dummy_allLanguages: any = [];// just for visual tricks
  selected_languages: any = [];
  language_weightage: any = [];
  multiLanguages: any = [];
  LanguageMappedList: any = [];
  bufferArray: any = [];
  userNamesList: any = [];
  canRead: any = [];
  canSpeak: any = [];
  canWrite: any = [];
  languageID: any = [];
  weightage: any = [];
  weightage_Read: any = [];
  weightage_Speak: any = [];
  weightage_Write: any = [];
  WeightageList: any = [];
  filteredLanguages: any = [];
  lang: any;
  createdBy: any;
  showCheckboxes: boolean = false;
  showCheckboxes1: boolean = false;
  formMode = false;
  tableMode = true;
  editMode = false;
  status: boolean;
  isCheckedRead = false;
  isCheckedWrite = false;
  isCheckedSpeak = false;



  @ViewChild('editlanguagesForm') eForm: NgForm;
  @ViewChild('languagesForm') Form: NgForm;
  constructor(private alertService: ConfirmationDialogsService, private saved_data: dataService,
    private languageMapping: LanguageMapping) {
  }

  ngOnInit() {
    this.serviceProviderID = this.saved_data.service_providerID;
    this.createdBy = this.createdBy = this.saved_data.uname;
    this.language
    this.WeightageList = [
      { value: 10, Name: '25%' },
      { value: 20, Name: '50%' },
      { value: 30, Name: '75%' },
      { value: 40, Name: '100%' }
    ];
    this.getUserName(this.serviceProviderID);
    this.getAllLanguagesList();
    this.getAllMappedLanguagesList();
  }

  getUserName(providerId: any) {
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
          console.log('All Languages Success Handeler', response);
          this.LanguageMappedList = response;
        }
      }, err => {
        console.log('Error', err);
      });
  }
  getAvailableLanguages(username: any) {
    // debugger;
    const alreadyMappedLanguages = [];
    for (let i = 0; i < this.LanguageMappedList.length; i++) {
      if (this.LanguageMappedList[i].userID === username.userID) {
        const obj = {
          'languageID': this.LanguageMappedList[i].languageID,
          'languageName': this.LanguageMappedList[i].languageName
        }
        alreadyMappedLanguages.push(obj);
      }
    }
    console.log('alredy', alreadyMappedLanguages);
    const filteredLanguages = this.allLanguagesList.filter(function (allLang) {
      return !alreadyMappedLanguages.find(function (langFromMappedLang) {
        return allLang.languageID === langFromMappedLang.languageID
      })
    });
    this.filteredLanguages = [];
    if (filteredLanguages.length === 0) {
      this.alertService.alert('All Languages for this user have been mapped');
    } else {
      this.filteredLanguages = filteredLanguages;

    }

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
    // debugger
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
      this.resetDropdowns();
    }
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;

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

  addLanguage(languages: any, readWeightage: any, writeWeightage: any, speakWeightage: any) {
    // debugger;
    const langObj = {
      'languageName': languages.language.languageName,
      'userName': languages.username.userName,
      'userID': languages.username.userID,
      'createdBy': this.createdBy,
      'weightage_Read': [] = languages.readweightage.value,
      'weightage_Write': [] = languages.writeweightage.value,
      'weightage_Speak': [] = languages.speakweightage.value,
      'languageID': [] = languages.language.languageID,
      'canRead': this.read,
      'canWrite': this.write,
      'canSpeak': this.speak
    };
    this.read = false;
    this.write = false;
    this.speak = false;
    this.showCheckboxes = false;
    this.checkDuplicates(langObj);


  }

  deleteRow(i) {
    this.bufferArray.splice(i, 1);
  }

  checkDuplicates(object) {
    // debugger;
    // let LanguageMatched = false;
    // let Count = 0;
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
      // this.resetForm();
      this.resetDropdowns1();
    }


    /* case:2 If the buffer array is not empty */
    else if (this.bufferArray.length > 0) {
      let LanguageMatched = false;
      let Count = 0;
      for (let a = 0; a < this.bufferArray.length; a++) {
        if (this.bufferArray[a].userName === object.userName) {
          if (this.bufferArray[a].languageID === object.languageID) {
            LanguageMatched = true;
          }
          else {
            continue;
          }
        }
      }
      if (!LanguageMatched && Count === 0) {
        this.bufferArray.push(object);
        this.resetForm();
        this.resetDropdowns();
      }

    }
  }
  saveMapping() {
    // debugger;
    console.log('final buffer', this.bufferArray);
    let lang: any;
    let langObj = {};
    langObj['languageName'];
    langObj['userName'];
    langObj['userID'];
    langObj['createdBy'];
    langObj['weightage_Read'] = [];
    langObj['weightage_Write'] = [];
    langObj['weightage_Speak'] = [];
    langObj['canRead'] = [];
    langObj['canWrite'] = [];
    langObj['canSpeak'] = [];
    langObj['languageID'] = [];
    let duplicateArray = [];

    for (let i = 0; i < this.bufferArray.length; i++) {
      const index: number = duplicateArray.indexOf(this.bufferArray[i].userID);
      if (index == -1) {
        langObj['languageName'] = this.bufferArray[i].languageName;
        langObj['userName'] = this.bufferArray[i].userName;
        langObj['userID'] = this.bufferArray[i].userID;
        langObj['createdBy'] = this.createdBy;
        lang = this.bufferArray[i].userID;
        duplicateArray.push(lang);
        for (let j = 0; j < this.bufferArray.length; j++) {
          if (this.bufferArray[i].userID === this.bufferArray[j].userID) {
            this.canRead.push(this.bufferArray[j].canRead);
            this.canWrite.push(this.bufferArray[j].canWrite);
            this.canSpeak.push(this.bufferArray[j].canSpeak);
            this.weightage_Read.push(this.bufferArray[j].weightage_Read);
            this.weightage_Write.push(this.bufferArray[j].weightage_Write);
            this.weightage_Speak.push(this.bufferArray[j].weightage_Speak);
            this.weightage.push(this.bufferArray[j].weightage_Speak);
            this.languageID.push(this.bufferArray[j].languageID);
          }

        }
        langObj['canRead'] = this.canRead;
        langObj['canWrite'] = this.canWrite;
        langObj['canSpeak'] = this.canSpeak;
        langObj['weightage_Read'] = this.weightage_Read;
        langObj['weightage_Write'] = this.weightage_Write;
        langObj['weightage_Speak'] = this.weightage_Speak;
        langObj['weightage'] = this.weightage_Speak;
        langObj['languageID'] = this.languageID;

      }
      // debugger;
      if (langObj['userID'] !== undefined) {
        this.multiLanguages.push(langObj);
      }

      langObj = {};
      this.canRead = [];
      this.canWrite = [];
      this.canSpeak = [];
      this.weightage_Read = [];
      this.weightage_Write = [];
      this.weightage_Speak = [];
      this.languageID = [];

    }
    console.log('final array', this.multiLanguages);

    this.languageMapping.SaveLanguageMapping(this.multiLanguages)
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
    // debugger;
    this.showEditForm();
    this.userLangID = rowObject.userLangID;
    this.edit_Details = rowObject;
    this.showCheckboxes = true;
    this.getAvailableLanguages(this.edit_Details.userID)
    this.isCheckedRead = rowObject.canRead;
    this.isCheckedWrite = rowObject.canWrite;
    this.isCheckedSpeak = rowObject.canSpeak;
  }
  updateLanguage(languages: any) {
    // debugger;
    const langObj = {
      'userLangID': this.userLangID,
      'userID': languages.user_name,
      'modifideBy': this.createdBy,
      'weightage_Read': languages.read_weightage,
      'weightage_Write': languages.write_weightage,
      'weightage_Speak': languages.speak_weightage,
      'languageID': languages.language,
      'weightage': 10,
      'canRead': this.read,
      'canWrite': this.write,
      'canSpeak': this.speak
    };
    this.languageMapping.UpdateLanguageMapping(langObj)
      .subscribe(response => {
        console.log(response, 'after successful mapping of language to provider');
        this.alertService.alert('language mapping edited successfully');
        this.showTable();
        this.getAllMappedLanguagesList();
        this.resetDropdowns1();
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
      });


  }
  resetForm() {
    //this.Form.reset();
    // this.eForm.reset();
    this.Form.reset();
    this.eForm.reset();
    this.Language = undefined;
    this.userLangID = undefined;
    this.edit_Details = undefined;
  }
  resetDropdowns() {

  }
  resetDropdowns1() {
    this.canRead = [];
    this.canSpeak = [];
    this.canWrite = [];
    this.languageID = [];
    this.weightage = [];
    this.weightage_Read = [];
    this.weightage_Speak = [];
    this.weightage_Write = [];
  }
}

