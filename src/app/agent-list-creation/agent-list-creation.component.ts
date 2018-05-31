import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AgentListCreationService } from '../services/ProviderAdminServices/agent-list-creation-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-agent-list-creation',
  templateUrl: './agent-list-creation.component.html',
  styleUrls: ['./agent-list-creation.component.css']
})
export class AgentListCreationComponent implements OnInit {

  serviceProviderID: any;
  providerServiceMapID: any;
  radio_option: any;

  state: any;
  service: any;
  campaign_name: any;
  agent_ID: any;
  password: any;
  editMode: boolean = false;
  states: any = [];
  services: any = [];
  campaignNames: any = [];
  resultArray: any = [];
  agentLists: any = [];
  usrAgentMappingID: any;
  disableButtonFlag = true;
  userID: any;
  isNational = false;
  showFormFlag: boolean = false;
  showTableFlag: boolean = false;
  disableSelection: boolean = false;
  editable: any = false;

  @ViewChild('agentListCreationForm') agentListForm: NgForm;


  constructor(public _AgentListCreationService: AgentListCreationService,
    public commonDataService: dataService,
    public alertService: ConfirmationDialogsService) {
    this.serviceProviderID = this.commonDataService.service_providerID;
  }

  ngOnInit() {
    this.radio_option = '1';
    this.userID = this.commonDataService.uid;
    console.log("userID", this.
    userID);
    this.getServices(this.userID);
  }

  setIsNational(value) {
    this.isNational = value;
    if (value) {
      this.state = '';
    }
  }

  getStates(serviceID, isNational) {
    this.state = '';
    this._AgentListCreationService.getStates(this.userID, serviceID, isNational)
      .subscribe(response => this.getStatesSuccessHandeler(response, isNational), (err) => console.log("Error", err));
      //this.alertService.alert(err, 'error'));

  }

  getStatesSuccessHandeler(response, isNational) {
    console.log('STATE', response);
    this.states = response;
    if (isNational) {
      this.setProviderServiceMapID(this.states[0].providerServiceMapID);
    }
  }

  getServices(userID) {
    // this.service = '';
    this._AgentListCreationService.getServices(userID)
      .subscribe(response => this.getServicesSuccessHandeler(response), (err) => console.log("Error", err));//
      //this.alertService.alert(err, 'error'));
  }

  getServicesSuccessHandeler(response) {
    console.log('SERVICES', response);
    this.services = response;
  }

  setProviderServiceMapID(providerServiceMapID) {
    console.log('providerServiceMapID', providerServiceMapID);
    this.providerServiceMapID = providerServiceMapID;
    this.getAllAgents(this.providerServiceMapID);
  }

  getAllAgents(providerServiceMapID) {
    console.log("providerServiceMapID", providerServiceMapID);

    this._AgentListCreationService.getAllAgents(providerServiceMapID).subscribe((agentsResponse) =>
      this.agentsListSuccessHandler(agentsResponse),
      (err) => { console.log("Error", err) });
  }
  agentsListSuccessHandler(agentsResponse) {
    console.log('Agents list', agentsResponse);
    this.agentLists = agentsResponse;
    this.showTableFlag = true;
    this.showFormFlag = false;
    this.editable = false;

  }
  getCampaignNames(serviceName) {
    debugger;
    this._AgentListCreationService.getCampaignNames(serviceName)
      .subscribe(response => this.getCampaignNamesSuccessHandeler(response), (err) => console.log("Error", err));
      // this.alertService.alert(err, 'error'));

  }

  getCampaignNamesSuccessHandeler(response) {
    if (response) {
      this.campaignNames = response.campaign;
    }
  }

  reset() {
    this.agent_ID = '';
    this.resultArray = [];
    this.password = '';
  }

