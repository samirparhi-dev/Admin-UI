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

  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  services_array: any[];
  states_array: any[];
  showTableFlag: Boolean = false;
  showCreationForm: Boolean = false;
  codeExists: Boolean = false;
  itemsList = [];
  filteredItemList = [];


  //Creations

  itemCategoryCode = null;
  itemCategoryName = null;
  itemCategoryDesc = null;
  forCreationObjects = [];

  state: any;
  serviceline: any;


  @ViewChild('searchForm') searchForm: NgForm;

  @ViewChild('categoryCreationForm') categoryCreationForm: NgForm;

  constructor(public commonservice: CommonServices, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService, private itemCategoryService: ItemCategoryService, public dialog: MdDialog) { }

  ngOnInit() {
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.createdBy = this.commonDataService.uname;
    console.log('this.createdBy', this.createdBy);
    this.getServices();
  }
  getServices() {
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
    this.getAllItemCategories();
  }

  getAllItemCategories() {
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

  back() {
    this.showTableFlag = true;
    this.showCreationForm = false;
    this.getAllItemCategories();
  }
  saveCategory() {
    this.itemCategoryService.saveNewCategory(this.forCreationObjects)
    .subscribe(res => {
      if (res.statusCode == 200) {
        console.log(res);
        this.dialogService.alert('Category Created Successfully', 'success');
        this.categoryCreationForm.reset();
        this.forCreationObjects = [];
      }
    })


  }
  removeRow(index) {
    this.forCreationObjects.splice(index,1);
  }

  addForCreation() {
    this.forCreationObjects.push({
      serviceName: this.serviceline.serviceName,
      stateName: this.state.stateName,
      itemCategoryCode: this.itemCategoryCode,
      itemCategoryName: this.itemCategoryName,
      itemCategoryDesc: this.itemCategoryDesc,
      createdBy: this.createdBy,
      providerServiceMapID : this.providerServiceMapID
    })
    this.categoryCreationForm.reset();

  }

  filterItemFromList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredItemList = this.itemsList;
    } else {
      this.filteredItemList = [];
      this.itemsList.forEach((item) => {
        for (let key in item) {
          if (key == 'itemCategoryCode' || key == 'itemCategoryName' || key == 'itemCategoryDesc') {
            const value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredItemList.push(item); break;
            }
          }
        }
      });
    }

  }

  activateDeactivate(categoryID, flag) {
    let confirmMessage
    if (flag) {
      confirmMessage = 'Deactivate';
    } else {
      confirmMessage = 'Activate';
    }
    this.dialogService.confirm('Confirm', 'Are you sure you want to ' + confirmMessage + '?').subscribe((res) => {
      if (res) {
        console.log('Deactivating or activating Obj', categoryID, flag);
        this.itemCategoryService.categoryActivationDeactivation(categoryID, flag)
          .subscribe((result) => {
            if (result.statusCode == 200) {
              console.log('Activation or deactivation response', result);
              this.dialogService.alert(`${confirmMessage}d successfully`, 'success');
              this.getAllItemCategories();
            }
            // this.getAllItemsList(this.providerServiceMapID);
          }, (err) => this.dialogService.alert(err, 'error'))
      }
    },
      (err) => {
        console.log(err);
      })
  }
  editItem(itemlist) {
    console.log('Existing Data', itemlist);
    const dialog_Ref = this.dialog.open(EditItemCategoryComponent, {
      height: '400px',
      width: '900px',
      disableClose: true,
      data: {item: itemlist, providerServiceMapID: this.providerServiceMapID}
    });
    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === 'success') {
        this.dialogService.alert('Category edited successfully', 'success');
        this.getAllItemCategories();
      }
    });

  }

  showForm() {
    this.showTableFlag = false;
    this.showCreationForm = true;
  }

  checkCodeExistance(code) {
    console.log(code)
    let duplicate = 0;
    this.itemsList.forEach((cat, i) => {
      if (cat.itemCategoryCode == code) {
        this.codeExists = true;
        duplicate++;
      }
    })

    if (duplicate) {
      this.codeExists = true;
    } else {
      this.codeExists = false;
    }


  }



}

