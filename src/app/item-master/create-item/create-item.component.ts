import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ItemService } from '../../services/inventory-services/item.service';
import { CommonServices } from '../../services/inventory-services/commonServices';
import { dataService } from '../../services/dataService/data.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {

  @Input('searchForm')
  searchForm: any;

  itemCreationForm: FormGroup;
  providerID: any;
  serviceMapId: any;
  providerServiceMapID: any;
  bool: any;

  categories: any = [];
  dosages: any = [];


  constructor(private formBuilder: FormBuilder,
    public commonDataService: dataService,
    public itemService: ItemService,
    public commonServices: CommonServices,
    public dialogService: ConfirmationDialogsService) {
    this.providerID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    console.log("searchForm", this.searchForm);
    this.createForm();
    this.serviceMapId = this.searchForm.value.state.providerServiceMapID;
    this.getCategoriesList();
    this.getDosageList();


  }
  createForm() {
    this.itemCreationForm = this.formBuilder.group({
      category: null, dose: null, pharmacolgy: null, manufacturer: null,
      strength: null, uom: null, composition: null, route: null
    })
  }
  getCategoriesList() {
    this.itemService.getAllItemsCategory(this.serviceMapId, 0).subscribe((categoryResponse) => {
      this.categoriesSuccesshandler(categoryResponse),
        (err) => console.log("ERROR in fetching serviceline")
    });
  }

   categoriesSuccesshandler(categoryResponse) {
    this.categories = categoryResponse
    console.log("categories List", this.categories);
    
  }
  getDosageList() {
    this.itemService.getAllDosages(0).subscribe((dosageResponse) => {
      this.dosageSuccesshandler(dosageResponse),
        (err) => console.log("ERROR in fetching serviceline")
    });

  }
  dosageSuccesshandler(dosageResponse) {
    this.dosages = dosageResponse;
    console.log("dosage list", this.dosages);
    

  }
}
