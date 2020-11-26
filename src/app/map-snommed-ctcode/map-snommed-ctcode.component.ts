import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ItemService } from '../services/inventory-services/item.service';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { SnomedCodeSearchComponent } from 'app/snomed-code-search/snomed-code-search.component';
import { SnomedMasterService } from 'app/services/ProviderAdminServices/snomed-master.service';


@Component({
  selector: 'app-map-snommed-ctcode',
  templateUrl: './map-snommed-ctcode.component.html',
  styleUrls: ['./map-snommed-ctcode.component.css']
})
export class MapSnommedCTCodeComponent implements OnInit {
  providerServiceMapID: any;
  providerID: any;
  userID: any;
  state: any;
  service: any;
  bool: any;
  discontinue: boolean;
  createdBy: any;
  confirmMessage: any;
  discontinueMessage: any;
  itemCodeExist: any;
  editMode: boolean = false;
  showTableFlag: boolean = false;
  showFormFlag: boolean = false;
  disableSelection: boolean = false;
  tableMode: boolean = true;
  create_filterTerm: string;
  readFlag: boolean = false;
  editflag: boolean = true;
  updateFlag: boolean = true;
  /*Arrays*/
  services: any = [];
  states: any = [];
  itemsList = [];
  filteredItemList = [];
  categories: any = [];
  edit_categories: any = [];
  dosages: any = [];
  edit_dosages: any = [];
  pharmacologies: any = [];
  edit_pharmacologies: any = [];
  manufacturers: any = [];
  edit_Manufacturerlist: any = [];
  measures: any = [];
  edit_measures: any = [];
  routes: any = [];
  edit_routes: any = [];
  itemArrayObj: any = [];
  availableItemCodeInList: any = [];
  edit_serviceline: any;
  edit_state: any;
  edit_ItemType: any;
  edit_Code: any;
  editMasterName: any;
  edit_Category: any;
  edit_Dose: any;
  edit_Pharmacology: any;
  edit_Manufacturer: any;
  edit_Strength: any;
  edit_Uom: any;
  edit_DrugType: any;
  edit_Composition: any;
  edit_Route: any;
  edit_Description: any;
  itemID: any;
  drugType = false;
  masterTypes=["Immunization","Optional Vaccination","Family History"];
  masterType: any;
  masterNames=[];
  showSearch=false;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('itemCreationForm') itemCreationForm: NgForm;

  editDrug: string;
  testsnomedCode: any;
  snomedFlag: boolean=false;
  enableAlert: boolean=true;
  testSnomedName: any;
  editSnomedCode: any;
  editSnomedName: any;
  snomedEditFlag: boolean=true;
  disableSnomedCode: boolean=false;
  masterID: any;
  masterName: any;
  categoryWiseList: any;
  allItems: any;
  constructor(public commonDataService: dataService,
    public itemService: ItemService,
    public commonServices: CommonServices,
    public dialogService: ConfirmationDialogsService,
    public dialog: MdDialog,
    public sctService: SnomedMasterService) {
    this.providerID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    console.log("this.createdBy", this.createdBy);
  }

  fetchWorklist(type: any){
    this.masterType=type;
    console.log('catType', this.masterType);
    this.showSearch=true;
    this.showTableFlag = true;
    this.getAllItemsList(type);
  }
   
