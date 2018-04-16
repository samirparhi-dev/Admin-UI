import { Component, OnInit } from '@angular/core';
import { FormArray,  FormBuilder,  FormGroup  }  from  '@angular/forms';
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

  providerID: any;

  /*Arrays*/
  states: any = [];

  constructor(private  formBuilder:  FormBuilder,
              public commonDataService: dataService,
              public itemService: ItemService,
              public commonServices: CommonServices,
              public dialogService: ConfirmationDialogsService) {
                 this.providerID = this.commonDataService.service_providerID;
                 }

  ngOnInit() {
    this.createForm();
    this.getStates();
    
  }
  createForm() {
    this.searchForm = this.formBuilder.group({ state: null });
  }

  getStates(){
    this.commonServices.getStates(this.providerID).subscribe((res) => 
    this.statesSuccessHandler(res),
    (err) => { console.log("states couldn't fetch") });
  }
 
  statesSuccessHandler(res) {
    if(this.providerID !=undefined) {
    this.states = res;
    console.log("Provider has privilege on states", this.states);
    
    }
  }
}
