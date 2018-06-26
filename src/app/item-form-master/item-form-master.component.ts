import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import {ItemFormService} from '../services/inventory-services/item-form-service';
import { ItemService } from '../services/inventory-services/item.service';

@Component({
  selector: 'app-item-form-master',
  templateUrl: './item-form-master.component.html',
  styleUrls: ['./item-form-master.component.css']
})
export class ItemFormMasterComponent implements OnInit {

  createButton: boolean = false;

  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  itemformList: any = [];
  filteredItemFormList: any = [];
  itemFormID:any;
  services_array: any = [];
  states_array: any = [];
  bufferArray: any = [];
  state: any;
  edit_State: any;
  serviceline: any;
  edit_Serviceline: any;
  edit_itemFormName:any;
  edit_itemFormDesc:any;
  confirmMessage:any;
  edit_itemFormCode:any;
  availableItemFormCode:any;
  create_filterTerm:string;

  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  displayTable: boolean = false;
  @ViewChild('itemAddForm') itemAddForm: NgForm;
  constructor(public commonservice:CommonServices,public commonDataService: dataService, private itemService: ItemService,
    public dialogService: ConfirmationDialogsService,private itemFormservice:ItemFormService) { }

  ngOnInit() {
debugger;
    this.createdBy = this.commonDataService.uname;
    console.log(this.createdBy, "CreatedBy");
   this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid;
    this.getServices();
  }
  getServices() {
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
      }
    })
  }
  getAllItemForm(providerServiceMapID) {
    debugger
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.itemFormservice.getAllItemForm(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All stores services success', response);
        this.itemformList = response;
        this.filteredItemFormList = response;
        this.displayTable=true;
        for (let availableManufactureCode of this.itemformList) {
          this.availableItemFormCode.push(availableManufactureCode.itemFormCode);
        }
      }
    })
  }
  filterItemFormList(searchTerm?: string) {
    debugger;
    if (!searchTerm) {
      this.filteredItemFormList = this.itemformList;
    }
    else {
      this.filteredItemFormList = [];
      this.itemformList.forEach((item) => {
        for (let key in item) {
          if(key=="itemFormCode"||key=="itemForm"||key=="itemFormDesc")
          {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredItemFormList.push(item); break;
          }
         }
        }
      });
    }
  }
  showForm() {
    debugger;
    this.tableMode = false;
    this.formMode = true;
    this.editMode = false;
  }
  showEditForm() {
    debugger;
    this.tableMode = false;
    this.formMode = false;
    this.editMode = true;
  }
  removeRow(index) {
    this.bufferArray.splice(index, 1);
  }
  add2buffer(formvalues) {
    debugger;
    console.log("form values", formvalues);
    const obj = {
      "itemForm": formvalues.itemFormName,
      "itemFormDesc": formvalues.itemFormDesc,
      "itemFormCode":formvalues.itemFormCode,
      'providerServiceMapID':this.providerServiceMapID,
      'createdBy':this.createdBy
    }
    this.checkDuplictes(obj);
  }
  checkDuplictes(object) {
    console.log(object);
    let duplicateStatus = 0
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }
    else {
      debugger;
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].itemForm == object.itemForm ||
          this.bufferArray[i].itemFormCode == object.itemFormCode) {
          duplicateStatus = duplicateStatus + 1;

          this.dialogService.alert(`ItemForm is already added in list`);
        }
      }
      if (duplicateStatus === 0) {
        this.bufferArray.push(object);
      }
    }
  }
  saveItemForm() {
    debugger;
    console.log("object before saving the store", this.bufferArray);
    this.itemFormservice.saveItemForm(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of itemform');
        this.dialogService.alert('Saved successfully', 'success');
        this.showTable();
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  editItemForm(editformvalues)
  {
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.itemFormID=editformvalues.itemFormID
    this.edit_itemFormCode=editformvalues.itemFormCode;
    this.edit_itemFormDesc=editformvalues.itemFormDesc;
    this.edit_itemFormName=editformvalues.itemForm;
    this.showEditForm();
  }
  updateItemForm(editformvalues)
  {
    debugger;
    const editObj={
      "itemFormDesc": editformvalues.itemFormDesc,
      "modifiedBy": this.createdBy,
      "itemFormID":this.itemFormID
    }
    this.itemFormservice.updateItemForm(editObj).subscribe(response => {
      if (response) {
        this.showTable();
        console.log(response, 'after successful updation of Item Form');
        this.dialogService.alert('Updated successfully', 'success');

      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  showTable() {
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.displayTable=true;
      this.getAllItemForm(this.providerServiceMapID);
      this.create_filterTerm='';
  }
  activateDeactivate(itemFormID,flag) {
    debugger;
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.dialogService.confirm('Confirm', "Are you sure you want to "+ this.confirmMessage+"?").subscribe(response => {
      if (response) {
        const object = {
          "itemFormID": itemFormID,
          "deleted": flag
        };
        this.itemFormservice.deleteItemForm(object)
        .subscribe((res) => {
            this.dialogService.alert(this.confirmMessage + "d successfully", 'success');
            this.getAllItemForm(this.providerServiceMapID);
            this.create_filterTerm='';
        }, (err) => {
          console.log("error", err);
        });
      }
    });

  }
  ItemFormCodeExist:any=false;
  checkExistance(itemFormCode) {
    // this.ItemFormCodeExist = this.availableItemFormCode.includes(itemFormCode);
    // console.log(this.ItemFormCodeExist);
    this.itemService.confirmItemCodeUnique(itemFormCode, 'itemform', this.providerServiceMapID)
    .subscribe((res) => {
      if (res && res.statusCode == 200 && res.data) {
          console.log(res)
          console.log(res.data)
          console.log(res.data.response)
          // this.itemCodeExist = res.data.response;
           this.localCodeExists(itemFormCode, res.data.response)
      }
    })
  }

  localCodeExists(code, returned) {
    let duplicateStatus = 0
    if (this.bufferArray.length > 0) {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].itemFormCode === code
        ) {
          duplicateStatus = duplicateStatus + 1;
        }
    }
  }
  if (duplicateStatus > 0 || returned == 'true') {
    this.ItemFormCodeExist = true;
  } else {
    this.ItemFormCodeExist = false;
  }

  }
}
