import { Component, OnInit, ElementRef } from '@angular/core';
import { EmployeeMasterService } from '../services/ProviderAdminServices/employee-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

declare var jQuery: any;

@Component({
  selector: 'app-employee-details-capturing',
  templateUrl: './employee-details-capturing.component.html',
  styleUrls: ['./employee-details-capturing.component.css']
})


export class EmployeeDetailsCapturingComponent implements OnInit {

  index: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  countryID: any;
  data: any = [];
  lang: any;
  username_status: any;
  showHint: boolean;
  username_dependent_flag: boolean;
  multiLanguages: any = [];
  /*demographics*/
  title: any;
  firstname: any;
  middlename: any;
  lastname: any;
  gender: any;
  dob: any;
  mobileNumber: any;
  emailID: any;
  employeeID: any;
  today = new Date();
  allTitles: any = [];
  allGenders: any = [];
  hideOffRole: boolean = false;
  designation: any;
  /*qualification*/
  qualificationType: any;
  father_name: any;
  mother_name: any;
  marital_status: any;
  religion: any;
  community: any
  showSlider: boolean = false;

  allQualificationTypes: any = [];
  communities: any = [];
  marital_status_array: any = [];
  religions: any = [];
  // allQualifications:any=[];

  /*language*/
  languages: any;
  // preferredlanguage: any;
  allLanguages: any = [];
  dummy_allLanguages: any = [];// just for visual tricks
  selected_languages: any = [];
  language_weightage: any = [];

  /*address*/
  permanentAddressLine1: any;
  permanentAddressLine2: any;
  permanentState: any;
  permanentDistrict: any;
  permanentPincode: any;

  currentAddressLine1: any;
  currentAddressLine2: any;
  currentState: any;
  currentDistrict: any;
  currentPincode: any;
  email_expression: any;
  isPermanent: any;

  allStates: any = [];
  districts:any=[];
  districts_permanent: any = [];
  districts_current: any = [];

  /*work place*/
  officeState: any;
  oficeDistrict: any;
  agent_officeName: any;
  agent_serviceline: any;
  agent_role: any;

  serviceproviderAllStates: any = [];
  serviceproviderDistricts: any = [];
  serviceproviderAllOfficesInState: any = [];
  serviceproviderAllRoles: any = [];
  serviceproviderAllServices: any = [];
  sliderarray: any = [];
  /*unique IDs*/

  // ID_Type:any;
  // ID_Value:any;

  // allIDTypes: any = [];     not used as of now
  adhaar_no: any;
  pan_no: any;


  /*credentials*/
  username: any;
  password: any;
  agentID: any;

  // arrays
  showAdd: boolean = false;
  govtIDs: any = [];
  allDesignations: any = [];

  constructor(public EmployeeMasterService: EmployeeMasterService, public commonDataService: dataService, private alertService: ConfirmationDialogsService) {
    this.languages = [];
    this.index = 0;

    this.serviceProviderID = this.commonDataService.service_providerID;
    this.countryID = 1; // hardcoded as country is INDIA

    this.showHint = false;
    this.username_dependent_flag = true;

  }

  ngOnInit() {
    jQuery("#UD0").css('font-size', '130%');
    this.dob = new Date();
    this.dob.setFullYear(this.today.getFullYear() - 20);
    this.EmployeeMasterService.getCommonRegistrationData()
      .subscribe(response => this.commonRegistrationDataSuccessHandeler(response));
    this.EmployeeMasterService.getStatesOfServiceProvider(this.serviceProviderID)
      .subscribe(response => this.getStatesOfServiceProviderSuccessHandeler(response));
    this.EmployeeMasterService.getQualifications().subscribe(response => this.getQualificationsHandeler(response));
    // this.emailPattern = /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    this.email_expression=/^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|in|co.in)\b$/;

    this.data = [];
    this.previleges = [];
    this.EmployeeMasterService.getDesignations().subscribe(response => this.allDesignationsSuccess(response));
  }

