import { Component, OnInit } from '@angular/core';
import { dataService } from 'app/services/dataService/data.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { ProviderAdminFetosenseTestMasterService } from 'app/services/ProviderAdminServices/fetosense-test-master-service.service';

@Component({
  selector: 'app-fetosense-test-master',
  templateUrl: './fetosense-test-master.component.html',
  styleUrls: ['./fetosense-test-master.component.css']
})
export class FetosenseTestMasterComponent implements OnInit {

  userID: any;
  showTestCreationForm: boolean = false;
  updateFeaturesToRoleFlag = false;
  showWorklist: boolean = false;
  showTestCreation: boolean = false;
  showFetosenseTestMaster: boolean = true;
  services : any = [];
  states : any = [];
  stateName: any;
  serviceLine: any;
  filteredFetosenseTests =[];
  provider_states: any = [];
  test: any;
  description: any;
  nationalFlag: boolean;
  providerServiceMapID: any;
  disableSelection: boolean = false;
  othersExist: boolean= false;
  selectedTest: any;
  searchedFetosenseTests =[];
  saveTest : boolean= false;
  updateTest : boolean= false;
  addButton: boolean= false;
  addedFetosenseTests: any = [];
  fetosenseTest: any ={};
  confirmMessage: any;
  fetosenseTestID : any;
  searchTest: any;
  state: any;
  constructor(public providerAdminTestMasterService: ProviderAdminFetosenseTestMasterService,
     private commonDataService: dataService,
     private alertService: ConfirmationDialogsService) {
  }
  
