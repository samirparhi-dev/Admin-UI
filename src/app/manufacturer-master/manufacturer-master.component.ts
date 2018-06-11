import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ManufacturemasterService } from '../services/inventory-services/manufacturemaster.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-manufacturer-master',
  templateUrl: './manufacturer-master.component.html',
  styleUrls: ['./manufacturer-master.component.css']
})
export class ManufacturerMasterComponent implements OnInit {
  createButton: boolean = false;

  createdBy: any;
  uid: any;
  serviceProviderID: any;
  providerServiceMapID: any;
  edit_manufactureName:any;
  edit_manufactureDesc:any;
  edit_contactPerson:any;
  edit_manufactureCode:any;
  edit_status:any;
  edit_cstNo:any;
  manufactureId:any;
  services_array: any = [];
  states_array: any = [];
  manufactureList: any = [];
  filteredManufactureList: any = [];
  availableManufactureCode: any = [];
  bufferArray: any = [];
  state: any;
  edit_State: any;
  serviceline: any;
  edit_Serviceline: any;

  formMode: boolean = false;
  tableMode: boolean = true;
  editMode: boolean = false;
  displayTable: boolean = false;
  @ViewChild('manufactureAddForm') manufactureAddForm: NgForm;
  
  constructor(public commonservice:CommonServices,public commonDataService: dataService,
    private manufactureService: ManufacturemasterService,public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
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
  getAllManufactures(providerServiceMapID) {
    debugger
    this.createButton = true;
    this.providerServiceMapID = providerServiceMapID;
    this.manufactureService.getAllManufacture(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All stores services success', response);
        this.manufactureList = response;
        this.filteredManufactureList = response;
        this.displayTable=true;
        for (let availableManufactureCode of this.manufactureList) {
          this.availableManufactureCode.push(availableManufactureCode.manufactureCode);
        }
      }
    })
  }
  filterManufactureList(searchTerm?: string) {
    debugger;
    if (!searchTerm) {
      this.filteredManufactureList = this.manufactureList;
    }
    else {
      this.filteredManufactureList = [];
      this.manufactureList.forEach((item) => {
        for (let key in item) {
          if(key=="manufacturerCode" || key=="manufacturerName" ||key =="manufacturerDesc")
          {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredManufactureList.push(item); break;
          }
        }
        }
      });
    }

  }
  add2buffer(formvalues) {
    debugger;
    console.log("form values", formvalues);
    const obj = {
      "manufacturerCode": formvalues.manufactureCode,
      "manufacturerName": formvalues.manufactureName,
      "manufacturerDesc": formvalues.manufactureDesc,
      "contactPerson": formvalues.contactPerson,
      "status":formvalues.status1,
      "cST_GST_No": formvalues.cstNo,
      'providerServiceMapID':this.providerServiceMapID,
      'createdBy':this.createdBy
    }
    this.checkDuplictes(obj);
  }
  checkDuplictes(object) {
    debugger;
    let duplicateStatus = 0
    if (this.bufferArray.length === 0) {
      this.bufferArray.push(object);
    }
    else {
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].manufacturerCode == object.manufacturerCode &&
          this.bufferArray[i].manufacturerName == object.manufacturerName
        ) {
          duplicateStatus = duplicateStatus + 1;
          this.dialogService.alert("Manufacturer is already added in list");
        }
      }
      if (duplicateStatus === 0) {
        this.bufferArray.push(object);
      }
    }
  }
  editManufacture(editformvalues)
  {
    debugger;
    this.edit_Serviceline = this.serviceline;
    this.edit_State = this.state;
    this.manufactureId=editformvalues.manufacturerID;
  this.edit_manufactureCode=editformvalues.manufacturerCode;
  this.edit_manufactureName=editformvalues.manufacturerName;
  this.edit_manufactureDesc=editformvalues.manufacturerDesc;
  this.edit_contactPerson=editformvalues.contactPerson;
  this.edit_status=editformvalues.status;
  this.edit_cstNo=editformvalues.cST_GST_No;
  this.showEditForm();
  }
  updatemanufactre(editformvalues)
  {
    debugger;
    const editObj={
      "manufacturerDesc": editformvalues.manufactureDesc,
      "ModifiedBy": this.createdBy,
      "manufacturerID":this.manufactureId
    }
    this.manufactureService.updateManufacture(editObj).subscribe(response => {
      if (response) {
        this.showTable();
        console.log(response, 'after successful updation of manufacure');
        this.dialogService.alert('Updated successfully', 'success');
        
      }
    }, err => {
      console.log(err, 'ERROR');
    })
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
  activate(manufacturerID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
      if (response) {
        const object = {
          "manufacturerID": manufacturerID,
          "deleted": false

        };

        this.manufactureService.deleteManufacture(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Activated successfully', 'success');
              this.getAllManufactures(this.providerServiceMapID);
            }
          },
            err => {
              console.log('error', err);
            });
      }
    });

  }
  deactivate(manufacturerID) {
    this.dialogService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
      if (response) {
        const object = {
          "manufacturerID": manufacturerID,
          "deleted": true
        };

        this.manufactureService.deleteManufacture(object)
          .subscribe(response => {
            if (response) {
              this.dialogService.alert('Deactivated successfully', 'success');
              this.getAllManufactures(this.providerServiceMapID);
            }
          },
            err => {
              console.log('error', err);
            });
      }
    });

  }
  showTable() {
    if(!this.editMode)
    {
      this.manufactureAddForm.reset();
    }
      this.tableMode = true;
      this.formMode = false;
      this.editMode = false;
      this.bufferArray = [];
      this.displayTable=true;
      
      this.getAllManufactures(this.providerServiceMapID);
    }
  saveManufacture() {
    debugger;
    console.log("object before saving the store", this.bufferArray);
    this.manufactureService.saveManufacture(this.bufferArray).subscribe(response => {
      if (response) {
        console.log(response, 'after successful creation of store');
        this.dialogService.alert('Saved successfully', 'success');
        this.showTable();
      }
    }, err => {
      console.log(err, 'ERROR');
    })
  }
  ManufactureCodeExist: any = false;
  checkExistance(manufactureCode) {
    this.ManufactureCodeExist = this.availableManufactureCode.includes(manufactureCode);
    console.log(this.ManufactureCodeExist);
  }

}
