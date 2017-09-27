import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';

@Component({
  selector: 'app-feedback-type',
  templateUrl: './feedback-type.component.html',
  styleUrls: ['./feedback-type.component.css']
})
export class FeedbackTypeComponent implements OnInit {

  states: any= [];
  stateId: any;
  serviceProviderID: any;
  service: any;
  services: any =[];
  firstPage: boolean = true;
  description: any;
  feebback: any;
  
  constructor(public ProviderAdminRoleService: ProviderAdminRoleService, public commonDataService: dataService) { }

  ngOnInit() {
  	this.serviceProviderID =(this.commonDataService.service_providerID).toString();
  	this.ProviderAdminRoleService.getStates(this.serviceProviderID).subscribe(response=>this.states=this.successhandeler(response));
  }
  successhandeler(response) {
  	return response;
  }
  getServices(state) {
  	this.ProviderAdminRoleService.getServices(this.serviceProviderID, state).subscribe(response => this.servicesSuccesshandeler(response));
  }
  servicesSuccesshandeler(response) {
  	console.log(response);
  	this.services = response.filter(function(obj){
  		return obj.serviceName == 104 || obj.serviceName == 1097 || obj.serviceName == "MCTS"
  	});
  }
  findSeverity(state,service) {

  }
  addSeverity() {
  	this.handlingFlag(false);
  }
  add() {

  }
  handlingFlag(flag) {
  	this.firstPage = flag;
  }
}
