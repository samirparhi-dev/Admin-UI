import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-procedure-master',
  templateUrl: './procedure-master.component.html',
  styleUrls: ['./procedure-master.component.css']
})
export class ProcedureMasterComponent implements OnInit {

  editProcedure: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
