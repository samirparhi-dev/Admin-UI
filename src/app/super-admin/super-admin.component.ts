import { Component, OnInit, Input } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

declare var jQuery: any;



@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  @Input() current_language: any;
  currentlanguage: any;

  constructor(public dataService: dataService,
              public alertService:ConfirmationDialogsService) { 
    this.currentlanguage = {};
  }

  ngOnInit() {

  }

  ngOnChanges()
  {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, "language");
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
