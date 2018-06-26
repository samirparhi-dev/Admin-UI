import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { Mainstroreandsubstore } from '../services/inventory-services/mainstoreandsubstore.service';
import { dataService } from '../services/dataService/data.service';
import { isNullOrUndefined } from 'util';
import { CommonServices } from '../services/inventory-services/commonServices';

@Component({
  selector: 'app-item-issue-method-config',
  templateUrl: './item-issue-method-config.component.html',
  styleUrls: ['./item-issue-method-config.component.css']
})
export class ItemIssueMethodConfigComponent implements OnInit {

  object: any = [];
  ItemIssue_array: any = [];
  itemCategory_array: any = [];
  providerServiceMapID: any;
  states_array: any = [];
  services_array: any = [];
  serviceProviderID: any;
  createdBy: any;
  category: any;
  itemIssue: any;
  state: any;
  serviceline: any;
  uid: any;

  constructor(public commonservice: CommonServices,private storeService: Mainstroreandsubstore, public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.serviceProviderID = this.commonDataService.service_providerID;
    this.uid = this.commonDataService.uid
    this.setItemIssue();
    this.getServices();
  }
  setItemIssue(){
    this.ItemIssue_array = [
      { value: 1, Name: 'First In First Out' },
      { value: 2, Name: 'First Expiry First Out' },
      { value: 3, Name: 'Last In First Out' }
    ];
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
    this.storeService.getStates(this.uid, service.serviceID, false).subscribe(response => {
      if (response) {
        console.log('All states success based on service', response);
        this.states_array = response;
      }
    })
  }
  getItemCategory(providerServiceMapID) {
    debugger;
    this.providerServiceMapID = providerServiceMapID;
    this.storeService.getItemCategory(providerServiceMapID).subscribe(response => {
      if (response) {
        console.log('All Item Categories success based on service', response);
        this.itemCategory_array = response;
        this.setItemIssue();
      }
    })
  }
  getIssueType(itemCategoryID)
  {
    debugger;
    var item=this.itemCategory_array.filter(
      category => category.itemCategoryID == itemCategoryID
    );
    var issueType=this.ItemIssue_array.filter(
      itemissue => itemissue.Name == item[0].issueType
    );
    this.itemIssue=issueType;
  }
  saveConfig() {
    const obj = {
      "issueType": this.itemIssue.Name,
      "itemCategoryID": this.category.itemCategoryID,
      "providerServiceMapID": this.providerServiceMapID
    }
    this.object.push(obj);
    debugger;
    this.storeService.saveItemIssueConfig(this.object).subscribe(response => {
      if (response) {
        this.dialogService.alert("Item issue method configured successfully", 'success');
      }
    })
  }

}
