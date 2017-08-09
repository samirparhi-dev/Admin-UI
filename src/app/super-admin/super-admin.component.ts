import { Component, OnInit, Input } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
declare var jQuery: any;



@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  @Input() current_language: any;
  currentlanguage: any;

  constructor(public dataService: dataService) { 
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

  Activity_Number:any;

	show(value)
  	{
  		this.Activity_Number=value;
  	}

}
