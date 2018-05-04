import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from './../services/callservices/callservice.service';
import { NgForm } from '@angular/forms';

declare var jQuery: any;


@Component({
  selector: 'app-provide-cti-mapping',
  templateUrl: './provide-cti-mapping.component.html',
  styleUrls: ['./provide-cti-mapping.component.css']
})
export class ProvideCtiMappingComponent implements OnInit {

  filterServiceName: any;
  service_provider_array: any = [];
  service_provider: any;
  states_array: any = [];
  states: any;
  services_array: any = [];
  serviceline: any;
  campaign_array: any = [];
  campaign: any;
  campaignArrayList: any = [];
  campaignList: any = [];
  isNational: any = false;
  providerServiceMapID: any;
  serviceProviderID: any;
  stateID: any;
  serviceID: any;
  showTableFlag: boolean = false;
  showFormFlag: boolean = false;
  disableSelection: boolean = false;

  @ViewChild('form') mapping_form: NgForm;
  @ViewChild('mappingCampaign') mappingCampaign: NgForm;

  constructor(private block_provider: BlockProvider,
    private message: ConfirmationDialogsService,
    private _callServices: CallServices,
    public commonDataService: dataService) { }

  ngOnInit() {
    this.getAllProviders();
  }

  getAllProviders() {
    this.block_provider.getAllProviders().subscribe(response => this.getAllProvidersSuccesshandeler(response), err => {
      this.message.alert(err, 'error');
    });
  }
  getAllProvidersSuccesshandeler(response) {
    this.service_provider_array = response;
  }

  getAllMappedServicelinesAndStates(service_provider) {
    console.log("campaignObj", service_provider);
    this._callServices.getAllMappedServicelinesAndStates(service_provider).subscribe(campaignListResponse =>
      this.getMappedServicelinesAndStatesSuccessHandler(campaignListResponse), err => {
        this.message.alert(err, 'error');
      })

  }
  getMappedServicelinesAndStatesSuccessHandler(campaignListResponse) {
    this.campaignArrayList = campaignListResponse;
    this.showTableFlag = true;
    console.log("campaignArrayList", JSON.stringify(this.campaignArrayList, null, 4));
    console.log("this.campaignArrayList.serviceName", this.campaignArrayList.serviceName);


  }
  editableData: any;
  editForm(data) {
    this.showFormFlag = true;
    this.showTableFlag = false;
    this.disableSelection = true;
    this.editableData = data;

    this.getServices(this.service_provider);

  }
  getServices(serviceProviderID) {
    console.log("serviceProviderID", serviceProviderID);
    this.block_provider.getServicesOfProvider(serviceProviderID.serviceProviderId)
      .subscribe(response => this.getServicesSuccesshandeler(response), err => {
        this.message.alert("service error", err);
      });
  }
  getServicesSuccesshandeler(response) {
    this.services_array = response;
    if (this.services_array.length > 0) {
      this.serviceline = this.editableData.serviceName;
      this.getstates();
      this.getCampaign();
    }
  }

  getstates() {
    if (this.editableData.serviceID == "1") {
      this.isNational = true;
    }
    else {
      this.isNational = false;
    }
    console.log("uid", this.commonDataService.uid, this.editableData.serviceID, this.isNational);

    this._callServices.getStates(this.commonDataService.uid, this.editableData.serviceID, this.isNational).subscribe(response => {
      if (response) {
        this.states_array = response;
        console.log('this.states_array', this.states_array);

        if (this.states_array.length > 0) {
          this.states = this.editableData.stateName;
        }
      }
    })
  }


  getCampaign() {
    this._callServices.getCampaign(this.serviceline).subscribe((res) => {
      this.campaign_array = res.campaign;
      console.log('this.campaign_array', this.campaign_array);

      if (this.campaign_array.length > 0) {
        this.campaign = this.editableData.cTI_CampaignName;
      }
    }, (err) => {
      console.log("error campaign", err.errorMessage);

      this.message.alert(err.errorMessage, 'error');
    });

  } 
  resetAllForms() {
    this.mapping_form.resetForm();
    this.mappingCampaign.resetForm();
    this.campaignList = [];
  }

  // filterArray(array: any) {
  //   const o = {};
  //   return array = array
  //     .filter((thing, index, self) => self
  //       .findIndex((t) => {
  //         return t.providerServiceMapID === thing.providerServiceMapID;
  //       }) === index)
  // }
  deleteRow(index) {
    this.campaignList.splice(index, 1);
  }
  updateCampaign() {
    let campaignObj = [{

      'providerServiceMapID': this.editableData.providerServiceMapID,
      'cTI_CampaignName': this.campaign,
    }]
    this._callServices.addCampaign(campaignObj).subscribe((res) => {
      // this.message.alert(res.response);
      this.message.alert('Mapping saved successfully', 'success');
      this.mappingCampaign.resetForm();
      this.campaignList = [];
      this.showFormFlag = false;
      this.showTableFlag = true;
      this.disableSelection = false;
      console.log('Mapping saved successfully', this.service_provider.serviceProviderId);

      this.getAllMappedServicelinesAndStates(this.service_provider.serviceProviderId);     
      this.resetForm();

    }, (err) => {     
      console.log("error", err);   
      this.message.alert(err.errorMessage, 'error');
    })
  }
  resetForm() {
    // this.message.confirm('Confirm','Are you sure want to reset?').subscribe((response) => {
    //   if (response) {
    jQuery('#myForm').trigger('reset');
    this.states_array = [];
    this.services_array = [];
    this.campaign_array = [];

   
    //   }

    // }, (err) => { });
  }
  back() {
    this.message.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.mappingCampaign.resetForm();
        this.showTableFlag = true;
        this.showFormFlag = false;
        this.disableSelection = false;

      }
    })
  }
 
}