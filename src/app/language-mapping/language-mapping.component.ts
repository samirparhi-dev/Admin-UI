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
  username: any;
  language: any;
  serviceProviderID: any;
  userLangID: any;
  edit_Details: any;
  readweightage: any;
  writeweightage: any;
  speakweightage: any;
  weightageRead: any;
  weightageWrite: any;
  weightageSpeak: any;
  userID: any;


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
  disableUsername: boolean = false;


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
        this.alertService.alert(err, 'error');
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
        this.alertService.alert(err, 'error');
      });
  }
  getAllMappedLanguagesList() {
    this.languageMapping.getMappedLanguagesList(this.serviceProviderID)
      .subscribe(response => {
        if (response) {
          console.log('All Languages Success Handeler', response);
          this.LanguageMappedList = response;
        }
      }, err => {
        console.log('Error', err);
        this.alertService.alert(err, 'error');
      });
  }
  getAvailableLanguages(username: any) {
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
    this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
      if (response) {
        const object = {
          'userLangID': userLangID,
          'deleted': false
        };

        this.languageMapping.DeleteLanguageMapping(object)
          .subscribe(response => {
            if (response) {
              this.alertService.alert('Activated successfully', 'success');
              /* refresh table */
              this.getAllMappedLanguagesList();
            }
          },
            err => {
              console.log('error', err);
              this.alertService.alert(err, 'error');
            });
      }
    });

  }
  deactivate(userLangID) {
    this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
      if (response) {
        const object = { 'userLangID': userLangID, 'deleted': true };

        this.languageMapping.DeleteLanguageMapping(object)
          .subscribe(response => {
            if (response) {
              this.alertService.alert('Deactivated successfully', 'success');
              /* refresh table */
              this.getAllMappedLanguagesList();
            }
          },
            err => {
              console.log('error', err);
              this.alertService.alert(err, 'error');
            });
      }
    });

  }
  showTable() {
    if (this.editMode) {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.resetDropdowns();
      this.showCheckboxes = false;
      this.bufferArray = [];
    }
    this.tableMode = true;
    this.formMode = false;
    this.editMode = false;
    this.resetDropdowns();
    this.showCheckboxes = false;
    this.bufferArray = [];
  }
  showForm() {
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
    this.getUserName(this.serviceProviderID);
    this.getAllLanguagesList();
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

  }
  editLanguage(languageArray: any) {
    this.resetEditWeightageDropdowns();

  }
  read: boolean = false;
  setRead(value) {
    debugger;
    if (value.checked) {
      this.read = true;
      this.ReadWeightageList = this.WeightageList;
      this.readCheckBoxState = false;
      this.readweightage = undefined;

    }
    else {
      this.read = false;
      this.ReadWeightageList = undefined;
      this.readCheckBoxState = true;
      this.readweightage = undefined;
      // this.edit_Details.weightageRead = undefined;
      if (!this.write && !this.speak) {
        this.addButtonState = true;
      }
    }
  }

  write: boolean = false;
  setWrite(value) {
    if (value.checked) {
      this.write = true;
      this.WriteWeightageList = this.WeightageList;
      this.readCheckBoxState = false;
      this.writeweightage = undefined;
    }
    else {
      this.write = false;
      this.WriteWeightageList = undefined;
      this.writeCheckBoxState = true;
      this.writeweightage = undefined;
      //this.edit_Details.weightageWrite = undefined;
      if (!this.read && !this.speak) {
        this.addButtonState = true;
      }
    }
  }

  speak: boolean = false;
  setSpeak(value) {
    if (value.checked) {
      this.speak = true;
      this.SpeakWeightageList = this.WeightageList;
      this.speakCheckBoxState = false;
      this.speakweightage = undefined;
    }
    else {
      this.speak = false;
      this.SpeakWeightageList = undefined;
      this.speakCheckBoxState = true;
      this.speakweightage = undefined;
      // this.edit_Details.weightageSpeak = undefined;
      if (!this.read && !this.write) {
        this.addButtonState = true;
      }
    }
  }
  readWeightage() {
    if (this.readweightage && !this.readCheckBoxState) {
      this.addButtonState = false;
    }

  }
  writeWeightage() {
    if (this.writeweightage && !this.writeCheckBoxState) {
      this.addButtonState = false;
    }

  }
  speakWeightage() {
    if (this.speakweightage && !this.speakCheckBoxState) {
      this.addButtonState = false;
    }

  }

  addLanguage(formValues: any) {
    const obj = {
      'languageName': formValues.language.languageName,
      'userName': formValues.username.userName,
      'userID': formValues.username.userID,
      'createdBy': this.createdBy,
      'weightage_Read': [] = this.readweightage === undefined ? 0 : formValues.readweightage.value,
      'weightage_Write': [] = this.writeweightage === undefined ? 0 : formValues.writeweightage.value,
      'weightage_Speak': [] = this.speakweightage === undefined ? 0 : formValues.speakweightage.value,
      'languageID': [] = formValues.language.languageID,
      'canRead': this.readweightage === 0 ? false : this.read,
      'canWrite': this.writeweightage === 0 ? false : this.write,
      'canSpeak': this.speakweightage === 0 ? false : this.speak
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
    console.log(object, 'BEFORE TESTING THE OBJECT SENT');
    /* case:1 If the buffer array is empty */
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
      // this.resetForm();
      // this.resetDropdowns();
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
    console.log('final buffer', this.bufferArray);
    let lang: any;
    let obj = {};
    obj['serviceProviderID'];
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
        obj['serviceProviderID'] = this.serviceProviderID;
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
        this.alertService.alert('Language mapped successfully', 'success');
        this.showTable();
        this.getAllMappedLanguagesList();
        this.resetDropdowns();
        this.bufferArray = [];
        this.multiLanguages = [];
      }, err => {
        console.log(err, 'ERROR');
        this.alertService.alert(err, 'error');
      });
  }
  editRow(rowObject) {
    debugger;
    this.showEditForm();
    this.disableUsername = true;
    this.userID = rowObject.userID;
    this.userLangID = rowObject.userLangID;
    this.edit_Details = rowObject;
    this.showCheckboxes = true;
    this.isCheckedRead = rowObject.canRead;
    this.isCheckedWrite = rowObject.canWrite;
    this.isCheckedSpeak = rowObject.canSpeak;
    this.read = rowObject.canRead;
    this.write = rowObject.canWrite;
    this.speak = rowObject.canSpeak;
    this.edit_Details.weightageRead = rowObject.weightage_Read;
    this.edit_Details.weightageWrite = rowObject.weightage_Write;
    this.edit_Details.weightageSpeak = rowObject.weightage_Speak;

    if (rowObject.weightage_Read)
      this.ReadWeightageList = this.WeightageList;
    if (rowObject.weightage_Write)
      this.WriteWeightageList = this.WeightageList;
    if (rowObject.weightage_Speak)
      this.SpeakWeightageList = this.WeightageList;
    this.getAvailableLanguages(this.edit_Details.userID)
  }
  updateLanguage(editFormValues: any) {
    debugger;
    const obj = {
      'userLangID': this.userLangID,
      'userID': this.userID,
      'modifideBy': this.createdBy,
      'weightage_Read': editFormValues.read_weightage === undefined ? 0 : editFormValues.read_weightage,
      'weightage_Write': editFormValues.write_weightage === undefined ? 0 : editFormValues.write_weightage,
      'weightage_Speak': editFormValues.speak_weightage === undefined ? 0 : editFormValues.speak_weightage,
      'languageID': editFormValues.language,
      'weightage': 10,
      'canRead': this.read,
      'canWrite': this.write,
      'canSpeak': this.speak
    };
    this.languageMapping.UpdateLanguageMapping(obj)
      .subscribe(response => {
        console.log(response, 'after successful mapping of language to provider');
        this.alertService.alert('Language mapping edited successfully', 'success');
        this.showTable();
        this.getAllMappedLanguagesList();
        this.resetDropdowns();
        this.bufferArray = [];
      }, err => {
        console.log(err, 'ERROR');
        this.alertService.alert(err, 'error');
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
    this.isCheckedRead = false;
    this.isCheckedWrite = false;
    this.isCheckedSpeak = false;
    this.showCheckboxes = true;
  }
  resetEditWeightageDropdowns() {
    this.edit_Details.weightageRead = undefined;
    this.edit_Details.weightageWrite = undefined;
    this.edit_Details.weightageSpeak = undefined;
    this.isCheckedRead = false;
    this.isCheckedWrite = false;
    this.isCheckedSpeak = false;
    this.showCheckboxes = true;
  }
  resetDropdowns() {
    this.username = undefined;
    this.language = undefined;
    this.canRead = [];
    this.canSpeak = [];
    this.canWrite = [];
    this.languageID = [];
    this.weightage = [];
    this.weightage_Read = [];
    this.weightage_Speak = [];
    this.weightage_Write = [];
    this.ReadWeightageList = [];
    this.WriteWeightageList = [];
    this.SpeakWeightageList = [];
    this.showCheckboxes = false;
    this.resetweightageDropdowns();
  }
}