  getAllItemsList(type) {
    this.itemsSuccessHandler(type);
    this.sctService.getMasterList(type).subscribe((itemListResponse) =>
      this.itemsSuccessHandler(itemListResponse),
      (err) => { console.log("Error Master Name not found", err) });
  }
  itemsSuccessHandler(itemListResponse) {   
    console.log("All items", itemListResponse);
    this.allItems=itemListResponse.data;//for use in add mapping
    this.itemsList = itemListResponse.data;    
    console.log("values",this.itemsList);
    if(this.itemsList!=undefined){
    this.itemsList = this.itemsList.filter(
      master => master.sctCode != null
    );
    }
    this.filteredItemList = this.itemsList;
    console.log("liist",this.filteredItemList);
    this.showTableFlag = true;
  }
  showForm() {
    this.tableMode = false;
    this.showTableFlag = false;
    this.showFormFlag = true;
    this.readFlag= false;
    this.snomedFlag=false
    this.categoryWiseList = this.allItems;
    this.masterNames=this.categoryWiseList.filter(
      master => master.sctCode == null
    );
  }
  filterItemFromList(searchTerm?: any) {
    // debugger;
    if (!searchTerm) {
      this.filteredItemList = this.itemsList;
    }
    else {
      this.filteredItemList = [];
      this.itemsList.forEach((item) => {
        for (let key in item) {
          if (key == 'sctTerm' || key=='masterName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredItemList.push(item); break;
            }
          }
          else if (key == 'sctCode') {
            let value: any = '' + item[key];
            if (value.indexOf(searchTerm) >= 0) {
              this.filteredItemList.push(item); break;
            }
          }
        }
      });
    }

  }

  resetAllForms() {
    this.searchForm.resetForm();
    this.itemCreationForm.resetForm();
  }
  resetItemCreationForm() {
    this.itemCreationForm.controls.masterName.reset();
    this.testsnomedCode=null;
    this.testSnomedName=null;
    this.enableAlert=true;
    this.snomedFlag=false;
    this.readFlag=false;
    this.snomedFlag=false;
  }
  
  showTable() {
    this.showTableFlag = true;
    this.showFormFlag = false;
    this.tableMode = true;
    this.editMode = false;
  }

  addMultipleItemArray(formValue) {
    if(this.enableAlert == true)
    {
      this.dialogService.confirm('Confirm',"No SNOMED CT Code selected for the Master, Do you want to proceed?").subscribe(response=>{
        if(response)
        {
          this.testsnomedCode=null;
         this.testSnomedName=null;
          console.log("formValue", formValue);
    const multipleItem = {
      "masterID":formValue.masterName.masterID,
      "masterName":formValue.masterName.masterName,
      "sctCode":this.testsnomedCode,
      "sctTerm":this.testSnomedName,
      "createdBy":this.createdBy,
      "deleted":false,
      "processed":"N"
    }
    console.log('multipleItem', multipleItem);
    this.checkDuplicates(multipleItem);
    this.resetItemCreationForm();
        }
      }); 
      
    }
    else
    {  
    console.log("formValue", formValue);
    const multipleItem = {
      "masterID":formValue.masterName.masterID,
      "masterName":formValue.masterName.masterName,
      "sctCode":this.testsnomedCode,
      "sctTerm":this.testSnomedName,
      "createdBy":this.createdBy,
      "deleted":false,
      "processed":"N"
    }
    console.log('multipleItem', multipleItem);
    this.checkDuplicates(multipleItem);
    this.resetItemCreationForm();
  }
}

checkDuplicates(multipleItem) {
  let duplicateStatus = 0
  if (this.itemArrayObj.length === 0) {
    this.itemArrayObj.push(multipleItem);
  }
  else {
    for (let i = 0; i < this.itemArrayObj.length; i++) {
      if (this.itemArrayObj[i].masterID === multipleItem.masterID
      ) {
        duplicateStatus = duplicateStatus + 1;
      }
    }
    if (duplicateStatus === 0) {
      this.itemArrayObj.push(multipleItem);
    }
  }
}
removeRow(index) {
  this.itemArrayObj.splice(index, 1);
}
  saveItem() {
  const saveObj={
    "masterType":this.masterType,
    "mappingDetails":this.itemArrayObj
  }
    this.sctService.saveSctMapping(saveObj).subscribe(response => {
      if (response) {
        console.log(response, 'item created');
        this.resetItemCreationForm();
        this.itemArrayObj = [];
        this.dialogService.alert('Saved Successfully', 'success');
        this.showTable();
        this.getAllItemsList(this.masterType);
      }
    }, err => {
      console.log(err, 'ERROR');
    })
}
  back() {
    this.dialogService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.itemArrayObj = [];
        this.tableMode = true;
        this.editMode = false;
        this.showTableFlag = true;
        this.showFormFlag = false;
        //this.disableSelection = false;
        this.readFlag= false;
        this.snomedFlag=false;
        this.editflag=true;
        this.snomedEditFlag=true;
        this.updateFlag=true;
        this.getAllItemsList(this.providerServiceMapID);
        this.create_filterTerm = '';
      }
    })
  }

  editItem(itemlist) {
    
    console.log("Existing Data", itemlist);
    this.masterID = itemlist.masterID;
    this.edit_serviceline = this.service;
    this.edit_Code = itemlist.itemCode;
    this.editMasterName = itemlist.masterName;
    this.editSnomedCode= itemlist.sctCode;
    this.editSnomedName= itemlist.sctTerm;
    if(itemlist.sctCode == null || itemlist.sctCode == undefined || itemlist.sctCode == "")
    {
      this.snomedEditFlag=true;
      this.enableAlert=true;
    }
    else{
      this.enableAlert=false;
      this.editflag=true;
      this.snomedEditFlag=false;
    }

    this.edit_Category = itemlist.itemCategoryID;
    this.showEditForm();
  }
  showEditForm() {
    debugger;
    this.tableMode = false;
    this.showFormFlag = false;
    this.editMode = true;
  }
  onDeleteClickEdit()
  {  
   this.dialogService.confirm('Confirm',"Are you sure you want to delete?").subscribe(response=>{
     if(response)
     {
       this.enableAlert=true;  
       this.editSnomedCode=null;
       this.editSnomedName=null; 
       this.editflag=false;
       this.snomedEditFlag=true;
       this.updateFlag=false;
     }     
   }); 

  }