  setGenderOnCondition(title)
  {
    if(title===2||title===4||title===5||title===13)
    {
      this.gender=2;
    }
    else if(title===3||title===8)
    {
      this.gender=1;
    }
    else
    {
      this.gender="";
    }
  }

  

  getServices(value) {
    this.EmployeeMasterService.getServicesOfServiceProvider(this.serviceProviderID, value.stateID)
      .subscribe(response => this.getServicesOfServiceProviderSuccessHandeler(response));

  }

  getOffices(value1, value2) {

    this.EmployeeMasterService.getWorkLocationsInState(this.serviceProviderID, value1.stateID, value2.serviceID)
      .subscribe(response => this.getWorkLocationsInStateSuccessHandeler(response));

  }
  allDesignationsSuccess(res) {
    console.log(res, "2222");
    this.allDesignations = res;
  }
  getRoles(value1, value2) {
    this.EmployeeMasterService.getRoles(this.serviceProviderID, value1.stateID, value2.serviceID)
      .subscribe(response => this.getRolesSuccessHandeler(response));
    this.hideOffRole = true;

  }

  commonRegistrationDataSuccessHandeler(response) {
    console.log(response, 'emp master component common reg data');
    this.allTitles = response.m_Title;
    this.allGenders = response.m_genders;

    this.allLanguages = response.m_language;
    this.dummy_allLanguages = response.m_language;
    this.allStates = response.states;
    // this.allIDTypes = response.govtIdentityTypes;
    this.communities = response.m_communities;
    this.marital_status_array = response.m_maritalStatuses;

  }

  getQualificationsHandeler(response) {
    console.log(response, 'qualifications');
    this.allQualificationTypes = response;
  }
  hide: boolean = true;
  createEmployeeSuccessHandeler(response) {
    console.log(response, 'employee created successfully');
    this.alertService.alert("Employee created successfully");
    // alert('Employee Created Successfully!');
    jQuery('#credentialsForm').trigger('reset');
    jQuery('#uniquieID').trigger('reset');
    jQuery('#addrsForm').trigger('reset');
    jQuery('#demographicForm').trigger('reset');
    jQuery('#otherDetails').trigger('reset');
    jQuery('#workplaceForm').trigger('reset');
    jQuery('#languagesForm').trigger('reset');
    this.dob = new Date();
    this.dob.setFullYear(this.today.getFullYear() - 20);
    this.data = [];
    this.previleges = [];
    this.MOVE2NEXT(0);
    this.hide = false;
  }
  goBackToView() {
    this.hide = false;
  }
  getDistrictsSuccessHandeler(response) {
    console.log(response, 'districts retrieved');
    this.districts = response;
  }

  getpermanentDistrictsSuccessHandeler(response) {
    console.log(response, 'districts retrieved');
    this.districts_permanent = response;
  }

  getcurrentDistrictsSuccessHandeler(response) {
    console.log(response, 'districts retrieved');
    this.districts_current = response;
  }

  getOfficeDistrictsSuccessHandeler(response) {
    console.log(response, 'office districts');
    this.serviceproviderDistricts = response;
    this.formResetForNewEntry();
  }

  getStatesOfServiceProviderSuccessHandeler(response) {
    this.serviceproviderAllStates = response;
  }

  getServicesOfServiceProviderSuccessHandeler(response) {
    console.log('all services', response);
    this.serviceproviderAllServices = response;
  }

  getWorkLocationsInStateSuccessHandeler(response) {
    console.log('all offices', response);

    this.serviceproviderAllOfficesInState = response.filter(function (obj) {
      return obj.deleted == false;
    })
  }

  getRolesSuccessHandeler(response) {
    console.log('all roles', response);
    this.serviceproviderAllRoles = response.filter(function (obj) {
      return obj.deleted == false;
    });
  }

