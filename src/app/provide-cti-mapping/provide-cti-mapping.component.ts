import { Component, OnInit } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CallServices } from './../services/callservices/callservice.service';
declare var jQuery: any;


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
  campaignList: any = [];

  constructor(private block_provider: BlockProvider, private message: ConfirmationDialogsService, private _callServices: CallServices) { }

  ngOnInit() {
    this.block_provider.getAllProviders().subscribe(response => this.getAllProvidersSuccesshandeler(response));
  }


  getStates(serviceProviderID) {
    this.block_provider.getStates(serviceProviderID.serviceProviderId).subscribe(response => {
      this.getStatesSuccesshandeler(response);
      // this.getAllServicesOfProvider(serviceProviderID);
    });
  }
  getServicesInState(serviceProviderID, stateID) {
    this.block_provider.getServicesInState(serviceProviderID.serviceProviderId, stateID)
    .subscribe(response => this.getServicesInStatesSuccesshandeler(response));
  }
  getCampaign(service_provider, state, serviceline) {
    this._callServices.getCapmaign(serviceline.serviceName).subscribe((res) => {
      this.campaign_array = res.campaign;
    }, (err) => {

    });
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
  addCampaign(serviceProvider: any, serviceline: any, campaign: any) {
    debugger;
    let campignObj = {};
    campignObj['providerName'] = serviceProvider.serviceProviderName;
    campignObj['providerServiceMapID'] = serviceline.providerServiceMapID;
    campignObj['cTI_CampaignName'] = campaign.campaign_name;
    campignObj['Service'] = serviceline.serviceName;
    campignObj['ServiceId'] = serviceline.serviceID;
    if (this.campaignList.length > 0) {
      this.campaignList.push(campignObj);
      this.campaignList = this.filterArray(this.campaignList);
    } else {
      this.campaignList.push(campignObj);
    }

  }
  filterArray(array: any) {
    const o = {};
    return array = array
    .filter((thing, index, self) => self
            .findIndex((t) => {
              return t.providerServiceMapID === thing.providerServiceMapID;
            }) === index)
  }
  deleteRow(index) {
    this.campaignList.splice(index, 1);
  }
  finalsave(campaignObj) {
    campaignObj = campaignObj.map(function (item) {
      return {
        'providerServiceMapID': item.providerServiceMapID,
        'cTI_CampaignName': item.cTI_CampaignName
      }
    });
    this._callServices.addCampaign(campaignObj).subscribe((res) => {
      this.message.alert(res.response);
      // if (res.response === 'mappedSuccessFully') {
      //   this.message.alert('Successfully Added');
      // } else {

      // }
    }, (err) => {

    })
  }
  resetForm() 
  {
    // this.message.confirm('Are you sure want to reset?').subscribe((response) => {
    //   if (response) {
      jQuery('#myForm').trigger('reset');
      this.states_array = [];
      this.services_array = [];
      this.campaign_array=[];

      this.campaignList=[];
    //   }

    // }, (err) => { });
  }
}