  ngOnInit(): void {
    this.userID= this.commonDataService.uid;
    this.getProviderServices();
    }
    getProviderServices() {
      this.providerAdminTestMasterService.getServices(this.userID)
        .subscribe(response => {
          if(response !== null && response !== undefined)
            this.services = response;
        }, err => {
          this.alertService.alert('error' ,err);
        });
    }
    getStates(serviceLine) {
      this.states = [];
      this.state='';
      this.searchTest = '';
      this.searchedFetosenseTests = [];
      this.filteredFetosenseTests = [];
      let getStateObj = {
        'userID': this.userID,
        'serviceID': serviceLine.serviceID,
        'isNational': serviceLine.isNational
      }
      this.providerAdminTestMasterService.getStates(getStateObj).
        subscribe(response => this.getStatesSuccessHandeler(response), err => {
          this.alertService.alert('error' ,err);
        });
    }
    getStatesSuccessHandeler(response) {
      if (response) {
        console.log(response, 'Provider States');
        this.states = response;
      }
    }
    testWorklist(stateName){
      this.providerServiceMapID = stateName.providerServiceMapID;
      this.showWorklist = true;
      this.getTestsWorklist();
    }
    getTestsWorklist() {
      this.providerAdminTestMasterService.getTests(this.providerServiceMapID)
        .subscribe((res) => {
          let procedureList = res;
          console.log(procedureList);
          this.filteredFetosenseTests = res;
          this.searchedFetosenseTests = res;
        });  
    }
    filterTestsList(searchTerm?: string) {
      if (!searchTerm) {
         this.filteredFetosenseTests =  this.searchedFetosenseTests ;
      } else {
        this.filteredFetosenseTests = [];
        this.searchedFetosenseTests.forEach((item) => {
          for (let key in item) {
            if (key == 'testName' || key == 'testDesc') {
              let value: string = '' + item[key];
              if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                this.filteredFetosenseTests.push(item); break;
              }
            }
          }
        });
      }
    }
    createTest() {  
        this.disableSelection = true;
        this.showTestCreationForm = true;
        this.showWorklist = false;
        this.selectedTest = undefined;
        this.addButton= true;
        this.showTestCreation= true;
        this.showFetosenseTestMaster= false;
    }
    addTests(test, desc) {
      const result = this.validateTest(test);
      let selectedTests = [];
      if (test === null)
        this.alertService.alert("No more Tests to add");
      if (Array.isArray(test)){
        selectedTests = test;
        console.log("Selected tests", selectedTests);
      }
      else{
        selectedTests.push(test);
      }
      if (result){
        this.validateAddedTest(test, desc);
      }
       this.saveTest = true;
       this.updateTest = false;
       this.test= '';
       this.description = '';
    }
    validateAddedTest(test, desc){
      if (this.addedFetosenseTests.length < 1) {
        let fetosenseTest = this.addtempTestMap(test, desc);
        if (fetosenseTest.testName.trim().length > 0) {
          this.addedFetosenseTests.push(fetosenseTest);}}
      else {
        for(let addedTest of this.addedFetosenseTests){
          if (addedTest.testName.toLowerCase().trim() === test.toLowerCase().trim()) {
            this.alertService.alert("Test name already exists");
            return;}}
        let fetosenseTest = this.addtempTestMap(test, desc);
        if (fetosenseTest.testName.trim().length > 0 && fetosenseTest.testName !== undefined) {
          this.addedFetosenseTests.push(fetosenseTest);}}
    }
    addtempTestMap(test, desc) {
       this.fetosenseTest = {
        'testName': test,
        'testDesc': desc === "" || undefined ? null : desc,
        'createdBy': this.commonDataService.uname,
        'providerServiceMapID': this.providerServiceMapID
      }
      return this.fetosenseTest;
    }
    saveTests(){     
      this.providerAdminTestMasterService.createTests(this.addedFetosenseTests)
      .subscribe(response => this.testStatusSuccessHandeler(response, 'save'), err => {
        this.alertService.alert('error' ,err);
      });
    }
    editTest(roleObj) {
      this.test= roleObj.testName;
      this.description = roleObj.testDesc;
      this.saveTest = false;
      this.updateTest = true;
      this.addButton= false;
      this.disableSelection = true;
      this.showTestCreationForm = true;
      this.showWorklist = false;
      this.selectedTest = roleObj.testName;
      this.fetosenseTestID = roleObj.fetosenseTestID;
      this.showFetosenseTestMaster= false;
    }
    updateTestChanges(){
      let fetosenseTest = {
        "fetosenseTestID": this.fetosenseTestID,
        'testName': this.test,
        'testDesc': this.description,
        'createdBy': this.commonDataService.uname,
        'providerServiceMapID': this.providerServiceMapID
      }
      this.providerAdminTestMasterService.updateTest(fetosenseTest)
      .subscribe(response => {
        this.testStatusSuccessHandeler(response, 'update')
      }, err => {
        this.alertService.alert('error' ,err);
      });
    }
    removeTest(index) {
      this.addedFetosenseTests.splice(index, 1);
      if(this.addedFetosenseTests.length === 0)
        this.saveTest=false;
    }
    deleteTest(fetoID, flag){
      let fetosenseTest = {
        "fetosenseTestID": fetoID,
        "deleted": flag
      } 
      if (flag) {
        this.confirmMessage = 'Deactivate';
      } else {
        this.confirmMessage = 'Activate';
      }
       this.alertService.confirm('Confirm', 'Are you sure you want to ' + this.confirmMessage + '?').subscribe((res) => {
         if (res) {
          this.providerAdminTestMasterService.deleteTest(fetosenseTest)
          .subscribe(response => this.testStatusSuccessHandeler(response, this.confirmMessage), err => {
            this.alertService.alert('error' ,err);
          });
         }
       },
        (err) => {
          this.alertService.alert('error' ,err);
        })
    }
    back(){
      this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
        if (res) {
          this.setTestsFormFlag();
          this.getTestsWorklist();
        }
      })
    }
    validateTest(test) {
      if (this.selectedTest !== undefined && this.selectedTest.trim().toUpperCase() === test.trim().toUpperCase()) {
        this.othersExist = false;
      }
      else {
        let count = 0;
        for(const filteredTest of this.searchedFetosenseTests){
          if (filteredTest.testName.trim().toUpperCase() === test.trim().toUpperCase()) {
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
    setTestsFormFlag() {
      this.test= '';
      this.description = '';
      this.searchTest = '';
      this.showTestCreationForm = false;
      this.showWorklist = true;
      this.disableSelection = false;
      this.othersExist= false; 
      this.saveTest= false;
      this.updateTest= false;
      this.addedFetosenseTests=[];
      this.showTestCreation= false;
      this.showFetosenseTestMaster= true;
      this.selectedTest = undefined;
    }
    testStatusSuccessHandeler(response, status) {
      if(status==='save'){
        this.alertService.alert('Saved successfully', 'success');
        console.log(response, 'in create role success in component.ts');
      }
      else if(status==='update'){
        this.alertService.alert('Updated successfully', 'success');
      }
      else{
        this.alertService.alert(status+'d successfully', 'success');
      }
      this.setTestsFormFlag();
      this.getTestsWorklist();
    }
}