updateItem(editItemCreationForm)
{
  if(this.enableAlert == true)
  {

    this.dialogService.confirm('Confirm',"No SNOMED CT Code selected for the Master, Do you want to proceed?").subscribe(response=>{
      if(response)
      {
        this.editSnomedCode=null;
        this.editSnomedName=null;
        this.update(editItemCreationForm);
      }
    }); 
    
  }
else{
  this.update(editItemCreationForm);
}
}
  update(item) {
    // debugger;
    let updateItemObject = {
      "masterType":this.masterType,
      "masterID":this.masterID,
      "masterName":this.editMasterName,
      "sctCode": this.editSnomedCode,
      "sctTerm":this.editSnomedName,
      "modifiedBy": this.createdBy  
    }
    this.sctService.editSctMapping(updateItemObject).subscribe(response => {
      this.dialogService.alert('Updated successfully', 'success');
      this.snomedEditFlag=false;
      //this.disableSnomedCode=false;
      this.enableAlert=true;
      this.getAllItemsList(this.masterType);
      this.showTable();
      console.log("Data to be update", response);
    })
  }

  searchSnomedEdit(term){
    console.log("Tern",term)
   let searchTerm = term;
   if (searchTerm.length > 2) {
       let dialogRef = this.dialog.open(SnomedCodeSearchComponent,
         {data: { searchTerm: searchTerm}});

       dialogRef.afterClosed().subscribe(result => {
           console.log('result', result)
           if (result) {
             this.editSnomedCode=result.snomedNo;
             this.editSnomedName=result.snomedTerm;
             this.enableAlert=false;          
              this.editflag=true;
              this.snomedEditFlag=false;
           }
           else
           {
             this.enableAlert=true;
             this.editSnomedCode=null;
             this.editSnomedName=null;
             this.editflag=false;
             this.snomedEditFlag=true;
           }

       })
   }
}


  activateDeactivate(item, flag) {
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    const status={
      "masterType": this.masterType,
      "masterID": item.masterID,
      "deleted": flag,
      "modifiedBy": this.createdBy 
    }
    this.dialogService.confirm('Confirm', "Are you sure you want to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        this.sctService.updateBlock(status)
          .subscribe((res) => {
            console.log('Activation or deactivation response', res);
            this.dialogService.alert(this.confirmMessage + "ed successfully", 'success');
            this.getAllItemsList(this.masterType);
            this.create_filterTerm = '';
          }, (err) => this.dialogService.alert(err, 'error'))
      }
    },
      (err) => {
        console.log(err);
      })
  }

  searchSnomed(term: string): void {
     
    let searchTerm = term;
    if (searchTerm.length > 2) {
        let dialogRef = this.dialog.open(SnomedCodeSearchComponent,
          {data: { searchTerm: searchTerm}});

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result)
            if (result) {
              this.testsnomedCode=result.snomedNo;
              this.testSnomedName=result.snomedTerm;           
              this.snomedFlag=true;                       
              this.enableAlert=false;  
              this.readFlag=true;
              this.snomedFlag=true; 
            }
            else
            {
              this.enableAlert=true;
              this.testsnomedCode=null;
              this.testSnomedName=null;   
              this.readFlag=false;  
              this.snomedFlag=false;
            }

         })
    }
}


onDeleteClick()
{

  this.dialogService.confirm('Confirm',"Are you sure you want to delete?").subscribe(response=>{
    if(response)
    {
      this.enableAlert=true;
      this.snomedFlag=false;
      this.testsnomedCode=null;
      this.testSnomedName=null;
      this.readFlag=false;
      this.snomedFlag=false;
    }
    
  }); 
  
 
}

}

