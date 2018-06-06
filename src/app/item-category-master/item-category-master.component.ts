import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdRadioChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ItemCategoryService } from '../services/inventory-services/item-category.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { EditItemCategoryComponent } from './edit-item-category/edit-item-category.component';
@Component({
  selector: 'app-item-category-master',
  templateUrl: './item-category-master.component.html',
  styleUrls: ['./item-category-master.component.css']
})
export class ItemCategoryMasterComponent implements OnInit {

  //   createdBy: any;
    uid: any;
    serviceProviderID: any;
    providerServiceMapID: any;
    services_array: any [];
    states_array: any[];
    showTableFlag: Boolean = false;
    itemsList = [];
    filteredItemList = [];
  //   mainstore_array:any[];
  //   substore_array:any[];
  //   item_array:any[];
  //   batch_array:any[];
  //   storeType=['Main Store','Sub Store'];
  //   create_currentDate:Date;
  //   facilityID:any;

  //   subStore:boolean =false;
  //   filteredOptions: Observable<string[]>;
  // selected:any;
  // mainStore:any;
  // create_referenceNumber:any;
  state: any;
  serviceline: any;

  //    fieldArray: Array<any> = [{}];
  //    newAttribute: any = {};

  @ViewChild('searchForm') searchForm: NgForm;

  constructor(public commonservice: CommonServices, public commonDataService: dataService,
  public dialogService: ConfirmationDialogsService, private itemCategoryService: ItemCategoryService, public dialog: MdDialog) { }

  ngOnInit() {
    // this.createdBy = this.commonDataService.uname;
    // console.log(this.createdBy, "CreatedBy");
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    // this.create_currentDate = new Date();
    // this.facilityID = 8;
    this.getServices();
  }
  // filterItem(val: string) {
  //   debugger;
  //   if (val) {
  //     const filterValue = val.toLowerCase();
  //     return this.item_array.filter(item => item.itemName.toLowerCase().startsWith(filterValue));
  //   }
  // }
  getServices() {
    // debugger;
    this.commonservice.getServiceLines(this.uid).subscribe(response => {
      if (response) {
        console.log('All services success', response);
        this.services_array = response;
        this.state = '';
        this.serviceline = '';
        this.providerServiceMapID = '';
      }
    })
  }
  getStates(service) {
    this.commonservice.getStatesOnServices(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
        this.state = '';
        this.providerServiceMapID = '';
      }
    })
  }
  setProviderServiceMapID(providerServiceMapID) {

    this.providerServiceMapID = providerServiceMapID;
    console.log(this.providerServiceMapID);
    console.log(this.state);
    console.log(this.serviceline);
    if (this.providerServiceMapID) {
    this.itemCategoryService.getAllItemCategory(this.providerServiceMapID).subscribe((res) => {
      if (res.statusCode == 200) {
        console.log(res.data);
        this.showTableFlag = true;
        this.itemsList = res.data;
        this.filteredItemList = res.data;

      }
    });
    }
  }
  filterItemFromList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredItemList = this.itemsList;
    }
    else {
      this.filteredItemList = [];
      this.itemsList.forEach((item) => {
        for (let key in item) {
          if(key=='itemCategoryCode' ||key=='itemCategoryName' || key =='itemCategoryDesc')
          {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredItemList.push(item); break;
          }
        }
        }
      });
    }

  }

  activateDeactivate(itemID, flag) {
    let confirmMessage
    if (flag) {
      confirmMessage = 'Deactivate';
    } else {
      confirmMessage = 'Activate';
    }
    this.dialogService.confirm('Confirm', 'Are you sure you want to ' + confirmMessage + '?').subscribe((res) => {
      // if (res) {
      //   console.log("Deactivating or activating Obj", itemID, flag);
      //   this.itemService.itemActivationDeactivation(itemID, flag)
      //     .subscribe((res) => {
      //       console.log('Activation or deactivation response', res);
      //       this.dialogService.alert(this.confirmMessage + "ed successfully", 'success');
      //       this.getAllItemsList(this.providerServiceMapID);
      //     }, (err) => this.dialogService.alert(err, 'error'))
      // }
    },
      (err) => {
        console.log(err);
      })
  }
  editItem(itemlist) {
       console.log("Existing Data", itemlist);
    const dialog_Ref = this.dialog.open(EditItemCategoryComponent, {
      height: '500px',
      width: '900px',
      disableClose: true,
      data: itemlist
    });
    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.dialogService.alert("Category edited successfully", 'success');
        // this.getAllItemsList(this.providerServiceMapID);
      }
    });

  }



}

