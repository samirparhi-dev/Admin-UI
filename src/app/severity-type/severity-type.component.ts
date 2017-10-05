import { Component, OnInit, Inject} from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';
import { SeverityTypeService } from "../services/ProviderAdminServices/severity-type-service";
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-severity-type',
  templateUrl: './severity-type.component.html',
  styleUrls: ['./severity-type.component.css']
})
export class SeverityTypeComponent implements OnInit {

  states: any= [];
  stateId: any;
  serviceProviderID: any;
  service: any;
  services: any =[];
  firstPage: boolean = true;
  description: any;
  severity: any;
  data: any = [];
  search:boolean = false;
  alreadyExist: boolean = false;
  providerServiceMapID: any;
  constructor(public ProviderAdminRoleService: ProviderAdminRoleService, public commonDataService: dataService,
    public severityTypeService: SeverityTypeService, public dialog: MdDialog, private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
  	this.serviceProviderID =(this.commonDataService.service_providerID).toString();
  	this.ProviderAdminRoleService.getStates(this.serviceProviderID).subscribe(response=>this.states=this.successhandler(response));
  }
  successhandler(response) {
  	return response;
  }
  getServices(state) {
    this.search = false;
    this.service="";
  	this.ProviderAdminRoleService.getServices(this.serviceProviderID, state).subscribe(response => this.servicesSuccesshandeler(response));
  }
  servicesSuccesshandeler(response) {
  	console.log(response);
  	this.services = response.filter(function(obj){
  		return obj.serviceName == 104 || obj.serviceName == 1097 || obj.serviceName == "MCTS"
  	});
  }
  findSeverity(serObj) {
    console.log(serObj);
    this.data=[];
    this.providerServiceMapID = serObj.providerServiceMapID;
     this.search = true;
    this.severityTypeService.getSeverity(serObj.providerServiceMapID).subscribe(response=>this.getSeveritysuccesshandler(response));

  }
  getSeveritysuccesshandler(response) {
        this.data = response
  }
  showAddScreen() {
  	this.handlingFlag(false);
  }
  addSeverity(severity) {
    for (var i=0; i<this.data.length; i++) {
          if (this.data[i].severityTypeName.toLowerCase() == severity.toLowerCase()) {
              this.alreadyExist = true;
          }
          else{
            this.alreadyExist = false;
          }
     }

  }
  severityArray: any =[];
  add(values) {
    if(!this.alreadyExist) {
      let obj = {
        "severityTypeName" : values.severity,
        "severityDesc" : values.description,
        "providerServiceMapID" : this.providerServiceMapID,
        "createdBy" : "Admin"
      }
      let temp : boolean;
      if(this.severityArray.length == 0) {
        this.severityArray.push(obj);
      }
      
      else {
        for (var i=0; i<this.severityArray.length; i++) { 
          temp = true;
          if(this.severityArray[i].severityTypeName.toLowerCase() == obj.severityTypeName.toLowerCase()) {
            temp = false;
          }
        }
        if(temp){
          this.severityArray.push(obj);
        }
      }
    }
  }
  handlingFlag(flag) {
  	this.firstPage = flag;
  }
  removeObj(i) {
    this.severityArray.splice(i, 1);
  }
  finalSubmit() {
        this.severityTypeService.addSeverity(this.severityArray).subscribe(response=>this.createdSuccessHandler(response));
  }
  createdSuccessHandler(res){
    // alert("severity added successfully");
    this.alertService.alert("Severity added successfully");
    this.handlingFlag(true);
    this.findSeverity(res[0]);
    this.severityArray= [];
    this.severity = "";
    this.description = "";

  }
  //severityID
  deleteSeverity(id) {
       this.alertService.confirm("Are you sure you want to delete?").subscribe((res)=>{
         if(res){
           this.severityTypeService.deleteSeverity(id).subscribe(response=>this.deleteSuccessHandler(response));
         }
       },
       (err)=>{
         console.log(err);
       })
  }
  deleteSuccessHandler(res) {
    // alert("deleted successfully");
    this.alertService.alert("Deleted severity successfully");
  }
  editSeverity(obj) {
              let dialogReff = this.dialog.open(EditSeverityModalComponent, {
              height: '380px',
              width: '420px',
              disableClose: true,
              data: obj
            });
          dialogReff.afterClosed().subscribe(()=>{
          this.severityTypeService.getSeverity(this.providerServiceMapID).subscribe(response=>this.getSeveritysuccesshandler(response));
      });
  }
}

@Component({
  selector: 'edit-severity-component',
  templateUrl: './edit-severity-component-modal.html',
})
export class EditSeverityModalComponent {

  severity: any;
  description: any;
  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,public severityTypeService: SeverityTypeService,
    public dialogReff: MdDialogRef<EditSeverityModalComponent>,
    ) { }
  ngOnInit() {
    this.data;
    ;
     this.severity = this.data.severityTypeName;
     this.description = this.data.severityDesc;

  }
  modify(value) {
    let object = {
      "severityID" :this.data.severityID,
      "severityTypeName" : value.severity,
      "severityDesc" : value.description
    } 
        this.severityTypeService.modifySeverity(object).subscribe(response=>this.modifiedSuccessHandler(response));

  }
  addSeverity(value){

  }
  modifiedSuccessHandler(res){
    this.dialogReff.close();
  }
}
