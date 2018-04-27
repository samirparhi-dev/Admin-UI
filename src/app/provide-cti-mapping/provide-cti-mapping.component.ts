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

  filterServiceName: any;
  service_provider_array: any = [];
  service_provider: any;
  states_array: any = [];
  state: any;
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

  @ViewChild('form') mapping_form: NgForm;
  @ViewChild('mappingCampaign') mappingCampaign: NgForm;

  constructor(private block_provider: BlockProvider, private message: ConfirmationDialogsService, private _callServices: CallServices) { }

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
  getAllMappedServicelinesAndStates(service_provider, serviceline, state) {
    console.log("campaignObj", service_provider, serviceline, state );
    
    let campaignListObject = {
      "serviceProviderID": service_provider,
      "serviceID": serviceline,
      "stateID": state
    }
    this._callServices.getAllMappedServicelinesAndStates(campaignListObject).subscribe(campaignListResponse =>
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
  getCampaign(serviceline) {
    this.state = "";
    console.log("serviceline", serviceline);
    console.log('this.service_provider.serviceProviderId, serviceline.serviceID',this.service_provider.serviceProviderId, this.serviceline.serviceID);
    this._callServices.getCapmaign({'serviceName':serviceline.serviceName}).subscribe((res) => {
      this.campaign_array = res.campaign;
      this.setIsNational(serviceline.isNational);      
      this.getStatesInService(this.service_provider, this.serviceline);
    }, (err) => {
      console.log("errget campaign", err);
      
      this.message.alert(err, 'error');
    });

  }

  setIsNational(value) {
    if (value) {
      this.state = '';
    }
    this.isNational = value;
    // this.getAllMappedServicelinesAndStates(this.service_provider.serviceProviderId, this.serviceline.serviceID, this.state.stateID);
  }
  getServices(serviceProviderID) {
    console.log("serviceProviderID", serviceProviderID);
    this.block_provider.getServicesOfProvider(serviceProviderID)
      .subscribe(response => this.getServicesSuccesshandeler(response), err => {
        this.message.alert(err, 'error');
      });
  }
  getServicesSuccesshandeler(response) {
    this.services_array = response;
    console.log("services_array", this.services_array);
    
    //this.getAllMappedServicelinesAndStates(this.service_provider.serviceProviderId, this.serviceline.serviceID, this.service_provider.stateID);
  }
  getStatesInService(serviceProviderID, serviceID) {
    const data = {
      'serviceProviderID': serviceProviderID.serviceProviderId,
      'serviceID': serviceID.serviceID
    }
    console.log("data", data);

    this.block_provider.getStatesInServices(data).subscribe(response => {
      this.getStatesSuccesshandeler(response);
      // this.getAllServicesOfProvider(serviceProviderID);
    }, err => {
      this.message.alert(err, 'error');
    });
  }
  getStatesSuccesshandeler(response) {
    this.states_array = response;

    if (this.isNational) {
      this.providerServiceMapID = this.states_array[0].providerServiceMapID;
      console.log("states_array", this.states_array, this.providerServiceMapID);
    }
  }

  showForm() {
    this.showFormFlag = true;
    this.showTableFlag = false;
  }


  addCampaign(serviceProvider: any, serviceline: any, campaign: any) {
    this.filterServiceName = this.campaignArrayList.filter((item) => {
      
      return item.serviceName;

    })
    console.log("filterServiceName", JSON.stringify(this.filterServiceName, null, 4));
    
    console.log("obj", serviceProvider, serviceline, campaign);

    let campignObj = {};
    campignObj['providerName'] = serviceProvider.serviceProviderName;
    campignObj['providerServiceMapID'] = serviceline.providerServiceMapID;
    campignObj['cTI_CampaignName'] = campaign.campaign_name;
    campignObj['Service'] = serviceline.serviceName;
    campignObj['ServiceId'] = serviceline.serviceID;

    if (this.campaignList.length > 0) {
     // this.checkDuplicates(this.mapping_form, this.mappingCampaign);
      this.campaignList.push(campignObj);
      //this.campaignList = this.filterArray(this.campaignList);

    } else {
    //  this.checkDuplicates(this.mapping_form, this.mappingCampaign);
      this.campaignList.push(campignObj);
      console.log("campaignList", this.campaignList);
    }
  }
  resetAllForms() {
    this.mapping_form.resetForm();
    this.mappingCampaign.resetForm();
    this.campaignList = [];
  }
  // checkDuplicates(mapping_form, mappingCampaign) {
  //  console.log("formValue",mapping_form, mappingCampaign);
   
  //   let tempList = [];
  //   tempList= this.campaignArrayList;
    
    

  // }
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
  finalsave(campaignObj) {

    campaignObj = campaignObj.map(function (item) {
      return {
        'providerServiceMapID': item.providerServiceMapID,
        'cTI_CampaignName': item.cTI_CampaignName,
      }
    });
    this._callServices.addCampaign(campaignObj).subscribe((res) => {
      // this.message.alert(res.response);
      this.message.alert('Mapping saved successfully', 'success');
      this.mappingCampaign.resetForm();
      this.campaignList = [];      
      this.showFormFlag = false;
      this.showTableFlag = true;
      console.log('Mapping saved successfully',this.service_provider.serviceProviderId, this.serviceline.serviceID, this.state.stateID);
      
      this.getAllMappedServicelinesAndStates(this.service_provider.serviceProviderId, this.serviceline.serviceID, this.state.stateID);


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
  back() {
    this.message.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.resetAllForms();
        this.showTableFlag = true;
        this.showFormFlag = false;
       
      }
    })
  }
}