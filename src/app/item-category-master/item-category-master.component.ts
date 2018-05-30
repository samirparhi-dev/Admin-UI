import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { PhysicalstockService } from '../services/inventory-services/physicalstock.service';
import { MdRadioChange } from '@angular/material';
import {Observable} from 'rxjs';
import { NgForm } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-item-category-master',
  templateUrl: './item-category-master.component.html',
  styleUrls: ['./item-category-master.component.css']
})
export class ItemCategoryMasterComponent implements OnInit {

  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  services_array:any [];
  states_array:any[];
  mainstore_array:any[];
  substore_array:any[];
  item_array:any[];
  batch_array:any[];
  storeType=['Main Store','Sub Store'];
  create_currentDate:Date;
  facilityID:any;

  subStore:boolean =false;
  filteredOptions: Observable<string[]>;


  private fieldArray: Array<any> = [{}];
  private newAttribute: any = {};

  @ViewChild('stockAddForm') stockAddForm: NgForm;

  constructor(public commonservice:CommonServices,public commonDataService: dataService,
    private physicalStockService: PhysicalstockService,public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    console.log(this.createdBy, "CreatedBy");
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.create_currentDate = new Date();
    this.facilityID=8;
    this.getServices();
    }
  filterItem(val: string) {
    debugger;
    if (val) {
        const filterValue = val.toLowerCase();
         return this.item_array.filter(item => item.itemName.toLowerCase().startsWith(filterValue));
    }
  }
  getServices() {
    debugger;
    this.commonservice.getServiceLines(this.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
      }
    })
  }
  getstates(service) {
    debugger;
    this.commonservice.getStatesOnServices(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
        this.providerServiceMapID=this.states_array[0].providerServiceMapID;
      }
    })
  }

  getMainStore()
  {
    
    debugger;
    var obj = {
      "isMainFacility":"True",
      "providerServiceMapID":this.providerServiceMapID
    }
    this.physicalStockService.getMainStore(obj).subscribe(response => {
      if (response) {
        console.log('All Mainstore success', response);
        this.mainstore_array = response;
      }
    })
  }
  getsubstore(mainstore){
    debugger;
    var obj = {
      "isMainFacility":"False",
      "providerServiceMapID":this.providerServiceMapID,
      "mainFacilityID":mainstore.facilityID
    }
    this.physicalStockService.getSubStore(obj).subscribe(response => {
      if (response) {
        console.log('All Substore success', response);
        this.substore_array = response;
      }
    })
    this.getItem();
  }
  getItem(){
    var obj = {
      "providerServiceMapID":this.providerServiceMapID,
      "facilityID":9
    }
    this.physicalStockService.getItem(obj).subscribe(response => {
      if (response) {
        console.log('All Item success', response);
        this.item_array = response;
      }
    })
  }
  saveItems(stockAddForm,fieldArray){
    debugger;
    if(fieldArray)
    {
      console.log(fieldArray);
    }
    var itemstockarray=[];
    for (var i = 0; i < fieldArray.length; i++) {
      if(fieldArray[i])
      var tempObj={
        "batchNo":fieldArray[i].batchno,
        "createdBy": this.createdBy,
        "expiryDate":fieldArray[i].expdate ,
        "facilityID":this.facilityID,
        "itemID": fieldArray[i].itemname.itemID,
        "quantity": fieldArray[i].qty
      }
      itemstockarray.push(tempObj);
    }
    var obj= {
      "createdBy": this.createdBy,
      "facilityID":this.facilityID,
      "itemStockEntry":itemstockarray,
      "providerServiceMapID": this.providerServiceMapID,
      "refNo": stockAddForm.referenceNumber,
      "status": "Active"
    }
    this.physicalStockService.savePhysicalStock(obj).subscribe(response => {
      if (response) {
        console.log('All stock entry success', response);
        this.item_array = response;
        this.dialogService.alert('Saved successfully', 'success');
        this.reset();
      }
    })
  }
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  storeTypeselect(selec){
    debugger;
    this.getMainStore();
    this.substore_array=[];

  }
  displayFn(item?: any): string | undefined {
    return item ? item.itemName : undefined;
  }
  addFieldValue() {
    debugger;
    this.fieldArray.push({})
  }

deleteFieldValue(index) {
  debugger;
    this.fieldArray.splice(index, 1);
   
}
reset(){
  debugger;
//  this.stockAddForm.resetForm();
  this.mainstore_array=[];
  this.substore_array=[];
  this.item_array=[];
  this.states_array=[];
   this.fieldArray=[];
  this.fieldArray.push({});
  //this.fieldArray.splice(0,this.fieldArray.length-1);
  debugger;

}

}
