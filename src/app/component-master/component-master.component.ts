import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ComponentMasterServiceService } from './../services/ProviderAdminServices/component-master-service.service';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ServicePointMasterService } from '../services/ProviderAdminServices/service-point-master-services.service';
import { ComponentNameSearchComponent } from 'app/component-name-search/component-name-search.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.css']
})
export class ComponentMasterComponent implements OnInit {

  serviceline: any;
  searchStateID: any;
  provider_states: any = [];
  userID: any;
  services_array: any = [];
  checkradioButton: boolean;
  checktextbox: boolean;
  state: any;
  service: any;

  allowDecimal: any = 'number';
  isDecimal: any = '0';
  states: any;
  services: any;
  disableSelection: boolean = false;

  editMode: any = false;
  serviceProviderID: any;

  STATE_ID: any;
  SERVICE_ID: any;
  providerServiceMapID: any;
  unfilled: Boolean = false;
  editProcedure: any;
  componentForm: FormGroup;
  componentList: any;
  filteredComponentList: any;
  tableMode: boolean = false;
  saveEditMode: boolean = false;
  alreadyExist: boolean = false;
  iotComponentArray:any=[];
  components=[];
  pageCount: any;
  pager: any = {
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    pages: 0
  };
  loincNo: any=null;
  componentFlag: boolean=false;
  // enableSave: boolean=true;
  // enableUpdate: boolean=false;
  enableAlert: boolean=true;
  // deleteFlag: boolean=true;
  

  constructor(private commonDataService: dataService,
    private fb: FormBuilder,
    private alertService: ConfirmationDialogsService,
    public providerAdminRoleService: ProviderAdminRoleService,
    private componentMasterServiceService: ComponentMasterServiceService,
    public stateandservices: ServicePointMasterService,public dialog: MdDialog) {
    this.states = [];
    this.services = [];

  }

  ngOnInit() {
   
    this.initiateForm();
    console.log(this.componentForm)
    this.componentForm.controls['testLoincComponent'].disable();
  }
  /**
   * Initiate Form
  */
  initiateForm() {
    // By Default, it'll be set as enabled
    this.componentForm = this.initComponentForm();
    this.componentForm.patchValue({
      disable: false
    })
    this.componentList = [];
    this.filteredComponentList = [];
    // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
    this.serviceProviderID = (this.commonDataService.service_providerID).toString();
    this.userID = this.commonDataService.uid;

    // this.providerAdminRoleService.getStates(this.serviceProviderID)
    //   .subscribe(response => {
    //     this.states = this.successhandeler(response);

    //   }
    //   );
    this.getProviderServices();
    this.getIOTComponent();
  }
  getProviderServices() {
    this.stateandservices.getServices(this.userID)
      .subscribe(response => {
        this.services_array = response;
      }, err => {
      });
  }
  getStates(serviceID) {
    this.stateandservices.getStates(this.userID, serviceID, false).
      subscribe(response => this.getStatesSuccessHandeler(response, false), err => {
      });
  }
  getStatesSuccessHandeler(response, isNational) {
    if (response) {
      console.log(response, 'Provider States');
      this.provider_states = response;
      // this.createButton = false;
    }
  }

  initComponentForm(): FormGroup {
    return this.fb.group({
      testComponentID: null,
      testComponentName: [null, Validators.required],
      testComponentDesc: null,
      testLoincCode: null,
      testLoincComponent: null,
      isDecimal: null,
      inputType: null,
      range_max: null,
      range_min: null,
      range_normal_max: null,
      range_normal_min: null,
      measurementUnit: null,
      modifiedBy: null,
      createdBy: null,
      providerServiceMapID: null,
      compOpt: this.fb.array([
        this.initComp()
      ]),
      deleted: null,
      iotComponentID:null
    })
  }

  initComp(): FormGroup {
    return this.fb.group({
      name: null
    });
  }

