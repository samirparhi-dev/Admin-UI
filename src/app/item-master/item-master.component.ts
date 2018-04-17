import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  searchForm: FormGroup;


  providerServiceMapID: any;
  providerID: any;
  userID: any;
  showTableFlag: boolean = false;
  showFormFlag: boolean = false;
  nationalFlag: boolean;
  disableSelection: boolean = false;
  /*Arrays*/
  services: any = [];
  states: any = [];
  itemsList: any = [];

  constructor(private formBuilder: FormBuilder,
    public commonDataService: dataService,
    public itemService: ItemService,
    public commonServices: CommonServices,
    public dialogService: ConfirmationDialogsService) {
    this.providerID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    this.createForm();
    this.userID = this.commonDataService.uid;
    this.commonServices.getServiceLines(this.userID).subscribe((response) => {
      console.log("serviceline", response);

      this.servicesSuccesshandler(response),
        (err) => console.log("ERROR in fetching serviceline")
    });

  }
  createForm() {
    this.searchForm = this.formBuilder.group({ service: null, state: null, itemType: null });
  
  }
  setProviderServiceMapID() {
    this.providerServiceMapID = this.state.providerServiceMapID;
    console.log('psmid', this.providerServiceMapID);
  }
  servicesSuccesshandler(res) {
    this.services = res.filter((item) => {
      console.log('item', item);
      if (item.serviceID != 6) {        
        return item;
      }
    })
  }
  getStates() {
    console.log("value", this.service);
    if (this.service.serviceID === 1) {
      // this.searchForm.patchValue({ state: null })
      // this.states = [];
      this.getAllItemsList();
    }
    else {
      let stateRequestObj = {
        'userID': this.userID,
        'serviceID': this.service.serviceID,
        'isNational': this.service.isNational
      }
      console.log("obj", stateRequestObj);
      this.commonServices.getStatesOnServices(stateRequestObj).
        subscribe(response => this.getStatesSuccessHandeler(response), (err) => {
          console.log("error in fetching states")
        });

    }
  }
  getStatesSuccessHandeler(response) {
    this.states = response;
    console.log('this.states', this.states);

    if (this.service.isNational) {
      this.nationalFlag = this.service.isNational;
      this.setProviderServiceMapID();
      this.showTableFlag = false;
    }
    else {
      this.nationalFlag = this.service.isNational;
      this.showTableFlag = false;
    }
  }

  get service() {
    return this.searchForm.controls['service'].value;
  }
  get state() {
    return this.searchForm.controls['state'].value;
  }

  getAllItemsList() {
    this.setProviderServiceMapID();
    console.log("providerServicemapID", this.providerServiceMapID);

    this.itemService.getAllItems(this.providerServiceMapID, 0).subscribe((res) =>
      this.itemsSuccessHandler(res),
      (err) => { console.log("Error Items not found", err) });

  }

  itemsSuccessHandler(res) {
    console.log("All items", res);
    this.itemsList = res;
    this.showTableFlag = true;
  }
  showForm() {
    this.showTableFlag = false;
    this.showFormFlag = true;
    this.disableSelection = true;
  }
}
