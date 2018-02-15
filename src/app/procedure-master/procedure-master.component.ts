import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-procedure-master',
  templateUrl: './procedure-master.component.html',
  styleUrls: ['./procedure-master.component.css']
})
export class ProcedureMasterComponent implements OnInit {

  editProcedure: any;
  procedureForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.initiateForm();
    this.getAvailableProcedures();
    console.log(this.procedureForm)
  }
  /**
   * Initiate Form
  */
  initiateForm() {
    this.procedureForm = this.initProcedureForm();
    // By Default, it'll be set as enabled
    this.procedureForm.patchValue({
      disable: false
    })

  }

  initProcedureForm(): FormGroup {
    return this.fb.group({
      name: null,
      type: null,
      description: null,
      male: null,
      female: null,
      disable: null
    })
  }

  /**
   * Get Details of Procedures available for this Service PRovider
  */
  getAvailableProcedures() {

  }

  score() {
    console.log(this.procedureForm.value)
  }


  saveProcedure() {
    const apiObject = this.objectManipulate();
  }

  /**
   * Update Changes for The Procedure
  */
  updateProcedure() {
    const apiObject = this.objectManipulate();

  }

  /**
   * Disable the Procedure for Doctor
  */
  disableProcedure() {

    this.procedureForm.patchValue({
      disable: true
    })

  }
  /**
   * Enable the Procedure for Doctor
  */
  enableProcedure() {
    this.procedureForm.patchValue({
      disable: false
    })
  }

  /**
   * Manipulate Form Object to as per API Need
  */
  objectManipulate() {
    const obj = Object.assign({}, this.procedureForm.value);
    let apiObject = {};
    console.log(obj.male, 'obj');
    if (obj.male && obj.female) {
      apiObject = {
        name: obj.name,
        type: obj.type,
        description: obj.description,
        disable: obj.disable,
        gender: 'Unisex'
      };
    } else if (obj.male && !obj.female) {
      apiObject = {
        name: obj.name,
        type: obj.type,
        description: obj.description,
        disable: obj.disable,
        gender: 'Male'
      };
    } else if (!obj.male && obj.female ) {
      apiObject = {
        name: obj.name,
        type: obj.type,
        description: obj.description,
        disable: obj.disable,
        gender: 'Female'
      };
    }
    console.log(apiObject, 'apiObject');
    return apiObject;

  }





}
