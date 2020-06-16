import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ItemService } from '../services/inventory-services/item.service';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {

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
  
  /*Arrays*/
  services: any = [];
  states: any = [];
  itemsList: any = [];
  filteredItemList: any = [];
  categories: any = [];
  edit_categories: any = [];
  discontinueresult: any = [];
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
  edit_Name: any;
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
  drugTypeList: any=["Non-EDL","EDL"];
  drugType = false;
  drugName: any="Non-EDL";
  isEDL :boolean=false;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('itemCreationForm') itemCreationForm: NgForm;
  EDL: any=[];
  editDrug: string;
  constructor(public commonDataService: dataService,
    public itemService: ItemService,
    public commonServices: CommonServices,
    public dialogService: ConfirmationDialogsService,
    public dialog: MdDialog) {
    this.providerID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    debugger;
    this.createdBy = this.commonDataService.uname;
    console.log("this.createdBy", this.createdBy);

    this.userID = this.commonDataService.uid;
    console.log('userID', this.userID);
    this.getAllServices();

  }
  getAllServices() {
    debugger;
    this.commonServices.getServiceLines(this.userID).subscribe((response) => {
      console.log("serviceline", response);
      this.servicesSuccesshandler(response),
        (err) => console.log("ERROR in fetching serviceline")
    });
  }
  servicesSuccesshandler(res) {
    this.services = res;
    // this.services = res.filter((item) => {
    //   console.log('item', item);
    // })
  }
  drugTypeChange(item)
  {
     if(item=="EDL")
     this.isEDL=true;
     else
     this.isEDL=false;
  }
  setProviderServiceMapID(providerServiceMapID) {
    console.log("providerServiceMapID", providerServiceMapID);
    this.providerServiceMapID = providerServiceMapID;
    console.log('psmid', this.providerServiceMapID);
    this.getAllItemsList(providerServiceMapID);
    this.getCategoriesList(this.providerServiceMapID);
    this.getDosageList(this.providerServiceMapID);
    this.pharmacologiesList(this.providerServiceMapID);
    this.manufacturerList(this.providerServiceMapID);
    this.unitOfMeasuresList(this.providerServiceMapID);
    this.routeAdminList(this.providerServiceMapID);
  }

  getStates(service) {
    debugger;
    console.log("value", service);
    this.commonServices.getStatesOnServices(this.userID, service.serviceID, false).
      subscribe(response => this.getStatesSuccessHandeler(response, service), (err) => {
        console.log("error in fetching states")
      });


  }
  getStatesSuccessHandeler(response, service) {
    this.states = response;
  }

  getAllItemsList(providerServiceMapID) {
    console.log("providerServicemapID", this.providerServiceMapID);

    this.itemService.getAllItems(this.providerServiceMapID).subscribe((itemListResponse) =>
      this.itemsSuccessHandler(itemListResponse),
      (err) => { console.log("Error Items not found", err) });

  }

  itemsSuccessHandler(itemListResponse) {
    
    console.log("All items", itemListResponse);
    this.itemsList = itemListResponse;
    this.filteredItemList = itemListResponse;
    this.showTableFlag = true;
    //this.disableEDL=true;
    for (let availableItemCode of this.itemsList) {
      console.log("edl");
      console.log(availableItemCode);
      this.availableItemCodeInList.push(availableItemCode.itemCode);
      if(availableItemCode.isEDL ==true)
      this.EDL.push("yes")
      else
      this.EDL.push("No")
    }
  }
  showForm() {
    this.tableMode = false;
    this.showTableFlag = false;
    this.showFormFlag = true;
    this.disableSelection = true;
  }
  filterItemFromList(searchTerm?: string) {
    debugger;
    if (!searchTerm) {
      this.filteredItemList = this.itemsList;
    }
    else {
      this.filteredItemList = [];
      this.itemsList.forEach((item) => {
        for (let key in item) {
          if (key == 'itemCode' || key == 'itemName' ) {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredItemList.push(item); break;
            }
          }
          else if(key=="itemCategory")
          {
            let value: string = '' + item[key]["itemCategoryName"];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredItemList.push(item); break;
            }
          }
        }
      });
    }

  }

  setDiscontinue(itemID, discontinue) {
    debugger;
    if (discontinue) {
      this.discontinueMessage = 'Item discontinued';
    } else {
      this.discontinueMessage = 'Item continued';
    }
    this.itemService.setDiscontinue(itemID, discontinue).subscribe((discontinueResponse) => {
      this.discontinueSuccesshandler(discontinueResponse, this.discontinueMessage),
        (err) => console.log("ERROR in setDiscontinue")
    });
    console.log("value", discontinue, itemID);

  }
  discontinueSuccesshandler(discontinueResponse, discontinueMessage) {
    this.discontinueresult = discontinueResponse
    this.create_filterTerm = '';
    this.dialogService.alert(discontinueMessage, 'success');
    console.log("discontinue List", this.discontinueresult);
  }
  checkCodeExistance(code) {
    // console.log(code);
    // this.itemCodeExist = this.availableItemCodeInList.includes(code);
    this.itemService.confirmItemCodeUnique(code, 'itemmaster', this.providerServiceMapID)
      .subscribe((res) => {
        if (res && res.statusCode == 200 && res.data) {
          console.log(res)
          console.log(res.data)
          console.log(res.data.response)
          // this.itemCodeExist = res.data.response;
          this.localCodeExists(code, res.data.response)
        }
      })
  }

  localCodeExists(code, returned) {
    let duplicateStatus = 0
    if (this.itemArrayObj.length > 0) {
      for (let i = 0; i < this.itemArrayObj.length; i++) {
        if (this.itemArrayObj[i].itemCode === code
        ) {
          duplicateStatus = duplicateStatus + 1;
        }
      }
    }
    if (duplicateStatus > 0 || returned == 'true') {
      this.itemCodeExist = true;
    } else {
      this.itemCodeExist = false;
    }

  }
  getCategoriesList(providerServiceMapID) {
    this.itemService.getAllItemsCategory(this.providerServiceMapID, 0).subscribe((categoryResponse) => {
      this.categoriesSuccesshandler(categoryResponse),
        (err) => console.log("ERROR in fetching category list")
    });
  }
  categoriesSuccesshandler(categoryResponse) {
    this.edit_categories = categoryResponse;
    this.categories = categoryResponse.filter(
      category => category.deleted != true
    );
    console.log("categories List", this.categories);
  }
  getDosageList(providerServiceMapID) {
    this.itemService.getAllDosages(this.providerServiceMapID).subscribe((dosageResponse) => {
      this.dosageSuccesshandler(dosageResponse),
        (err) => console.log("ERROR in fetching dosage list")
    });
  }
  dosageSuccesshandler(dosageResponse) {
    this.edit_dosages = dosageResponse;
    this.dosages = dosageResponse.filter(
      dose => dose.deleted != true
    );
    console.log("dosage list", this.dosages);
  }
  pharmacologiesList(providerServiceMapID) {
    console.log('check inside pharma');

    this.itemService.getAllPharmacologyCategory(this.providerServiceMapID).subscribe((pharmacologyResponse) => {
      console.log("pharmacologyResponse", pharmacologyResponse);

      this.pharmacologySuccesshandler(pharmacologyResponse),
        (err) => console.log("ERROR in fetching pharmacological list")
    });
  }
  pharmacologySuccesshandler(pharmacologyResponse) {
    debugger;
    this.edit_pharmacologies = pharmacologyResponse;
    this.pharmacologies = pharmacologyResponse.filter(
      pharmacology => pharmacology.deleted != true
    );
    console.log("pharmacology", this.pharmacologies);
  }
  manufacturerList(providerServiceMapID) {
    console.log('check inside manufacturer');

    this.itemService.getAllManufacturers(this.providerServiceMapID).subscribe((manufacturerResponse) => {
      console.log("manufacturerResponse", manufacturerResponse);

      this.manufacturerSuccesshandler(manufacturerResponse),
        (err) => console.log("ERROR in fetching manufacturer list")
    });
  }
  manufacturerSuccesshandler(manufacturerResponse) {
    this.edit_Manufacturerlist = manufacturerResponse;
    this.manufacturers = manufacturerResponse.filter(
      manufacture => manufacture.deleted != true
    );
    console.log("manufacturers", this.manufacturers);
  }
  unitOfMeasuresList(providerServiceMapID) {
    debugger;
    console.log('check inside Uom');
    this.itemService.getAllUoms(this.providerServiceMapID).subscribe((uomResponse) => {
      console.log("uomResponse", uomResponse);

      this.uomSuccesshandler(uomResponse),
        (err) => console.log("ERROR in fetching Uom list")
    });
  }
  uomSuccesshandler(uomResponse) {
    this.edit_measures = uomResponse;
    this.measures = uomResponse.filter(
      uom => uom.deleted != true
    );
    console.log("measures", this.measures);
  }
  routeAdminList(providerServiceMapID) {
    console.log('check inside route');
    this.itemService.getAllRoutes(this.providerServiceMapID).subscribe((routeResponse) => {
      console.log("routeResponse", routeResponse);
      this.routeSuccesshandler(routeResponse),
        (err) => console.log("ERROR in fetching route list")
    });
  }
  routeSuccesshandler(routeResponse) {
    this.edit_routes = routeResponse;
    this.routes = routeResponse.filter(
      route => route.deleted != true
    );
    console.log("routes", this.routes);
  }
  resetAllForms() {
    this.searchForm.resetForm();
    this.itemCreationForm.resetForm();
  }
  addMultipleItemArray(formValue) {
    console.log("formValue", formValue);
    debugger;
    const multipleItem = {
      // "serviceName": this.service.serviceName,
      // "stateName": this.state.stateName,
      'isMedical': formValue.itemType,
      'itemCode': formValue.code,
      'itemName': formValue.name,
      'itemDesc': formValue.description,
      'itemCategoryID': formValue.category.itemCategoryID,
      'itemFormID': formValue.dose.itemFormID,
      'pharmacologyCategoryID': formValue.pharmacology!=null?formValue.pharmacology.pharmacologyCategoryID:null,
      'manufacturerID': formValue.manufacturer!=null?formValue.manufacturer.manufacturerID:null,
      'strength': formValue.strength,
      'uomID': formValue.uom.uOMID,
      'isScheduledDrug': formValue.drugType,
      'composition': formValue.composition,
      'routeID': formValue.route.routeID,
      'createdBy': this.createdBy,
      'providerServiceMapID': this.providerServiceMapID,
      'status': 'active',
      'isEDL' : this.isEDL
    }
    console.log('multipleItem', multipleItem);
    this.checkDuplicates(multipleItem);
    this.itemCreationForm.resetForm();
  }
  checkDuplicates(multipleItem) {
    let duplicateStatus = 0
    if (this.itemArrayObj.length === 0) {
      this.itemArrayObj.push(multipleItem);
    }
    else {
      for (let i = 0; i < this.itemArrayObj.length; i++) {
        if (this.itemArrayObj[i].itemCode === multipleItem.itemCode
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
  showTable() {
    this.showTableFlag = true;
    this.showFormFlag = false;
    this.tableMode = true;
    this.editMode = false;
  }
  saveItem() {
    this.itemService.createItem(this.itemArrayObj).subscribe(response => {
      if (response) {
        console.log(response, 'item created');
        this.itemCreationForm.resetForm();
        this.itemArrayObj = [];
        this.dialogService.alert('Saved Successfully', 'success');
        this.showTable();

        this.getAllItemsList(this.providerServiceMapID);
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
        this.disableSelection = false;
        this.getAllItemsList(this.providerServiceMapID);
        this.create_filterTerm = '';
      }
    })
  }
  editItem(itemlist) {
    
    console.log("Existing Data", itemlist);
    this.itemID = itemlist.itemID;
    this.edit_serviceline = this.service;
    this.edit_state = this.state;
    this.edit_ItemType = itemlist.isMedical;
    this.edit_Code = itemlist.itemCode;
    this.edit_Name = itemlist.itemName;
    this.edit_Category = itemlist.itemCategoryID;
    this.edit_Dose = itemlist.itemFormID;
    this.edit_Pharmacology = itemlist.pharmacologyCategoryID;
    this.edit_Manufacturer = itemlist.manufacturerID;
    this.edit_Strength = itemlist.strength;
    this.edit_Uom = itemlist.uomID;
    this.edit_DrugType = itemlist.isScheduledDrug;
    this.edit_Composition = itemlist.composition;
    this.edit_Route = itemlist.routeID;
    this.edit_Description = itemlist.itemDesc;
    if(itemlist.isEDL == true)
    this.editDrug="EDL";
    else
    this.editDrug="Non-EDL";
    this.showEditForm();
  }
  showEditForm() {
    debugger;
    this.tableMode = false;
    this.showFormFlag = false;
    this.editMode = true;
  }

  update(editItemCreationForm) {
    debugger;
    let updateItemObject = {
      "itemDesc": editItemCreationForm.description,
      'isMedical': editItemCreationForm.itemType,
      'itemCategoryID': editItemCreationForm.category,
      'pharmacologyCategoryID': editItemCreationForm.pharmacology,
      'manufacturerID': editItemCreationForm.manufacturer,
      'isScheduledDrug': editItemCreationForm.drugType,
      "providerServiceMapID": this.providerServiceMapID,
      'modifiedBy': this.createdBy,
      "itemID": this.itemID
    }
    this.itemService.updateItem(updateItemObject).subscribe(response => {
      this.dialogService.alert('Updated successfully', 'success');
      this.getAllItemsList(this.providerServiceMapID);
      this.showTable();
      console.log("Data to be update", response);
    })
  }
  activateDeactivate(itemID, flag) {
    if (flag) {
      this.confirmMessage = 'Block';
    } else {
      this.confirmMessage = 'Unblock';
    }
    this.dialogService.confirm('Confirm', "Are you sure you want to " + this.confirmMessage + "?").subscribe((res) => {
      if (res) {
        console.log("Deactivating or activating Obj", itemID, flag);
        this.itemService.itemActivationDeactivation(itemID, flag)
          .subscribe((res) => {
            console.log('Activation or deactivation response', res);
            this.dialogService.alert(this.confirmMessage + "ed successfully", 'success');
            this.getAllItemsList(this.providerServiceMapID);
            this.create_filterTerm = '';
          }, (err) => this.dialogService.alert(err, 'error'))
      }
    },
      (err) => {
        console.log(err);
      })
  }


}

@Component({
  selector: 'EditItemMasterModal',
  templateUrl: './edit-item-master.html',
  styleUrls: ['./item-master.component.css']
})
export class EditItemMasterModal {

  providerServiceMapID: any;
  bool: any;
  itemType: any;
  code: any;
  name: any;
  category: any;
  dose: any;
  pharmacology: any;
  manufacturer: any;
  strength: any;
  uom: any;
  drugType: any;
  composition: any;
  route: any;
  description: any;

  categories: any = [];
  dosages: any = [];
  pharmacologies: any = [];
  manufacturers: any = [];
  measures: any = [];
  routes: any = [];

  @ViewChild('editItemCreationForm') editItemCreationForm: NgForm;

  constructor( @Inject(MD_DIALOG_DATA) public data, public dialog: MdDialog,
    public itemService: ItemService,
    public dialogRef: MdDialogRef<EditItemMasterModal>,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    console.log("Initial value", this.data);
    this.setProviderServiceMapID(this.data);
  }
  setProviderServiceMapID(data) {
    this.providerServiceMapID = this.data.providerServiceMapID;
    console.log('psmid', this.providerServiceMapID);
    this.getCategoriesList(this.providerServiceMapID);
    this.getDosageList(this.providerServiceMapID);
    this.pharmacologiesList(this.providerServiceMapID);
    this.manufacturerList(this.providerServiceMapID);
    this.unitOfMeasuresList(this.providerServiceMapID);
    this.routeAdminList(this.providerServiceMapID);
    this.edit();
  }
  getCategoriesList(providerServiceMapID) {
    this.itemService.getAllItemsCategory(this.providerServiceMapID, 0).subscribe((categoryResponse) => {
      this.categoriesSuccesshandler(categoryResponse),
        (err) => console.log("ERROR in fetching category list")
    });
  }
  categoriesSuccesshandler(categoryResponse) {
    this.categories = categoryResponse
    console.log("categories List", this.categories);
  }
  getDosageList(providerServiceMapID) {
    this.itemService.getAllDosages(this.providerServiceMapID).subscribe((dosageResponse) => {
      this.dosageSuccesshandler(dosageResponse),
        (err) => console.log("ERROR in fetching dosage list")
    });
  }
  dosageSuccesshandler(dosageResponse) {
    this.dosages = dosageResponse;
    console.log("dosage list", this.dosages);
  }
  pharmacologiesList(providerServiceMapID) {
    console.log('check inside pharma');

    this.itemService.getAllPharmacologyCategory(this.providerServiceMapID).subscribe((pharmacologyResponse) => {
      console.log("pharmacologyResponse", pharmacologyResponse);

      this.pharmacologySuccesshandler(pharmacologyResponse),
        (err) => console.log("ERROR in fetching pharmacological list")
    });
  }
  pharmacologySuccesshandler(pharmacologyResponse) {
    this.pharmacologies = pharmacologyResponse;
    console.log("editpharmacology", this.pharmacologies);
  }
  manufacturerList(providerServiceMapID) {
    console.log('check inside manufacturer');

    this.itemService.getAllManufacturers(this.providerServiceMapID).subscribe((manufacturerResponse) => {
      console.log("manufacturerResponse", manufacturerResponse);

      this.manufacturerSuccesshandler(manufacturerResponse),
        (err) => console.log("ERROR in fetching manufacturer list")
    });
  }
  manufacturerSuccesshandler(manufacturerResponse) {
    this.manufacturers = manufacturerResponse;
    console.log("manufacturers", this.manufacturers);
  }
  unitOfMeasuresList(providerServiceMapID) {
    console.log('check inside Uom');
    this.itemService.getAllUoms(this.providerServiceMapID).subscribe((uomResponse) => {
      console.log("uomResponse", uomResponse);

      this.uomSuccesshandler(uomResponse),
        (err) => console.log("ERROR in fetching Uom list")
    });
  }
  uomSuccesshandler(uomResponse) {
    this.measures = uomResponse;
    console.log("measures", this.measures);
  }
  routeAdminList(providerServiceMapID) {
    console.log('check inside route');
    this.itemService.getAllRoutes(this.providerServiceMapID).subscribe((routeResponse) => {
      console.log("routeResponse", routeResponse);
      this.routeSuccesshandler(routeResponse),
        (err) => console.log("ERROR in fetching route list")
    });
  }
  routeSuccesshandler(routeResponse) {
    this.routes = routeResponse;
    console.log("routes", this.routes);
  }
  edit() {
    this.itemType = this.data.isMedical;
    this.code = this.data.itemCode;
    this.name = this.data.itemName;
    this.category = this.data.itemCategoryID;
    this.dose = this.data.itemFormID;
    this.pharmacology = this.data.pharmCategoryID;
    this.manufacturer = this.data.manufacturerID;
    this.strength = this.data.strength;
    this.uom = this.data.uomID;
    this.drugType = this.data.isScheduledDrug;
    this.composition = this.data.composition;
    this.route = this.data.routeID;
    this.description = this.data.itemDesc;

  }
  update() {
    let updateItemObject = {
      "isMedical": this.itemType,
      "itemCode": this.code,
      "itemName": this.name,
      "itemDesc": this.description,
      "itemCategoryID": this.category,
      "itemFormID": this.dose,
      "pharmacologyCategoryID": this.pharmacology,
      "manufacturerID": this.manufacturer,
      "strength": this.strength,
      "uomID": this.uom,
      "isScheduledDrug": this.drugType,
      "composition": this.composition,
      "routeID": this.route,
      "status": "active",
      "providerServiceMapID": this.data.providerServiceMapID,
      "itemID": this.data.itemID,
      'modifiedBy': this.data.createdBy

    }
    this.itemService.updateItem(updateItemObject).subscribe(response => {
      console.log("Data to be update", response);
      this.dialogRef.close("success");

    })
  }
}

