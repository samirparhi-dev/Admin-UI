import { Component, OnInit } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-provide-cti-mapping',
  templateUrl: './provide-cti-mapping.component.html',
  styleUrls: ['./provide-cti-mapping.component.css']
})
export class ProvideCtiMappingComponent implements OnInit {
  service_provider_array: any = [];
  service_provider: any;
  states_array: any = [];
  state: any;
  services_array: any = [];
  serviceline: any;
  campaign_array: any = [];
  campaign: any;


  constructor(private block_provider: BlockProvider, private message: ConfirmationDialogsService) { }

  ngOnInit() {
    this.block_provider.getAllProviders().subscribe(response => this.getAllProvidersSuccesshandeler(response));
  }


  getStates(serviceProviderID) {
    this.block_provider.getStates(serviceProviderID).subscribe(response => {
      this.getStatesSuccesshandeler(response);
      // this.getAllServicesOfProvider(serviceProviderID);
    });
  }
  getServicesInState(serviceProviderID, stateID) {
    this.block_provider.getServicesInState(serviceProviderID, stateID)
      .subscribe(response => this.getServicesInStatesSuccesshandeler(response));
  }
  getCampaign(service_provider, state, serviceline) {

  }
  getAllProvidersSuccesshandeler(response) {
    this.service_provider_array = response;
  }
  getStatesSuccesshandeler(response) {
    this.states_array = response;
  }
  getServicesInStatesSuccesshandeler(response) {
    this.services_array = response;
  }
  resetForm() {
    this.message.confirm('Are you sure want to clear?').subscribe((response) => {
      if (response) {
        //jQuery('#myForm').trigger('reset');
        this.states_array = [];
        this.services_array = [];
      }

    }, (err) => { });
  }
}
