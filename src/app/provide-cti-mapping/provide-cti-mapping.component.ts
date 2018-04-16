import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CallServices } from './../services/callservices/callservice.service';
import { NgForm } from '@angular/forms';

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
  isNational: any = false;
  providerServiceMapID: any;

  @ViewChild('form') mapping_form: NgForm;


  constructor(private block_provider: BlockProvider, private message: ConfirmationDialogsService, private _callServices: CallServices) { }

  ngOnInit() {
    this.block_provider.getAllProviders().subscribe(response => this.getAllProvidersSuccesshandeler(response), err => {
      this.message.alert(err, 'error');
    });
  }

  getServices(serviceProviderID) {
    this.block_provider.getServicesOfProvider(serviceProviderID.serviceProviderId)
      .subscribe(response => this.getServicesSuccesshandeler(response), err => {
        this.message.alert(err, 'error');
      });
  }

  getCampaign(serviceline) {
    this._callServices.getCapmaign(serviceline.serviceName).subscribe((res) => {
      this.campaign_array = res.campaign;
      this.setIsNational(serviceline.isNational);
      this.getStatesInService(this.service_provider.serviceProviderId, serviceline.serviceID);
    }, (err) => {
      this.message.alert(err, 'error');
    });
  }

  setIsNational(value) {
    this.isNational = value;
  }

  getStatesInService(serviceProviderID, serviceID) {
    const data = {
      'serviceProviderID': serviceProviderID,
      'serviceID': serviceID
    }
    this.block_provider.getStatesInServices(data).subscribe(response => {
      this.getStatesSuccesshandeler(response);
      // this.getAllServicesOfProvider(serviceProviderID);
    }, err => {
      this.message.alert(err, 'error');
    });
  }
  getAllProvidersSuccesshandeler(response) {
    this.service_provider_array = response;
  }
  getStatesSuccesshandeler(response) {
    this.states_array = response;

    if (this.isNational) {
      this.providerServiceMapID = this.states_array[0].providerServiceMapID;
    }
  }
  getServicesSuccesshandeler(response) {
    this.services_array = response;
  }
  addCampaign(serviceProvider: any, serviceline: any, campaign: any) {
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

    this.mapping_form.reset();

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
      this.mapping_form.reset();
      this.campaignList = [];

      // if (res.response === 'mappedSuccessFully') {
      //   this.message.alert('Successfully Added');
      // } else {

      // }
    }, (err) => {
      this.message.alert(err, 'error');
    })
  }
  resetForm() {
    // this.message.confirm('Confirm','Are you sure want to reset?').subscribe((response) => {
    //   if (response) {
    jQuery('#myForm').trigger('reset');
    this.states_array = [];
    this.services_array = [];
    this.campaign_array = [];

    this.campaignList = [];
    //   }

    // }, (err) => { });
  }
}