  disable_currentAddress_flag:boolean=false;
  addressCheck(value) {
    if (value.checked) {
      this.currentAddressLine1 = this.permanentAddressLine1;
      this.currentAddressLine2 = this.permanentAddressLine2;
      this.currentState = this.permanentState;

      this.districts_current=this.districts_permanent;
      this.currentDistrict = this.permanentDistrict;
      this.currentPincode = this.permanentPincode;

      this.isPermanent = '1';
      this.disable_currentAddress_flag=true;
    } else {
      this.currentAddressLine1 = '';
      this.currentAddressLine2 = '';
      this.currentState = '';
      this.currentDistrict = '';
      this.currentPincode = '';
      this.isPermanent = '0';
      this.disable_currentAddress_flag=false;

      this.districts_current=[];
      
    }
  }

  reset()
  {
    this.districts_permanent=[];
    this.districts_current=[];
  }

  MOVE2NEXT(value) {
    this.index = value;

    jQuery('#UD' + value).css('font-size', '130%');

    for (let i = 0; i <= 6; i++) {
      if (i === value) {
        continue;
      } else {
        jQuery('#UD' + i).css('font-size', '13px');
      }
    }
  }

  setProviderServiceMapID(psmID) {
    this.providerServiceMapID = psmID;
  }

  getDistricts(stateID) {
    this.EmployeeMasterService.getDistricts(stateID).subscribe(response => this.getDistrictsSuccessHandeler(response));
  }

  getpermanentDistricts(stateID)
  {
    this.EmployeeMasterService.getDistricts(stateID).subscribe(response => this.getpermanentDistrictsSuccessHandeler(response));

  }

  getcurrentDistricts(stateID){
        this.EmployeeMasterService.getDistricts(stateID).subscribe(response => this.getcurrentDistrictsSuccessHandeler(response));


  }

  getOfficeDistricts(value) {
    this.EmployeeMasterService.getDistricts(value.stateID).subscribe(response => this.getOfficeDistrictsSuccessHandeler(response));
  }

  disableLanguageSubmit: boolean = true;
  updateSliderData(data, index) {
    let index_exists = false;
    let obj = {};
    obj = {
      'language_index': index,
      'value': data
    }
    let temp: boolean = false;
    let a;
    if (this.sliderarray.length === 0) {
      this.sliderarray.push(obj);
    }
    else {
      for (let i = 0; i < this.sliderarray.length; i++) {
        if (this.sliderarray[i].language_index == index) {
          a = i;
          temp = true;
          break;
        }

      }
      if (temp) {
        this.sliderarray[a].value = data;
        index_exists = true;
      }
      if (index_exists == false) {
        this.sliderarray.push(obj);
      }
    }

    // assigning weightage array
    for (let i = 0; i < this.sliderarray.length; i++) {
      this.language_weightage.push(this.sliderarray[i].value);
    }

    // to  check highly proficient language.....not the most proficient language would be at the end of array

    this.sliderarray.sort(function (a, b) { return a.value - b.value });
    console.log(this.sliderarray);
    this.disableLanguageSubmit = true;
    this.disableLanguageSubmit = this.sliderarray.forEach(function (obj) {
      if (obj.value > 0) {

        return false;

      }
    });
    console.log(this.disableLanguageSubmit);
  }

