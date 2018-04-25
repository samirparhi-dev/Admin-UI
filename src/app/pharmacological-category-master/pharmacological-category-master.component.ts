import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-pharmacological-category-master',
  templateUrl: './pharmacological-category-master.component.html',
  styleUrls: ['./pharmacological-category-master.component.css']
})
export class PharmacologicalCategoryMasterComponent implements OnInit {

  providerServiceMapID: any;
  providerID: any;
  createdBy: any;
  userID: any;
  showFormFlag: boolean = false;
  showTableFlag: boolean = false;
  services: any = [];
  states: any = [];
  pharmaCategoryArrayObj:any = [];

  @ViewChild ('pharmacologicalCategoryForm') pharmacologicalCategoryForm: NgForm;
  constructor(public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,
    public commonServices: CommonServices) 
    { 
     // this.providerID = this.commonDataService.service_providerID;
    }

  ngOnInit() {
    // this.createdBy = this.commonDataService.uname;
    // this.userID = this.commonDataService.uid;
    // this.getAllServices();
  }
  // getAllServices() {
  //   this.commonServices.getServiceLines(this.userID).subscribe((response) => {
  //     console.log("serviceline", response);
  //     this.servicesSuccesshandler(response),
  //       (err) => console.log("ERROR in fetching serviceline")
  //   });
  // }
  // servicesSuccesshandler(res) {
  //   this.services = res.filter((item) => {
  //     console.log('item', item);
  //     if (item.serviceID != 6) {
  //       return item;
  //     }
  //   })
  // }

  // setProviderServiceMapID(providerServiceMapID) {  
  //   this.providerServiceMapID = providerServiceMapID;
  //   console.log('psmid', this.providerServiceMapID);   
  // }

  // getStates(service) {
  //   debugger;
  //   console.log("value", service);
  //   this.commonServices.getStatesOnServices(this.providerID, service.serviceID, false).
  //     subscribe(response => this.getStatesSuccessHandeler(response, service), (err) => {
  //       console.log("error in fetching states")
  //     });


  // }
  // getStatesSuccessHandeler(response, service) {
  //   this.states = response;
  //   console.log("states", this.states);
    
  // }
  // showForm() {
  //   this.showFormFlag = true;
  //   this.showTableFlag = false;
  // }
  // add_pharmaObj(formValue) {

  //   let pharmaObj = {
  //     "pharmCategoryCode" : formValue.code,
	// 		"pharmCategoryName" : formValue.name,
  //     "pharmCategoryDesc" : formValue.description,
  //     "status"   : "Active",
  //     "providerServiceMapID" : this.providerServiceMapID,		
	// 		"createdBy": this.commonDataService.uname
	// 	}

	// 	if (this.pharmaCategoryArrayObj.length == 0 && (pharmaObj.pharmCategoryCode != "" && pharmaObj.pharmCategoryCode != undefined)) {
	// 		this.pharmaCategoryArrayObj.push(pharmaObj);
	// 	}
	// 	else {
	// 		let count = 0;
	// 		for (let i = 0; i < this.pharmaCategoryArrayObj.length; i++) {
	// 			if (pharmaObj.pharmCategoryCode === this.pharmaCategoryArrayObj[i].pharmCategoryCode) {
	// 				count = count + 1;
	// 			}
	// 		}
	// 		if (count == 0 && (pharmaObj.pharmCategoryCode != "" && pharmaObj.pharmCategoryCode != undefined)) {
	// 			this.pharmaCategoryArrayObj.push(pharmaObj);
	// 		}
	// 	}


  // }
  // removeRow(index) {
  //   this.pharmaCategoryArrayObj.splice(index, 1);
  // }
}