  showForm() {
    this.radio_option = '1';
    this.showFormFlag = true;
    this.showTableFlag = false;
    this.disableSelection = true;

  }
  back() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.agentListForm.resetForm();
        this.campaign_name = undefined;
        this.agent_ID = '';
        this.password = '';
        this.showTableFlag = true;
        this.showFormFlag = false;
        this.editable = false;
        this.editMode = false;

      }
    })
  }
  validate_one(agentID) {
    this.resultArray = [];

    if (agentID != '' || agentID != null || agentID != undefined) {
      // var obj=
      // {
      // 	"agentID":agentID
      // }

      var obj = {
        'agentID': parseInt(agentID),
        'agentPassword': this.password,
        'providerServiceMapID': this.providerServiceMapID,
        'cti_CampaignName': this.campaign_name,
        'createdBy': this.commonDataService.uname
      }
      console.log("agent obj", obj);

      this.resultArray.push(obj);
    }

    console.log('Result from 1', this.resultArray);


    if (this.resultArray.length > 0) {
      let tick = 0;
      for (let z = 0; z < this.resultArray.length; z++) {
        if (this.resultArray[z].agentID.toString()[0] === "2" ||
          this.resultArray[z].agentID.toString()[0] === "3" ||
          this.resultArray[z].agentID.toString()[0] === "4") {
          console.log("Validate One",this.resultArray[z].agentID.toString()[0]);
          tick = tick + 1;
        }
      }

      if (tick > 0) {

        return 'GO';
      }

    }

  }

  validate_two(agentID) {
    this.resultArray = [];

    var items = agentID.split(",");
    for (let i = 0; i < items.length; i++) {

      // let obj=
      // {
      // 	"agentID":parseInt(items[i])
      // }

      if (items[i].length === 0) {
        continue;
      }

      var obj = {
        'agentID': parseInt(items[i]),
        'agentPassword': this.password,
        'providerServiceMapID': this.providerServiceMapID,
        'cti_CampaignName': this.campaign_name,
        'createdBy': this.commonDataService.uname
      }

      if (this.resultArray.length == 0) {
        this.resultArray.push(obj);
      } else {
        var count = 0;
        for (var k = 0; k < this.resultArray.length; k++) {
          if (this.resultArray[k].agentID === obj.agentID) {
            count = count + 1;
          }
        }

        if (count === 0) {
          this.resultArray.push(obj);
        }
      }


    }
    console.log('Result from 2', this.resultArray);

    if (this.resultArray.length > 0) {
      let tick = 0;
      for (let z = 0; z < this.resultArray.length; z++) {
        if (this.resultArray[z].agentID.toString()[0] === "2" ||
          this.resultArray[z].agentID.toString()[0] === "3" ||
          this.resultArray[z].agentID.toString()[0] === "4") {
          console.log(this.resultArray[z].agentID.toString()[0]);
          tick = tick + 1;
        }
      }

      if (tick > 0) {

        return "GO";
      }
    }
  }

  validate_three(agentID) {
    this.resultArray = [];

    var hyphen_items = agentID.split("-");
    if (hyphen_items.length == 2 && hyphen_items[0].length > 0 && hyphen_items[1].length > 0 && parseInt(hyphen_items[1]) > parseInt(hyphen_items[0])) {
      var no_of_items = (parseInt(hyphen_items[1]) - parseInt(hyphen_items[0])) + 1;
      for (let j = 0; j < no_of_items; j++) {
        // let obj=
        // {
        // 	"agentID":parseInt(hyphen_items[0])+j
        // }

        var obj = {
          'agentID': parseInt(hyphen_items[0]) + j,
          'agentPassword': this.password,
          'providerServiceMapID': this.providerServiceMapID,
          'cti_CampaignName': this.campaign_name,
          'createdBy': this.commonDataService.uname
        }

        if (this.resultArray.length == 0) {
          this.resultArray.push(obj);
        } else {
          var count = 0;
          for (var i = 0; i < this.resultArray.length; i++) {
            if (this.resultArray[i].agentID === obj.agentID) {
              count = count + 1;
            }
          }

          if (count === 0) {
            this.resultArray.push(obj);
          }
        }
      }
    }

    if (this.resultArray.length > 0) {
      let tick = 0;
      for (let z = 0; z < this.resultArray.length; z++) {
        if (this.resultArray[z].agentID.toString()[0] === "2" ||
          this.resultArray[z].agentID.toString()[0] === "3" ||
          this.resultArray[z].agentID.toString()[0] === "4") {
          console.log(this.resultArray[z].agentID.toString()[0]);
          tick = tick + 1;
        }
      }

      if (tick > 0) {
        return "GO";
      }
    }


    console.log('Result from 3', this.resultArray);
  }


  map(choice) {
    var result = '';
    if (choice === "1") {
      result = this.validate_one(this.agent_ID);
    }
    if (choice === "2") {
      result = this.validate_two(this.agent_ID);
    }
    if (choice === "3") {
      result = this.validate_three(this.agent_ID);
    }

    if (result === "GO") {
      this._AgentListCreationService.saveAgentListMapping(this.resultArray)
        .subscribe(response => this.saveSuccessHandeler(response),
          (err) => console.log("Error", err));
          // this.alertService.alert(err, 'error'));
    }
    else {
      this.alertService.alert('Invalid entry in agent ID', 'error');
    }

  }

  saveSuccessHandeler(response) {
    if (response) {
      if (response.length > 0) {
        this.alertService.alert('Saved successfully', 'success');
        this.agentListForm.resetForm();
        this.showFormFlag = false;
        this.getAllAgents(this.providerServiceMapID);
      }
      if (response.length == 0) {
        this.alertService.alert('Mapping  already exists');
      }
    }
  }


  resetFields() {
    // this.state = "";
    // this.service = "";
    // this.campaign_name = "";
    // this.agent_ID = "";
    // this.password = "";

    this.isNational = false;
    this.agentListForm.reset();


    //    this.radio_option = '1';

    this.states = [];
    this.campaignNames = [];
    this.resultArray = [];
  }



  multiagents: any = [];
  rangeagents: any = [];
  editAgentCampaign(data) {
    console.log("data", data);
    // this.service = data.service,
    // this.state = data.state,    
    this.radio_option = '1';
    this.campaign_name = data.cti_CampaignName;
    this.editMode = true;
    // this.radio_option = data.radio_option
    this.agent_ID = data.agentID;
    this.password = data.agentPassword;
    this.editable = true;
    this.usrAgentMappingID = data.usrAgentMappingID;
  }
  updateAgent(formValue) {
    let updateAgentObj = {

      'agentID': formValue.agent_ID,
      'agentPassword': formValue.password,
      'providerServiceMapID': formValue.providerServiceMapID,
      'cti_CampaignName': formValue.campaign_name,
      'usrAgentMappingID': this.usrAgentMappingID,
    }
    console.log('Data to be update', updateAgentObj);

    this._AgentListCreationService.editAgentDetails(updateAgentObj).subscribe(response => {
      console.log("updated obj", response);
      this.alertService.alert('Updated successfully', 'success');
      this.agentListForm.resetForm();
      // this.campaign_name = undefined;
      // this.agent_ID = '';
      // this.password = '';
      this.showTableFlag = true;
      this.showFormFlag = false;
      this.editable = false;
      this.editMode = false;
      /* resetting form and ngModels used in editing */
      this.getAllAgents(this.providerServiceMapID);
      // this.showTableFlag = true;

    }, (err) => console.log("Error", err));
    //this.alertService.alert(err, 'error'));




  }

}
