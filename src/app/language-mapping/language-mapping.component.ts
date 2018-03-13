import { Component, OnInit, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { EmployeeMasterService } from '../services/ProviderAdminServices/employee-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { LanguageMapping } from '../services/ProviderAdminServices/language-mapping.service';
import { MdCheckbox, MdSelect } from '@angular/material';
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
  readweightage: any;
  writeweightage: any;
  speakweightage: any;


  // preferredlanguage: any;
  allLanguagesList: any = [];
  dummy_allLanguages: any = []; // just for visual tricks
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
  ReadWeightageList: any = [];
  WriteWeightageList: any = [];
  SpeakWeightageList: any = [];
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
  readCheckBoxState = true;
  writeCheckBoxState = true;
  speakCheckBoxState = true;
  addButtonState = true;
  updateButtonState = true;


  @ViewChild('editlanguagesForm') eForm: NgForm;
  @ViewChild('languagesForm') Form: NgForm;
  constructor(private alertService: ConfirmationDialogsService, private saved_data: dataService,
    private languageMapping: LanguageMapping) {
  }

  ngOnInit() {
    this.serviceProviderID = this.saved_data.service_providerID;
    this.createdBy = this.createdBy = this.saved_data.uname;
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
      this.alertService.alert('All languages for this user have been mapped');
    } else {
      this.filteredLanguages = filteredLanguages;
      this.language = undefined;
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
      this.bufferArray = [];
    }
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.resetDropdowns();
    this.bufferArray = [];
  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.getUserName(this.serviceProviderID);
    this.getAllLanguagesList();
    // this.showCheckboxes = true;
  }
  showEditForm() {
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
    this.getUserName(this.serviceProviderID);
    this.getAllLanguagesList();
  }
  Language(languageArray: any) {
    this.resetweightageDropdowns();
    this.isCheckedRead = false;
    this.showCheckboxes = true;
    this.showCheckboxes1 = true;
  }
  read: boolean = false;
  setRead(value) {
    if (value.checked) {
      this.read = true;
      this.ReadWeightageList = this.WeightageList;
      this.readCheckBoxState = false;
      this.resetweightageDropdowns();
    }
    else {
      this.read = false;
      this.ReadWeightageList = undefined;
      this.readCheckBoxState = true;
      this.resetweightageDropdowns();
    }
  }

  write: boolean = false;
  setWrite(value) {
    if (value.checked) {
      this.write = true;
      this.WriteWeightageList = this.WeightageList;
      this.readCheckBoxState = false;
      this.resetweightageDropdowns();
    }
    else {
      this.write = false;
      this.WriteWeightageList = undefined;
      this.writeCheckBoxState = true;
      this.resetweightageDropdowns();
    }
  }

  speak: boolean = false;
  setSpeak(value) {
    if (value.checked) {
      this.speak = true;
      this.SpeakWeightageList = this.WeightageList;
      this.speakCheckBoxState = false;
      this.resetweightageDropdowns();
    }
    else {
      this.speak = false;
      this.SpeakWeightageList = undefined;
      this.speakCheckBoxState = true;
      this.resetweightageDropdowns();
    }
  }
  readWeightage() {
    debugger;
    if (this.readweightage && !this.readCheckBoxState) {
      this.addButtonState = false;
      this.updateButtonState = false;
    }
    else {
      this.addButtonState = true;
      this.updateButtonState = true;
    }

  }
  writeWeightage(value) {
    if (this.writeweightage && !this.writeCheckBoxState) {
      this.addButtonState = false;
      this.updateButtonState = false;
    }
    else {
      this.addButtonState = true;
      this.updateButtonState = true;
    }

  }
  speakkWeightage(value) {
    if (this.speakweightage && !this.speakCheckBoxState) {
      this.addButtonState = false;
      this.updateButtonState = false;
    }
    else {
      this.addButtonState = true;
      this.updateButtonState = true;
    }

  }

  addLanguage(formValues: any) {
    // debugger;
    const obj = {
      'languageName': formValues.language.languageName,
      'userName': formValues.username.userName,
      'userID': formValues.username.userID,
      'createdBy': this.createdBy,
      'weightage_Read': [] = formValues.readweightage.value,
      'weightage_Write': [] = formValues.writeweightage.value,
      'weightage_Speak': [] = formValues.speakweightage.value,
      'languageID': [] = formValues.language.languageID,
      'canRead': this.read,
      'canWrite': this.write,
      'canSpeak': this.speak
    };
    this.read = false;
    this.write = false;
    this.speak = false;
    this.showCheckboxes = false;
    this.checkDuplicates(obj);


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
      this.resetDropdowns();
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
        // this.resetForm();
        this.resetDropdowns();
      }

    }
  }
  saveMapping() {
    // debugger;
    console.log('final buffer', this.bufferArray);
    let lang: any;
    let obj = {};
    obj['languageName'];
    obj['userName'];
    obj['userID'];
    obj['createdBy'];
    obj['weightage_Read'] = [];
    obj['weightage_Write'] = [];
    obj['weightage_Speak'] = [];
    obj['canRead'] = [];
    obj['canWrite'] = [];
    obj['canSpeak'] = [];
    obj['languageID'] = [];
    let duplicateArray = [];

    for (let i = 0; i < this.bufferArray.length; i++) {
      const index: number = duplicateArray.indexOf(this.bufferArray[i].userID);
      if (index == -1) {
        obj['languageName'] = this.bufferArray[i].languageName;
        obj['userName'] = this.bufferArray[i].userName;
        obj['userID'] = this.bufferArray[i].userID;
        obj['createdBy'] = this.createdBy;
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
        obj['canRead'] = this.canRead;
        obj['canWrite'] = this.canWrite;
        obj['canSpeak'] = this.canSpeak;
        obj['weightage_Read'] = this.weightage_Read;
        obj['weightage_Write'] = this.weightage_Write;
        obj['weightage_Speak'] = this.weightage_Speak;
        obj['weightage'] = this.weightage_Speak;
        obj['languageID'] = this.languageID;

      }
      // debugger;
      if (obj['userID'] !== undefined) {
        this.multiLanguages.push(obj);
      }

      obj = {};
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
        this.alertService.alert('Language mapped successfully');
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
    this.ReadWeightageList = this.WeightageList;
    this.WriteWeightageList = this.WeightageList;
    this.SpeakWeightageList = this.WeightageList;
  }
  updateLanguage(editFormValues: any) {
    // debugger;
    const obj = {
      'userLangID': this.userLangID,
      'userID': editFormValues.user_name,
      'modifideBy': this.createdBy,
      'weightage_Read': editFormValues.read_weightage,
      'weightage_Write': editFormValues.write_weightage,
      'weightage_Speak': editFormValues.speak_weightage,
      'languageID': editFormValues.language,
      'weightage': 10,
      'canRead': this.read,
      'canWrite': this.write,
      'canSpeak': this.speak
    };
    this.languageMapping.UpdateLanguageMapping(obj)
      .subscribe(response => {
        console.log(response, 'after successful mapping of language to provider');
        this.alertService.alert('Language mapping edited successfully');
        this.showTable();
        this.getAllMappedLanguagesList();
        this.resetDropdowns();
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
      });


  }
  resetForm() {
    //this.Form.reset();
    //this.eForm.reset();
    this.Language = undefined;
    this.userLangID = undefined;
    this.edit_Details = undefined;
  }
  resetweightageDropdowns() {
    this.readweightage = undefined;
    this.writeweightage = undefined;
    this.speakweightage = undefined;
  }
  resetDropdowns() {
    this.userNamesList = undefined;
    this.filteredLanguages = [];
    this.canRead = [];
    this.canSpeak = [];
    this.canWrite = [];
    this.languageID = [];
    this.weightage = [];
    this.weightage_Read = [];
    this.weightage_Speak = [];
    this.weightage_Write = [];
    this.ReadWeightageList = undefined;
    this.WriteWeightageList = undefined;
    this.SpeakWeightageList = undefined;
    this.showCheckboxes = false;
    this.showCheckboxes1 = false;
    this.resetweightageDropdowns();
  }
}

