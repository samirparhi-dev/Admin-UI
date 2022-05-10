import { Component, OnInit, ViewChild } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { MdDialog} from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { FetosenseDeviceIdMasterService } from 'app/services/ProviderAdminServices/fetosense-device-id-master-service.service';

/**
 * Author: DE40034072
 * Date: 29-06-2021
 * Objective: # Component for creating Fetosense device master
 */

@Component({
  selector: 'app-device-id-master',
  templateUrl: './device-id-master.component.html',
  styleUrls: ['./device-id-master.component.css']
})
export class DeviceIdMasterComponent implements OnInit {

 
  /*ngModels*/
  serviceProviderID: any;
  providerServiceMapID: any;
  state: any;
  service: any;
  searchTerm:any;
  deviceID: any;
  deviceName: any;
  typeExists: any;
  userID: any;
  editObject: any;

  /*arrays*/
  states: any = [];
  services: any = [];
  searchResultArray: any = [];
  bufferArray: any = [];
  filteredsearchResultArray: any = [];
  availableDeviceIds: any=[];

  /*flags*/
  showTableFlag: boolean = false;
  showFormFlag: boolean = false;
  disableSelection: boolean = false;
  isNational = false;
  editFormFlag:boolean=false;
  deviceIdExist: boolean=false;

  @ViewChild('searchFields') searchFields: NgForm;
  @ViewChild('createDeviceIdForm') createDeviceIdForm: NgForm;
  @ViewChild('editDeviceIdForm') editDeviceIdForm: NgForm;
  


  constructor( public fetosenseDeviceMasterService: FetosenseDeviceIdMasterService,
    public commonDataService: dataService,
    public dialog: MdDialog,
    public alertService: ConfirmationDialogsService) {

    this.serviceProviderID = this.commonDataService.service_providerID;
    this.userID = this.commonDataService.uid;

  }

  ngOnInit() {
    this.getServicesLines(this.userID);
  }




  getServicesLines(userID) {
    this.fetosenseDeviceMasterService.getServiceLines(userID)
      .subscribe(response => {
        if (response && response.statusCode === 200 && response.data) {
          let result = response.data.filter(item => {
            if (item.serviceID === 4) {
              return item;
            }
          });
          this.serviceLineSuccessHandeler(result)
        }
        else
        {
          this.alertService.alert(response.errorMessage, 'error')
        }

       
      }, err => {
       
        this.alertService.alert(err, 'error');
      });
  }

  serviceLineSuccessHandeler(response) {
   
    this.services = response.filter(function (item) {
     
        return item;
      
    });

    this.searchTerm=null;
  }

  getStates(serviceID, isNational) {
    this.fetosenseDeviceMasterService.getStates(this.userID, serviceID, isNational)
      .subscribe(response => 
        {   
          if (response && response.statusCode === 200 && response.data) {
        
            this.getStatesSuccessHandeler(response.data)
          }
          else
          {
            this.alertService.alert(response.errorMessage, 'error')
          }
        
                
      }, err => {
        this.alertService.alert(err, 'error');
      });
  }

  getStatesSuccessHandeler(response) {
    this.state = '';
    this.states = response;
    this.searchTerm=null;
    this.searchResultArray = [];
    this.filteredsearchResultArray = [];
  }

  setProviderServiceMapID(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    this.getFetosenseDeviceIdMaster(providerServiceMapID);
  }

  getFetosenseDeviceIdMaster(providerServiceMapID) {
    this.fetosenseDeviceMasterService.getFetosenseDeviceMaster(providerServiceMapID)
      .subscribe(response => {
        if (response && response.statusCode === 200 && response.data) {
            this.getFetosenseDeviceSuccessHandeler(response.data)
        } 
        else
        {
          this.alertService.alert(response.errorMessage, 'error')
        }
      }, err => {
        this.alertService.alert(err, 'error');
      
      })

     
  }

  getFetosenseDeviceSuccessHandeler(response) {
    if (response) {
      this.showTableFlag = true;
      this.searchResultArray = response.fetosenseDeviceIDs;
      this.filteredsearchResultArray = response.fetosenseDeviceIDs;
      this.searchTerm=null;
      this.availableDeviceIds=[];
      for (let availableDeviceId of this.searchResultArray) {
        this.availableDeviceIds.push(availableDeviceId.deviceID);
    }
    }
  }



