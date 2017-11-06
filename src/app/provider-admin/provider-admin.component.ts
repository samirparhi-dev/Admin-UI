import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-provider-admin',
  templateUrl: './provider-admin.component.html',
  styleUrls: ['./provider-admin.component.css']
})
export class ProviderAdminComponent implements OnInit {

  constructor(public alertService:ConfirmationDialogsService) { }

  ngOnInit() {
  }

  Activity_Number:any="0";

  show(value)
  {
    if(this.Activity_Number!="0" && this.Activity_Number!=value)
    {
      this.alertService.confirm("Do you really want to navigate? Any unsaved data would be lost").subscribe(response=>{
        if(response)
        {
          this.Activity_Number=value;
        }
      }); 
    }
    else
    {
      this.Activity_Number=value;
    }
  }

}
