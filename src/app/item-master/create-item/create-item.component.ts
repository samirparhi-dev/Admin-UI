import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  
  providerID: any;
  serviceMapId: any;
  providerServiceMapID: any;
  bool: any;

  categories: any = [];
  dosages: any = [];
  pharmacologies: any = [];
  manufacturers: any = [];
  measures: any = [];

@ViewChild('searchForm') searchForm: NgForm;
  constructor(
    public commonDataService: dataService,
    public itemService: ItemService,
    public commonServices: CommonServices,
    public dialogService: ConfirmationDialogsService) {
    this.providerID = this.commonDataService.service_providerID;
  }

  ngOnInit() { 
    this.serviceMapId = this.searchForm.value.state.providerServiceMapID;
    this.getCategoriesList();
    this.getDosageList();
    console.log('this.serviceMapId',this.serviceMapId);
    
    this.pharmacologiesList();
    this.manufacturerList();


  }
 
  getCategoriesList() {
    this.itemService.getAllItemsCategory(this.serviceMapId, 0).subscribe((categoryResponse) => {
      this.categoriesSuccesshandler(categoryResponse),
        (err) => console.log("ERROR in fetching category list")
    });
  }

   categoriesSuccesshandler(categoryResponse) {
    this.categories = categoryResponse
    console.log("categories List", this.categories);
    
  }
  getDosageList() {
    this.itemService.getAllDosages(0).subscribe((dosageResponse) => {
      this.dosageSuccesshandler(dosageResponse),
        (err) => console.log("ERROR in fetching dosage list")
    });

  }
  dosageSuccesshandler(dosageResponse) {
    this.dosages = dosageResponse;
    console.log("dosage list", this.dosages);  

  }
  pharmacologiesList() {
    console.log('check inside pharma');
    
    this.itemService.getAllPharmacologyCategory(this.serviceMapId).subscribe((pharmacologyResponse) => {   
      console.log("pharmacologyResponse", pharmacologyResponse);
         
      this.pharmacologySuccesshandler(pharmacologyResponse),
        (err) => console.log("ERROR in fetching pharmacological list")
    });
  }
  pharmacologySuccesshandler(pharmacologyResponse) {
   
    this.pharmacologies = pharmacologyResponse;
    console.log("pharmacology", this.pharmacologies);
    

  }
  manufacturerList() {
    console.log('check inside manufacturer');
    
    this.itemService.getAllManufacturers(this.serviceMapId).subscribe((manufacturerResponse) => {   
      console.log("pharmacologyResponse", manufacturerResponse);
         
      this.manufacturerSuccesshandler(manufacturerResponse),
        (err) => console.log("ERROR in fetching pharmacological list")
    });
  }
  manufacturerSuccesshandler(manufacturerResponse) {
   
    this.manufacturers = manufacturerResponse;
    console.log("pharmacology", this.manufacturers);
    

  }
  // uomlist() {
  //   console.log('check inside manufacturer');
    
  //   this.itemService.getAllUnits(this.serviceMapId).subscribe((unitResponse) => {   
  //     console.log("unitResponse", unitResponse);
         
  //     this.unitMeasuresSuccesshandler(unitResponse),
  //       (err) => console.log("ERROR in fetching pharmacological list")
  //   });
  // }
  unitMeasuresSuccesshandler(unitResponse) {
   
    this.measures = unitResponse;
    console.log("pharmacology", this.measures);
    

  }
}