  previleges: any = [];
  pushPrivelege(value) {

    console.log(this.previleges);
    console.log(value);
    let temp;
    let flag;
    if (this.previleges.length == 0) {
      this.addToTable(value);
      flag = false;
    }
    else {
      flag = true;
      let mapIdMatched = false;
      for (var i = 0; i < this.previleges.length; i++) {
        temp = false;
        if (this.previleges[i].providerServiceMapID == value.agent_serviceline.providerServiceMapID) {
          temp = true;
          flag = false;
          mapIdMatched = true;
        }
        if (temp) {
          for (var j = 0; j < this.previleges[i].roleID.length; j++) {
            //console.log(this.previleges[i].roleID);
            for (var z = 0; z < value.agent_role.length; z++) {
              // console.log(value.agent_role[z].roleID);
              if (value.agent_role[z].roleID == this.previleges[i].roleID[j]) {
                value.agent_role.splice(z, 1);
                console.log(value);
              }
            }
          }
        }
      }
      if (value.agent_role.length > 0 && mapIdMatched) {
        this.addToTable(value);
      }
      else
      {
        this.alertService.alert("Value Already Exists in Table");
      }
    }
    if (flag) {
      this.addToTable(value);
    }
    // else
    // {
    //   this.alertService.alert("Value Already Exists in Table");
    // }
  }
  addToTable(value) {
    let roleNames = "";
    let roleIds = [];
    for (var i = 0; i < value.agent_role.length; i++) {
      roleNames += value.agent_role[i].roleName + " ";
      roleIds.push(value.agent_role[i].roleID);
    }

    let obj = {
      'roleName': roleNames,
      'state': value.state.stateName,
      'serviceLineName': value.agent_serviceline.serviceName,
      'workingLocationName': value.agent_officeName.locationName
    }
    let previlege = {
      "roleID": roleIds,
      "providerServiceMapID": value.agent_serviceline.providerServiceMapID,
      "workingLocationID": value.agent_officeName.pSAddMapID
    }
    this.data.push(obj);
    this.previleges.push(previlege);

    this.formResetForNewEntry();
    this.officeState = "";

  }

  removePrivelege(index) {
    this.data.splice(index, 1);
    this.previleges.splice(index, 1);
    console.log(this.data);
    console.log(this.previleges);
  }
  roleSelected(value) {
    if (value.length > 0) {
      this.showAdd = true;
    }
    else {
      this.showAdd = false;
    }
  }
  formResetForNewEntry() {
    this.hideOffRole = false;
    this.showAdd = false;
    this.agent_role = "";
    this.agent_serviceline = "";
  }

  // AddIDs(type,value)
  // {
  // 	let obj={
  // 		'IDtype':type,
  // 		'IDvalue':value
  // 	}

  // 	if (this.govtIDs.length===0)
  // 	{
  // 		this.govtIDs.push(obj);
  // 		this.ID_Type = "";
  // 		this.ID_Value = "";
  // 	}else
  // 	{
  // 		let count = 0;
  // 		for (let i = 0; i < this.govtIDs.length;i++)
  // 		{
  // 			if (type === this.govtIDs[i].IDtype)
  // 			{
  // 				count = count + 1;
  // 			}
  // 		}
  // 		if(count===0)
  // 		{
  // 			this.govtIDs.push(obj);
  // 			this.ID_Type = "";
  // 			this.ID_Value = "";
  // 		}
  // 	}

  // }

  // RemoveID(index)
  // {
  // 	this.govtIDs.splice(index,1);
  // }


  createEmployee() {
    console.log(this.previleges);
    if(this.adhaar_no==="")
    {
      this.adhaar_no=undefined;
    }
    if(this.pan_no==="")
    {
      this.pan_no=undefined;
    }
    let request_object = {

      'titleID': this.title,
      'firstName': this.firstname,
      'middleName': this.middlename,
      'lastName': this.lastname,
      'genderID': this.gender,
      'maritalStatusID': this.marital_status,
      'aadhaarNo': this.adhaar_no,
      'pAN': this.pan_no,
      'dOJ': '2017-08-02T00:00:00.000Z',
      'qualificationID': this.qualificationType,
      'userName': this.username,
      'agentID': this.agentID,
      'emailID': this.emailID,
      'statusID': 1,  // because its a new user 
      // "emergencyContactPerson": "Ish Gandotra",
      'designation': this.designation,
      'emergencyContactNo': '9023650041',
      // "titleName": "Mrs",
      // "status": "New",
      // "qualificationName": "PostGraduate",
      'createdBy': this.commonDataService.uname,
      'modifiedBy': '',
      'password': this.password,
      'agentPassword': this.password,
      // "createdDate": "2017-08-01T00:00:00.000Z",
      'fathersName': this.father_name,
      'mothersName': this.mother_name,
      'addressLine1': this.permanentAddressLine1,
      'addressLine2': this.permanentAddressLine2,
      // "addressLine3": "xzli",
      // "addressLine4": "abc1",
      // "addressLine5": "abc2",
      'cityID': '1',
      'stateID': this.permanentState,
      'communityID': this.community,
      //'religionID': this.religion,
      'countryID': this.countryID,
      'pinCode': this.permanentPincode,
      'isPresent': '1',  // by default it will remain 1 , if checked, then permanent will also be 1
      'isPermanent': this.isPermanent,
      'languageID': this.multiLanguages.map(item => { return item.languageID }),
      'weightage': this.multiLanguages.map(item => { return item.weightage }),
      // 'languageID': this.languages,
      // 'weightage': this.language_weightage,
      'previleges': this.previleges
      // "roleID": this.agent_role,
      // "serviceProviderID": this.serviceProviderID,
      // "providerServiceMapID": this.providerServiceMapID,
      // "workingLocationID": this.agent_officeName
    }
    console.log(request_object);
    let a = JSON.stringify(request_object);
    console.log(a);
    ;
    // console.log('create employee request Object:', JSON.stringify(request_object));
    this.EmployeeMasterService.createEmployee(a).subscribe(response => this.createEmployeeSuccessHandeler(response));
  }



