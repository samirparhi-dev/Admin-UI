import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ItemService } from '../services/inventory-services/item.service';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

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
  showTableFlag: boolean = false;
  showFormFlag: boolean = false;
  nationalFlag: boolean;
  disableSelection: boolean = false;
  /*Arrays*/
  services: any = [];
  states: any = [];
  itemsList: any = [];
  categories: any = [];
  dosages: any = [];
  pharmacologies: any = [];
  manufacturers: any = [];
  measures: any = [];

  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('itemCreationForm') itemCreationForm: NgForm;
  constructor(public commonDataService: dataService,
    public itemService: ItemService,
    public commonServices: CommonServices,
    public dialogService: ConfirmationDialogsService) {
    this.providerID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    console.log("this.userID", this.userID);
    
    this.providerServiceMapID = this.commonDataService.provider_serviceMapID;
    console.log('providerServiceMapID', this.providerServiceMapID );
    
    this.commonServices.getServiceLines(this.userID).subscribe((response) => {
      console.log("serviceline", response);

      this.servicesSuccesshandler(response),
        (err) => console.log("ERROR in fetching serviceline")
    });
    // this.getCategoriesList();
    // this.getDosageList();
    
    // this.pharmacologiesList();
    // this.manufacturerList();

  }
  // setProviderServiceMapID(providerServiceMapID) {
  //   console.log("providerServiceMapID", providerServiceMapID);
  //   this.providerServiceMapID = providerServiceMapID;
  //   console.log('psmid', this.providerServiceMapID);
  //   this.getAllItemsList();
  // }
  servicesSuccesshandler(res) {
    this.services = res.filter((item) => {
      console.log('item', item);
      if (item.serviceID != 6) {
        return item;
      }
    })
  }
  // getStates(value) {
  //  console.log("value", value);
    // if (value.serviceID === 1) {
    //   // this.searchForm.patchValue({ state: null })
    //   // this.states = [];
    //   this.getAllItemsList(this.providerServiceMapID);
    // }
    // else {
      // let stateRequestObj = {
      //   'userID': this.userID,
      //   'serviceID': value.serviceID,
      //   'isNational': value.isNational
      // }
      // console.log("obj", stateRequestObj);
      // this.commonServices.getStatesOnServices(stateRequestObj).
      //   subscribe(response => this.getStatesSuccessHandeler(response, value), (err) => {
      //     console.log("error in fetching states")
      //   });

  //  }
  // }
  // getStatesSuccessHandeler(response, value) {
  //   this.states = response;
  //   console.log('this.states', this.states);

  //   if (value.isNational) {
  //     this.nationalFlag = value.isNational;
  //     this.setProviderServiceMapID(response[0].providerServiceMapID);
  //     this.showTableFlag = false;
  //   }
  //   else {
  //     this.nationalFlag = value.isNational;
  //     this.showTableFlag = false;
  //   }
  // }

  // getAllItemsList() {   
  //   console.log("providerServicemapID", this.providerServiceMapID);

  //   this.itemService.getAllItems(this.providerServiceMapID, 0).subscribe((res) =>
  //     this.itemsSuccessHandler(res),
  //     (err) => { console.log("Error Items not found", err) });

  // }

  // itemsSuccessHandler(res) {
  //   console.log("All items", res);
  //   this.itemsList = res;
  //   this.showTableFlag = true;
  // }
  // showForm() {
  //   this.showTableFlag = false;
  //   this.showFormFlag = true;
  //   this.disableSelection = true;
  // }
  // getCategoriesList() {
  //   this.itemService.getAllItemsCategory(this.providerServiceMapID, 0).subscribe((categoryResponse) => {
  //     this.categoriesSuccesshandler(categoryResponse),
  //       (err) => console.log("ERROR in fetching category list")
  //   });
  // }

  //  categoriesSuccesshandler(categoryResponse) {
  //   this.categories = categoryResponse
  //   console.log("categories List", this.categories);
    
  // }
  // getDosageList() {
  //   this.itemService.getAllDosages(0).subscribe((dosageResponse) => {
  //     this.dosageSuccesshandler(dosageResponse),
  //       (err) => console.log("ERROR in fetching dosage list")
  //   });

  // }
  // dosageSuccesshandler(dosageResponse) {
  //   this.dosages = dosageResponse;
  //   console.log("dosage list", this.dosages);  

  // }
  // pharmacologiesList() {
  //   console.log('check inside pharma');
    
  //   this.itemService.getAllPharmacologyCategory(this.providerServiceMapID).subscribe((pharmacologyResponse) => {   
  //     console.log("pharmacologyResponse", pharmacologyResponse);
         
  //     this.pharmacologySuccesshandler(pharmacologyResponse),
  //       (err) => console.log("ERROR in fetching pharmacological list")
  //   });
  // }
  // pharmacologySuccesshandler(pharmacologyResponse) {
   
  //   this.pharmacologies = pharmacologyResponse;
  //   console.log("pharmacology", this.pharmacologies);
    

  // }
  // manufacturerList() {
  //   console.log('check inside manufacturer');
    
  //   this.itemService.getAllManufacturers(this.providerServiceMapID).subscribe((manufacturerResponse) => {   
  //     console.log("pharmacologyResponse", manufacturerResponse);
         
  //     this.manufacturerSuccesshandler(manufacturerResponse),
  //       (err) => console.log("ERROR in fetching pharmacological list")
  //   });
  // }
  // manufacturerSuccesshandler(manufacturerResponse) {
   
  //   this.manufacturers = manufacturerResponse;
  //   console.log("pharmacology", this.manufacturers);
    

  // }
}
