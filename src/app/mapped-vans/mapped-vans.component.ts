import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { EmployeeParkingPlaceMappingService } from '../services/ProviderAdminServices/employee-parking-place-mapping.service';

@Component({
  selector: 'app-mapped-vans',
  templateUrl: './mapped-vans.component.html',
  styleUrls: ['./mapped-vans.component.css']
})
export class MappedVansComponent implements OnInit {

  mappedVans: any = [];

  constructor(
    @Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<MappedVansComponent>,
    private employeeParkingPlaceMappingService: EmployeeParkingPlaceMappingService,
    private confirmationDialogsService: ConfirmationDialogsService) { }

  ngOnInit() {
    console.log("input", this.input)
      this.showVanList(this.input.vanListDetails);
  }

  showVanList(vanListDetails) {
    this.employeeParkingPlaceMappingService.getMappedVansList(vanListDetails.userParkingPlaceMapID).subscribe((response) => {
      if (response.statusCode == 200 && response.data != undefined) {
        this.mappedVans = response.data;
      }
    }, (err) => {
      this.confirmationDialogsService.alert(err.errorMessage);
    });
  }
  removeVan(index, item) {
    this.mappedVans.splice(index, 1);
    let removeItemObj = {
      "userVanMapID": item.userVanMapID,
      "modifiedBy": item.createdBy
    }
    this.employeeParkingPlaceMappingService.removeMappedVan(removeItemObj).subscribe((removedItemResponse) => {
      if (removedItemResponse.statusCode == 200) {
        this.confirmationDialogsService.alert("Deleted Successfully", 'success');
      }
    }, (err) => {
      this.confirmationDialogsService.alert(err.errorMessage);
    });

  }
}