  checkUsernameExists(username) {
    this.EmployeeMasterService.checkUsernameExists(username).subscribe(response => this.checkUsernameSuccessHandeler(response));
  }

  checkUsernameSuccessHandeler(response) {
    console.log(this.username, 'uname');
    console.log('username existance status', response);
    if (response === 'userexist') {
      this.username_status = 'Username Exists !! Choose A Different \'Username\' Please!';
      this.showHint = true;
      this.username_dependent_flag = true;
    }
    if (response === 'usernotexist') {
      if (this.username != '' && (this.username != undefined && this.username != null)) {
        this.showHint = false;
        this.username_dependent_flag = false;
      }
      else {
        this.showHint = true;
        this.username_dependent_flag = true;
        this.username_status = 'Username can\'t be blank';
      }

    }
  }
  setLanguage(languageArray: any) {

    this.lang = languageArray;
    this.showSlider = true;
  }
  addLanguage(language: any, weightage: any) {
    ;
    let langObj = {};
    langObj['languageName'] = language.languageName;
    langObj['languageID'] = language.languageID;
    langObj['weightage'] = weightage;
    if (this.multiLanguages.length === 0) {
      this.multiLanguages.push(langObj);
    } else {
      this.multiLanguages.push(langObj);
      this.multiLanguages = this.filterArray(this.multiLanguages);
    }
  }
  deleteRow(i) {
    ;
    this.multiLanguages.splice(i, 1);
  }
  filterArray(array: any) {
    const o = {};
    return array = array
      .filter((thing, index, self) => self
        .findIndex((t) => { return t.languageID === thing.languageID }) === index)
  }



  duplicateCheckFlag:boolean=false;

  checkAdhaar(uniqueIDnumber)
  {
    if(uniqueIDnumber!="")
    {
      this.EmployeeMasterService.validateAdhaar(uniqueIDnumber).subscribe(response => this.checkDuplicateSuccessHandeler(response));
    }
    else
    {
      this.duplicateCheckFlag=false;
    }
  }

  checkPan(uniqueIDnumber)
  {
    if(uniqueIDnumber!="")
    {
      this.EmployeeMasterService.validatePan(uniqueIDnumber).subscribe(response => this.checkDuplicateSuccessHandeler(response));
    }
    else
    {
      this.duplicateCheckFlag=false;
    }
  }

  checkDuplicateSuccessHandeler(response)
  {
    if(response)
    {
      console.log("duplicate check response",response);
      if(response==="true")
      {
        this.duplicateCheckFlag=true;
        this.alertService.alert("ID value entered is duplicate. Kindly enter a unique value");
      }
      if(response==="false")
      {
        this.duplicateCheckFlag=false;
      }
    }
  }
}
