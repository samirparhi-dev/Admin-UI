import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockProvider } from '../services/adminServices/AdminServiceProvider/block-provider-service.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from './../services/callservices/callservice.service';
import { NgForm } from '@angular/forms';
import { SuperAdmin_ServiceProvider_Service } from '../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service';

declare var jQuery: any;


@Component({
  selector: 'app-provide-cti-mapping',
  templateUrl: './provide-cti-mapping.component.html',
  styleUrls: ['./provide-cti-mapping.component.css']
})
export class ProvideCtiMappingComponent implements OnInit {

  SP: any;
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
  countryID: any = 1;
  showTableFlag: boolean = false;
  showFormFlag: boolean = false;
  disableSelection: boolean = false;

  @ViewChild('form') mapping_form: NgForm;
  @ViewChild('mappingCampaign') mappingCampaign: NgForm;

  constructor(private block_provider: BlockProvider,
    private message: ConfirmationDialogsService,
    private _callServices: CallServices,
    public commonDataService: dataService, public superadminService: SuperAdmin_ServiceProvider_Service) { }

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
    debugger;
    this.service_provider = service_provider;
    this.SP = service_provider;
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
    debugger;

    this.getAllServicelines();

  }
  getAllStates() {
    debugger;
    this.superadminService.getAllStates(this.countryID)
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all states success handeler');
          this.states_array = response;
          this.states = this.editableData.stateName;
          console.log("states", this.states_array);
        }
      }, err => {
        this.message.alert(err, 'error');
      });
  }

  getAllServicelines() {
    this.superadminService.getAllServiceLines()
      .subscribe(response => {
        if (response) {
          console.log(response, 'get all servicelines success handeler');
          this.services_array = response;
          if (this.services_array.length > 0) {
            this.serviceline = this.editableData.serviceName;
            this.getAllStates();
            this.getCampaign();
          }
        }
      }, err => {
        this.message.alert(err, 'error');
      });
  }
  // getServices(userID) {
  //   console.log("serviceProviderID", userID);
  //   this.block_provider.getServicesOfProvider_CTI(userID)
  //     .subscribe(response => this.getServicesSuccesshandeler(response), err => {
  //       this.message.alert("service error", err);
  //     });
  // }
  // getServicesSuccesshandeler(response) {
  //   this.services_array = response;
  //   if (this.services_array.length > 0) {
  //     this.serviceline = this.editableData.serviceName;
  //     this.getstates();
  //     this.getCampaign();
  //   }
  // }

  // getstates() {
  //   if (this.editableData.serviceID == "1") {
  //     this.isNational = true;
  //   }
  //   else {
  //     this.isNational = false;
  //   }
  //   console.log("uid", this.commonDataService.uid, this.editableData.serviceID, this.isNational);

  //   this._callServices.getStates(this.commonDataService.uid, this.editableData.serviceID, this.isNational).subscribe(response => {
  //     if (response) {
  //       this.states_array = response;
  //       console.log('this.states_array', this.states_array);

  //       if (this.states_array.length > 0) {
  //         this.states = this.editableData.stateName;
  //       }
  //     }
  //   })
  // }


  getCampaign() {
    debugger;
    this._callServices.getCampaign(this.serviceline).subscribe((res) => {
      this.campaign_array = res.campaign;
      console.log('this.campaign_array', this.campaign_array);

      if (this.campaign_array.length > 0) {
        debugger;
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
    debugger;
    let campaignObj = [{

      'providerServiceMapID': this.editableData.providerServiceMapID,
      'cTI_CampaignName': this.campaign,
    }]
    let count = 0;
    for (let a = 0; a < this.campaignArrayList.length; a++) {
      if (this.campaignArrayList[a].providerServiceMapID === campaignObj[0].providerServiceMapID
        && this.campaignArrayList[a].cTI_CampaignName === campaignObj[0].cTI_CampaignName) {
        count = count + 1;
      }
    }
    if (count == 0) {
      this._callServices.addCampaign(campaignObj).subscribe((res) => {
        // this.message.alert(res.response);
        this.message.alert('Mapping saved successfully', 'success');
        //this.mappingCampaign.resetForm();
        this.campaignList = [];
        this.showFormFlag = false;
        this.showTableFlag = true;
        this.disableSelection = false;
        console.log('Mapping saved successfully', this.SP);

        this.getAllMappedServicelinesAndStates(this.SP);
        this.resetForm();

      }, (err) => {
        console.log("error", err);
        this.message.alert(err.errorMessage, 'error');
      })
    }
    else {
      this.message.alert('Alredy exists');
    }
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