  myErrorStateMatcher(control, form) {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.touched || isSubmitted));
  }
  get testComponentName() {
    return this.componentForm.controls['testComponentName'].value;
  }
  componentUnique() {
    this.alreadyExist = false;
    console.log("filteredComponentList", this.filteredComponentList);
    let count = 0;
    for (let a = 0; a < this.filteredComponentList.length; a++) {
      if (this.filteredComponentList[a].testComponentName === this.testComponentName) {
        count = count + 1;
        console.log("count", count);
        if (count > 0) {
          this.alreadyExist = true;
        }
      }
    }
  }

  addID(index) {
    console.log('index here', index)
    if (index == 1 && this.componentForm.value.inputType == 'RadioButton') {
      this.alertService.alert('We can not have more than 2 options for Radio Button, Choose \'Drop Down\' List Instead ');
    } else {
      const val = <FormArray>this.componentForm.controls['compOpt'];
      val.push(this.initComp());
    }
  }


  removeID(i) {
    const val = <FormArray>this.componentForm.controls['compOpt'];
    val.removeAt(i);
  }

  /**
   * Get Details of Procedures available for this Service PRovider
  */
  getAvailableComponent() {

    this.componentMasterServiceService.getCurrentComponents(this.providerServiceMapID)
      .subscribe((res) => {
        this.componentList = this.successhandeler(res); this.filteredComponentList = this.successhandeler(res);
        this.tableMode = true;
      });

  }

  allowDecimalChange() {
    const value = this.componentForm.value.isDecimal;
    console.log(value)
    if (value) {
      this.allowDecimal = 'decimal';
    } else {
      this.allowDecimal = 'number';
    }
    this.componentForm.patchValue({
      range_max: null,
      range_min: null,
      range_normal_max: null,
      range_normal_min: null,
      measurementUnit: null,
    })
  }

  selected() {
    console.log(this.componentForm.value)
    this.componentForm.patchValue({
      range_max: null,
      range_min: null,
      range_normal_max: null,
      range_normal_min: null,
      measurementUnit: null,
      isDecimal: false,
    })
    console.log(this.componentForm.value, 'eval')
    this.componentForm.setControl('compOpt', new FormArray([this.initComp()]))
  }


  back() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.showTable();
        this.alreadyExist = false;
        this.resetForm();
      }
    })
  }
  showTable() {
    this.tableMode = true;
    this.saveEditMode = false;
    this.disableSelection = false;
  }
  showForm() {
    this.tableMode = false;
    this.saveEditMode = true;
    this.disableSelection = true;

   
    
  }
  saveComponent() {

    if(this.enableAlert == true)
    {

      this.alertService.confirm('Confirm',"No LOINC Code selected for the component name, Do you want to proceed?").subscribe(response=>{
        if(response)
        {
          this.saveComponentDet();
        }
      }); 
      
    }
else{
   this.saveComponentDet();
  }
  }

  saveComponentDet()
  {
    const apiObject = this.objectManipulate();
    delete apiObject.modifiedBy;
     delete apiObject.deleted;
 
     console.log(JSON.stringify(apiObject, null, 4), 'apiObject');
     if (apiObject) {
       apiObject.createdBy = this.commonDataService.uname;
 
       this.componentMasterServiceService.postComponentData(apiObject)
         .subscribe((res) => {
           console.log(res, 'resonse here');
           this.componentList.unshift(res);
           this.resetForm();
           this.showTable();
           this.alertService.alert('Saved successfully', 'success');
           // this.showTable();
         })
 
     }
  }

  /**
   * Update Changes for The Component
  */

 updateComponent() {

  if(this.enableAlert == true)
  {

    this.alertService.confirm('Confirm',"No LOINC Code selected for the component name, Do you want to proceed?").subscribe(response=>{
      if(response)
      {
        this.updateComponentDet();
      }
    }); 
    
  }
else{
 this.updateComponentDet();
}
}

  updateComponentDet() {
    const apiObject = this.objectManipulate();
    delete apiObject.createdBy;

    console.log(apiObject, 'apiObject');
    if (apiObject) {
      apiObject['modifiedBy'] = this.commonDataService.uname;
      apiObject['testComponentID'] = this.editMode;

      this.componentMasterServiceService.updateComponentData(apiObject)
        .subscribe((res) => {
          console.log(res, 'resonse here');
          this.updateList(res);
          this.resetForm();
          this.alertService.alert('Updated successfully', 'success');
          this.showTable();
        })

    }
  }


  resetForm() {
  this.enableAlert=true;
  this.loincNo=null;
  // this.enableSave=true;
  // this.enableUpdate=false;
  this.componentFlag=false;
  this.componentForm.controls['testLoincCode'].enable();
  this.componentForm.controls['testLoincCode'].setValue(null);
  this.componentForm.controls['testLoincComponent'].setValue(null);
    
    this.componentForm.reset();
    this.editMode = false;
    this.componentForm.setControl('compOpt', new FormArray([this.initComp()]))
  }




  objectManipulate() {
    const obj = Object.assign({}, this.componentForm.value);
   
    obj.lionicNum=this.loincNo;
console.log(obj)
      obj.iotComponentID=this.componentForm.value.iotComponentID?this.componentForm.value.iotComponentID.iotComponentID:null;
    if (!obj.testComponentName || !obj.testComponentDesc || !obj.inputType) {
      this.alertService.alert('Please fill all mandatory details');
      return false
    } else {
      if (obj.inputType == 'TextBox') {
        if (!obj.range_max ||
          !obj.range_min ||

          !obj.range_normal_max ||
          !obj.range_normal_min ||
          !obj.measurementUnit) {
          this.alertService.alert('Please add all input limits');
          return false
        } else {
          // obj.isDecimal = parseInt(obj.isDecimal, 10);
          obj.compOpt = null;
          this.unfilled = false;
        }
      } else if (obj.inputType == 'DropDown' || obj.inputType == 'RadioButton') {

        if (obj.compOpt.length < 2) {
          this.alertService.alert('You need to add at least 2 options.');
          return false;

        } else if (obj.compOpt.length == 2 && obj.inputType == 'DropDown') {
          this.alertService.alert('You\'ve added only 2 options, please choose \'Radio Button\' as Input type.');
          return false;
        } else {
          let index = 0;
          obj.compOpt.forEach(element => {
            console.log(element, 'element here', element.name);
            if (!element.name || element.name == undefined || element.name == null || element.name == '') {
              index++;
            }
          });
          if (index) {
            this.alertService.alert('Please Fill details for all Component Properties.');
            return false;
          }
        }

      } else if (obj.inputType == 'FileUpload') {
        obj.compOpt = [{ 'name': "" }];
      }
      obj.providerServiceMapID = this.providerServiceMapID;
      return obj;
    }

  }



  setProviderServiceMapID() {
    this.commonDataService.provider_serviceMapID = this.searchStateID.providerServiceMapID;
    this.providerServiceMapID = this.searchStateID.providerServiceMapID;

    console.log('psmid', this.searchStateID.providerServiceMapID);
    //console.log(this.service);
    this.getAvailableComponent();
  }

  getServices(stateID) {
    console.log(this.serviceProviderID, stateID);
    this.providerAdminRoleService.getServices_filtered(this.serviceProviderID, stateID)
      .subscribe(response => this.servicesSuccesshandeler(response));
  }


  // For Service List
  servicesSuccesshandeler(response) {
    this.service = '';
    this.services = response;
    this.providerServiceMapID = null;

  }
  // For State List
  successhandeler(response) {
    return response;
  }


  filterComponentList(searchTerm?: string) {
    this.enableAlert=false;
    if (!searchTerm) {
      this.filteredComponentList = this.componentList;
    } else {
      this.filteredComponentList = [];
      this.componentList.forEach((item) => {
        for (let key in item) {
          if (key == 'testComponentName' || key == 'inputType') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredComponentList.push(item); break;
            }
          }
        }
      });
    }

  }


  /**
   *Enable/ Disable Component
   *
   */
  toggleComponent(componentID, index, toggle) {
    let text;
    if (!toggle)
      text = "Are you sure you want to Activate?";
    else
      text = "Are you sure you want to Deactivate?";
    this.alertService.confirm('Confirm', text).subscribe(response => {
      if (response) {
        console.log(componentID, index, 'index');
        this.componentMasterServiceService.toggleComponent({ componentID: componentID, deleted: toggle })
          .subscribe((res) => {
            console.log(res, 'changed');
            if (res) {
              if (!toggle)
                this.alertService.alert("Activated successfully", 'success');
              else
                this.alertService.alert("Deactivated successfully", 'success');
              this.updateList(res);
            }
          })
      }
    })

  }

  updateList(res) {
    this.componentList.forEach((element, i) => {
      console.log(element, 'elem', res, 'res')
      if (element.testComponentID == res.testComponentID) {
        this.componentList[i] = res;
      }
    });

    this.filteredComponentList.forEach((element, i) => {
      console.log(element, 'elem', res, 'res')
      if (element.testComponentID == res.testComponentID) {
        this.filteredComponentList[i] = res;
      }

    });

  }

  configComponent(item, i) {
    this.componentMasterServiceService.getCurrentComponentForEdit(item.testComponentID)
      .subscribe((res) => { this.loadDataToEdit(res) })
    console.log(JSON.stringify(item, null, 4), 'item to patch');
    console.log(this.componentForm, 'form here');

    
  }


  loadDataToEdit(res) {
    console.log(JSON.stringify(res, null, 4), 'res',res);
    if (res) {
      this.editMode = res.testComponentID;
      if(res.iotComponentID!=undefined){
        this.iotComponentArray.forEach(ele => {
          if(ele.iotComponentID==res.iotComponentID){
            res.iotComponentID=ele;
          }
        })
      }
      debugger;
      this.componentForm.patchValue(res);
     
      this.componentForm.controls['testLoincCode'].setValue(res.lionicNum);
      this.loincNo=res.lionicNum;
      this.componentForm.controls['testLoincComponent'].setValue(res.component);

      if(this.componentForm.controls['testLoincCode'].value == null || this.componentForm.controls['testLoincCode'].value == undefined || this.componentForm.controls['testLoincCode'].value == "")
      {
        // this.deleteFlag=false;
        this.componentForm.controls['testLoincCode'].enable();
        this.componentFlag=false;
        this.enableAlert=true;
      }
      else{
        this.componentForm.controls['testLoincCode'].disable();
        // this.deleteFlag=true;
        this.enableAlert=false;
        this.componentFlag=true;
      }
      
      // const val = res.isDecimal === true ? 1 : 0;
      // this.componentForm.patchValue({isDecimal: val});
      if (res.inputType != 'TextBox') {
        console.log('11111');
        const options = res.compOpt;
        const val = <FormArray>this.componentForm.controls['compOpt'];
        val.removeAt(0);
        // this.componentForm.setControl('compOpt', new FormArray([]))
        console.log(val);
        options.forEach((element) => {
          val.push(this.fb.group(element));
          console.log(val);
        })
      }
    }

  }
  get range_min() {
    return this.componentForm.controls['range_min'].value;
  }
  get range_max() {
    return this.componentForm.controls['range_max'].value;
  }
  get range_normal_min() {
    return this.componentForm.controls['range_normal_min'].value;
  }
  get range_normal_max() {
    return this.componentForm.controls['range_normal_max'].value;
  }
  /*
  * Minimum and maximum range validations
  */
  setMinRange() {
    if (this.range_max != undefined) {
      this.setMaxRange();
    } else if (this.range_normal_min != undefined) {
      this.setMinNormalRange();
    } else if (this.range_normal_max != undefined) {
      this.setMaxNormalRange();
    }
  }
  setMaxRange() {
    if (this.range_min == undefined && this.range_max != undefined) {
      this.alertService.alert("Please select the min range");
      this.componentForm.patchValue({
        range_max: null
      })
    } else if (this.range_min != undefined && this.range_max <= this.range_min) {
      this.alertService.alert("Please select the range greater than min range");
      this.componentForm.patchValue({
        range_max: null
      })
    } else if (this.range_normal_min != undefined) {
      this.setMinNormalRange();
    } else if (this.range_normal_min != undefined) {
      this.setMaxNormalRange();
    }

  }
  setMinNormalRange() {
    if (this.range_min == undefined && this.range_max == undefined) {
      this.alertService.alert("Please select min and max range");
      this.componentForm.patchValue({
        range_normal_min: null
      })
    }
    else if (this.range_min == undefined) {
      this.alertService.alert("Please select min range");
      this.componentForm.patchValue({
        range_normal_min: null
      })
    }
    else if (this.range_max == undefined) {
      this.alertService.alert("Please select max range");
      this.componentForm.patchValue({
        range_normal_min: null
      })
    }
    else if (this.range_min != undefined && this.range_normal_min <= this.range_min) {
      this.alertService.alert("Please select the range greater than min range");
      this.componentForm.patchValue({
        range_normal_min: null
      })
    }
    else if (this.range_max != undefined && this.range_normal_min >= this.range_max) {
      this.alertService.alert("Please select the range lesser than the max range");
      this.componentForm.patchValue({
        range_normal_min: null,
        range_max: null
      })
    } else if (this.range_normal_max != undefined) {
      this.setMaxNormalRange();
    }
  }
  setMaxNormalRange() {
    if (this.range_min == undefined && this.range_max == undefined && this.range_normal_min == undefined) {
      this.alertService.alert("Please select min, max and min normal range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
    else if (this.range_min != undefined && this.range_max == undefined && this.range_normal_min == undefined) {
      this.alertService.alert("Please select max and min normal range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
    else if (this.range_min == undefined) {
      this.alertService.alert("Please select min range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
    else if (this.range_max == undefined) {
      this.alertService.alert("Please select max range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
    else if (this.range_normal_min == undefined) {
      this.alertService.alert("Please select min normal range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
    else if (this.range_min != undefined && this.range_normal_max <= this.range_min && this.range_max == undefined && this.range_normal_min == undefined) {
      this.alertService.alert("Please select max and min normal range and also range should be greater than min range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
    else if (this.range_min != undefined && this.range_normal_max <= this.range_min) {
      this.alertService.alert("Please select the range greater than min range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
    else if (this.range_max != undefined && this.range_normal_max >= this.range_max) {
      this.alertService.alert("Please select the range lesser than the max range");
      this.componentForm.patchValue({
        range_normal_max: null,
        range_max: null
      })
    }
    else if (this.range_normal_min != undefined && this.range_normal_max <= this.range_normal_min) {
      this.alertService.alert("Please select the range greater than the min normal range");
      this.componentForm.patchValue({
        range_normal_max: null
      })
    }
  }


  getIOTComponent() {

    this.componentMasterServiceService.getIOTComponent().subscribe((res) => {
        this.iotComponentArray =res;
      });

  }

  mapInputType(value:any){
  console.log("value--------",value);
  this.selected();
  if(value!=null && value.inputType=="TextBox")
  {
    this.componentForm.patchValue({
      inputType:value.inputType,
      isDecimal:value.isDecimal,
      measurementUnit:value.componentUnit
    });
   
  }else if(value!=null && (value.inputType=="DropDown") || value.inputType=="RadioButton" ){
    this.componentForm.patchValue({
      inputType:value.inputType
    });
    this.callDropBinder(value);
  }
  
   
  
  
  }

  callDropBinder(vall:any){
    let call=[];
debugger;
    vall.options.forEach(element => {
      call.push({name:element});
    });

    vall["compOpt"]=call;
    
    
    
    console.log('11111');
    const options = vall.compOpt;
    const val = <FormArray>this.componentForm.controls['compOpt'];
    val.removeAt(0);
    // this.componentForm.setControl('compOpt', new FormArray([]))
    console.log(val);
    options.forEach((element) => {
      val.push(this.fb.group(element));
      console.log(val);
    })

  }

  searchComponents(term: string, pageNo): void {
     
    let searchTerm = term;
    if (searchTerm.length > 2) {
        let dialogRef = this.dialog.open(ComponentNameSearchComponent,
          {data: { searchTerm: searchTerm}});

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result)
            if (result) {
              this.componentForm.controls['testLoincCode'].setValue(result.componentNo);
              this.componentForm.controls['testLoincComponent'].setValue(result.component);
              this.loincNo=result.componentNo;
              this.componentFlag=true;
              // console.log("componentFlag",this.componentFlag)
              this.componentForm.controls['testLoincCode'].disable();
              // this.enableSave=false;
              // this.enableUpdate=false;
              this.enableAlert=false;
            
               
            }
            else
            {
              this.enableAlert=true;
              this.componentForm.controls['testLoincCode'].setValue(null);
              this.componentForm.controls['testLoincComponent'].setValue(null);
              // this.deleteFlag=true;
            }

        })
    }
}

onDeleteClick()
{

  this.alertService.confirm('Confirm',"Are you sure you want to delete?").subscribe(response=>{
    if(response)
    {
      this.enableAlert=true;
  // this.enableUpdate=true;
  this.loincNo=null;
  // this.enableSave=true;
  this.componentFlag=false;
  this.componentForm.controls['testLoincCode'].enable();
  this.componentForm.controls['testLoincCode'].setValue(null);
  this.componentForm.controls['testLoincComponent'].setValue(null);
  // this.deleteFlag=true;

    }
    
  }); 
  
 
}

// enableDelete(searchTerm){
//   console.log("searchTerm",searchTerm)
//   if(searchTerm)
//   {
//   this.deleteFlag=false;
//   }
//   else{
//     this.deleteFlag=true;
//   }
// }






  
}