  showCreateForm() {
    this.showTableFlag = false;
    this.showFormFlag = true;
    this.editFormFlag=false;

    this.disableSelection = true;
  }
  navigateToPrev() {
    this.alertService.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        this.back();
        this.getFetosenseDeviceIdMaster(this.providerServiceMapID);
      }
    })
  }
  back() {
    if(this.showFormFlag === true)
    {
        this.createDeviceIdForm.reset();
    }    
    if(this.editFormFlag === true)
    {
        this.editDeviceIdForm.reset();
    }   

    this.showTableFlag = true;
    this.showFormFlag = false;
    this.editFormFlag=false;
    this.bufferArray = [];
     this.searchTerm=null;
    this.disableSelection = false;
    this.deviceIdExist=false;
  }


  toggleDeactivate(data, isDeleted) {

   if(data.vanID && data.vanID!== null && data.vanID !== undefined && data.deactivated === false)
   {
    this.alertService.alert("Please Deactivate the Spoke DeviceId Mapping First",'info')
   }
   else{
    this.deactivateDeviceIdMaster(data, isDeleted);
   }
}

deactivateDeviceIdMaster(data, isDeleted) {
  this.alertService.confirm('Confirm', "Are you sure you want to Deactivate?").subscribe(response => {
    if (response) {
      let obj = {
        "VfdID":  data.VfdID,
        "deviceName": (data.deviceName !== undefined && data.deviceName !== null) ? data.deviceName.trim() : null,
        "deviceID": data.deviceID,
        "vanID": data.vanID,
        "parkingPlaceID": data.parkingPlaceID,
        "vanTypeID": data.vanTypeID,
        "vanName": data.vanName,
        "providerServiceMapID":  data.providerServiceMapID,
        "deactivated": data.deactivated,
        "deleted": isDeleted,
        "processed":  data.processed,
        "createdBy":  data.createdBy,
        "modifiedBy": this.commonDataService.uname
      };

      this.fetosenseDeviceMasterService.toggle_activate_DeviceMaster(obj)
        .subscribe(respValue => 
        {
          if (respValue && respValue.statusCode === 200 && respValue.data) {
          this.toggleActivateSuccessHandeler(respValue.data, "Deactivated")
          }
          else
          {
            this.alertService.alert(respValue.errorMessage, 'error')
          }

        }, err => {
          
          this.alertService.alert(err, 'error');
        })
    }
  });
}

  toggleActivate(data, isDeleted) {
  
      this.alertService.confirm('Confirm', "Are you sure you want to Activate?").subscribe(response => {
        if (response) {
          let obj =  {
            "VfdID":  data.VfdID,
            "deviceName": (data.deviceName !== undefined && data.deviceName !== null) ? data.deviceName.trim() : null,
            "deviceID": data.deviceID,
            "vanID": data.vanID,
            "parkingPlaceID": data.parkingPlaceID,
            "vanTypeID": data.vanTypeID,
            "vanName": data.vanName,
            "providerServiceMapID":  data.providerServiceMapID,
            "deactivated": data.deactivated,
            "deleted": isDeleted,
            "processed":  data.processed,
            "createdBy":  data.createdBy,
            "modifiedBy": this.commonDataService.uname
          };

          this.fetosenseDeviceMasterService.toggle_activate_DeviceMaster(obj)
            .subscribe(responseValue => {

              if (responseValue && responseValue.statusCode === 200 && responseValue.data) {
                this.toggleActivateSuccessHandeler(responseValue.data, "Activated")
                }
                else
                {
                  this.alertService.alert(responseValue.errorMessage, 'error')
                }

             
            }, err => {
             
              this.alertService.alert(err, 'error');
            })
        }
      });

  }

  toggleActivateSuccessHandeler(response, action) {
    console.log(response, "delete Response");
    if (response) {
      this.alertService.alert(action + " Successfully", 'success')
      this.searchTerm=null;
      this.getFetosenseDeviceIdMaster(this.providerServiceMapID);
    }
  }

  addObj(deviceId, deviceName) {
    let obj = {

      "deviceID": deviceId,
      "deviceName": (deviceName !== undefined && deviceName !== null) ? deviceName.trim() : null,
      "providerServiceMapID": this.providerServiceMapID,
      "createdBy": this.commonDataService.uname
    }
    console.log("created", this.commonDataService.uname);

    if (this.bufferArray.length === 0 && (obj.deviceID !== "" && obj.deviceID !== undefined)) {

      let countMasterArray = 0;
      for (var resValue of this.searchResultArray) {
        if (obj.deviceID === resValue.deviceID) {
          countMasterArray = countMasterArray + 1;
        }
      }
      if (countMasterArray === 0 && (obj.deviceID !== "" && obj.deviceID !== undefined)) {
        this.bufferArray.push(obj);
      }
      else {
        this.alertService.alert("Device ID Already exists");
      }
    
    
    }
    else {
      this.checkDeviceIDExistInBufferArray(obj);
   
    }
    this.createDeviceIdForm.resetForm();

 

  }

  checkDeviceIDExistInBufferArray(obj)
    {
  
      let count = 0;
      for (var value of this.bufferArray) {
        if (obj.deviceID === value.deviceID) {
          count = count + 1;
        }
      }

      let countMasterArray = 0;
      for (var resValues of this.searchResultArray) {
        if (obj.deviceID === resValues.deviceID) {
          countMasterArray = countMasterArray + 1;
        }
      }

    
      if (count === 0 && countMasterArray === 0 && (obj.deviceID !== "" && obj.deviceID !== undefined)) {
        this.bufferArray.push(obj);
      }
      else {
        this.alertService.alert("Device ID Already Exists");
      }
    }

  removeObj(index) {
    this.bufferArray.splice(index, 1);
  }

  saveDeviceMasterDetails() {
    this.fetosenseDeviceMasterService.saveFetosenseDeviceMaster(this.bufferArray)
      .subscribe(response =>
       {
        if (response && response.statusCode === 200 && response.data) {
          this.saveSuccessHandeler(response.data)
        }
        else
        {
          this.alertService.alert(response.errorMessage, 'error')
        }
        
        }, err => {
        this.alertService.alert(err, 'error');
      });
  }

  saveSuccessHandeler(response) {
    console.log("response", response);
    if (response) {
      this.alertService.alert("Device ID Saved Successfully", 'success');
      this.back();
      this.getFetosenseDeviceIdMaster(this.providerServiceMapID);
    }
  }


  checkExistance(deviceIdvalue) {

    if(this.editObject.deviceID === deviceIdvalue)
    {
      this.deviceIdExist=false;
    }
    else
    {
      this.deviceIdExist = this.availableDeviceIds.includes(deviceIdvalue);
    }
      
   
  }



  openEditForm(toBeEditedOBJ) {
    this.showTableFlag = false;
    this.showFormFlag = false;
    this.editFormFlag=true;
    this.disableSelection = true;
    
    this.deviceID = toBeEditedOBJ.deviceID;
    this.deviceName = (toBeEditedOBJ.deviceName !== undefined && toBeEditedOBJ.deviceName !== null) ? toBeEditedOBJ.deviceName.trim() : null;
    this.editObject=toBeEditedOBJ;
   
  }


  updateDeviceMasterDetails(editedDeviceId,editedDeviceName) {

    let obj = {
      "VfdID":  this.editObject.VfdID,
      "deviceName":  (editedDeviceName !== undefined && editedDeviceName !== null) ? editedDeviceName.trim() : null,
      "deviceID":  editedDeviceId,
      "vanID": this.editObject.vanID,
      "parkingPlaceID": this.editObject.parkingPlaceID,
      "vanTypeID": this.editObject.vanTypeID,
      "vanName": this.editObject.vanName,
      "providerServiceMapID":  this.editObject.providerServiceMapID,
      "deactivated": this.editObject.deactivated,
      "deleted":  this.editObject.deleted,
      "processed":  this.editObject.processed,
      "createdBy":  this.editObject.createdBy,
      "modifiedBy": this.commonDataService.uname
  
  }
  this.fetosenseDeviceMasterService.editFetosenseDeviceMaster(obj)
    .subscribe(response => 
      {
        if (response && response.statusCode === 200 && response.data) {
        this.updateSuccessHandeler(response)
        }
        else
        {
          this.alertService.alert(response.errorMessage, 'error')
        }
      }, err => {
      this.alertService.alert(err, 'error');
     
    });


  }




  updateSuccessHandeler(response) {
    console.log(response, "edit response success");
    if (response) {
      this.alertService.alert("Device ID Updated Successfully", 'success');
      this.back();
        this.getFetosenseDeviceIdMaster(this.providerServiceMapID);
    }
  }
 
 
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchResultArray = this.searchResultArray;
    } else {
      this.filteredsearchResultArray = [];
      this.searchResultArray.forEach((item) => {
        for (let key in item) {
          if (key === 'deviceID' || key === 'deviceName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchResultArray.push(item); break;
            }
          }
        }
      });
    }

  }

}



