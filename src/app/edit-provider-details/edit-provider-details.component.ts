import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-edit-provider-details',
  templateUrl: './edit-provider-details.component.html',
  styleUrls: ['./edit-provider-details.component.css']
})
export class EditProviderDetailsComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<EditProviderDetailsComponent>,
    @Inject(MD_DIALOG_DATA) public providerDetails: any) { }

  ngOnInit() {
    const providerData = this.providerDetails;
  }

}
