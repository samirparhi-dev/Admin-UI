import { Component, OnInit } from '@angular/core';
import { ProviderAdminRoleService } from '../services/ProviderAdminServices/state-serviceline-role.service';
import { dataService } from '../services/dataService/data.service';


@Component({
    selector: 'app-provider-admin-role-master',
    templateUrl: './provider-admin-role-master.component.html',
    styleUrls: ['./provider-admin-role-master.component.css']
})
export class ProviderAdminRoleMasterComponent implements OnInit {
    role: any;
    description: any;
    feature:any;

    serviceProviderID: any;
    provider_service_mapID: any=11;  // has to be dynamic, as of now hardcoded

    state: any;
    service: any;

    toBeEditedRoleObj: any;
    

    // arrays
    states: any;
    services: any;
    searchresultarray: any;

    objs: any = [];
    finalResponse: any;
    disableSelection: boolean = false;
    selectedRole : any;
    STATE_ID: any;
    SERVICE_ID: any;

    features: any = [];

    hideAdd: boolean = false;
    // flags
    showRoleCreationForm: boolean = false;
    setEditSubmitButton: boolean = false;
    showAddButtonFlag: boolean = false;

    constructor(public ProviderAdminRoleService: ProviderAdminRoleService,
                public commonDataService: dataService) 
    {
        this.role = "";
        this.description = "";

        // provide service provider ID, (As of now hardcoded, but to be fetched from login response)
        this.serviceProviderID =(this.commonDataService.service_providerID).toString();

        // array initialization
        this.states = [];
        this.services = [];
        this.searchresultarray = [];
        

    }

    ngOnInit() {
        this.ProviderAdminRoleService.getStates(this.serviceProviderID).subscribe(response=>this.states=this.successhandeler(response));
        this.ProviderAdminRoleService.getFeature(this.provider_service_mapID).subscribe(response=>this.getFeaturesSuccessHandeler(response));
     //    this.ProviderAdminRoleService.getRoles(this.serviceProviderID,"","").subscribe(response => this.searchresultarray = this.fetchRoleSuccessHandeler(response));
    }

    getServices(stateID) {
        console.log(this.serviceProviderID,stateID);
        this.ProviderAdminRoleService.getServices(this.serviceProviderID, stateID).subscribe(response => this.servicesSuccesshandeler(response));
    }

    setProviderServiceMapID(ProviderServiceMapID)
    {
        this.commonDataService.provider_serviceMapID = ProviderServiceMapID;
        console.log("psmid", ProviderServiceMapID);
    }

    servicesSuccesshandeler(response)
    {
        this.service = "";
        this.services = response;
        this.showAddButtonFlag = false;

    }

    getFeaturesSuccessHandeler(response)
    {
        console.log("features",response);
        this.features=response;
    }
    correctInput: boolean = false;
    showAddButton : boolean = false;;
    findRoles(stateID, serviceID) {
        this.showAddButtonFlag = true;
        this.STATE_ID = stateID;
        this.SERVICE_ID = serviceID;
       
        console.log(this.serviceProviderID, stateID,serviceID);
        this.ProviderAdminRoleService.getRoles(this.serviceProviderID, stateID, serviceID).subscribe((response) => {
            this.searchresultarray = this.fetchRoleSuccessHandeler(response);
        });

        if(serviceID == "" || serviceID == undefined) {
            this.correctInput = false;
        }
        else {
            this.correctInput = true;
               this.showAddButton = true;

        }
     
    }

    finalsave() {
        console.log(this.objs);

        this.ProviderAdminRoleService.createRoles(this.objs).subscribe(response => this.createRolesSuccessHandeler(response));
        
    }

    deleteRole(roleID)
    {
        let confirmation=confirm("Do you really want to delete the role with id:"+roleID+"?");
        if(confirmation)
        {
            this.ProviderAdminRoleService.deleteRole(roleID).subscribe(response => this.edit_delete_RolesSuccessHandeler(response));    
        }
        
    }

    editRole(roleObj)
    {

        this.setRoleFormFlag(true);
        this.role = roleObj.roleName;
        this.selectedRole = roleObj.roleName;
        this.description = roleObj.roleDesc;
        this.setEditSubmitButton = true;
        this.toBeEditedRoleObj = roleObj;
        this.hideAdd = false;
 
    }

    saveEditChanges()
    {
      
        let obj = {
            "roleID": this.toBeEditedRoleObj.roleID,
            "roleName": this.role,
            "roleDesc": this.description,
            "providerServiceMapID": this.toBeEditedRoleObj.providerServiceMapID,
            "createdBy": "Diamond Khanna",
            "createdDate": "2017-07-25T00:00:00.000Z"
        }
      
        this.ProviderAdminRoleService.editRole(obj).subscribe(response => this.edit_delete_RolesSuccessHandeler(response));
    }

    edit_delete_RolesSuccessHandeler(response)
    {

        console.log(response, "edit/delete response");
        this.showRoleCreationForm=false;
        this.setEditSubmitButton=false;
        this.findRoles(this.STATE_ID, this.SERVICE_ID);
        this.role = "";
        this.description = "";
        this.objs= [];
         this.selectedRole = undefined;
    }

    successhandeler(response)
    {
        return response;
    }
    noRecordFound: boolean = false;
    fetchRoleSuccessHandeler(response)
    {
        
        console.log(response, "in fetch role success in component.ts");
        if(response.length == 0){
            this.noRecordFound = true;
        }
        else {
            this.noRecordFound = false;
        }
        // this.showAddButtonFlag = true;
        response = response.filter(function(obj){
            return obj.deleted!=true;
        })
        return response;
    }

    createRolesSuccessHandeler(response) {
        console.log(response, "in create role success in component.ts");
        this.finalResponse = response;
        if (this.finalResponse[0].roleID)
        {
            this.objs = []; //empty the buffer array
            this.setRoleFormFlag(false);
            this.findRoles(this.STATE_ID, this.SERVICE_ID);
        }
        
    }


    setRoleFormFlag(flag)
    {
        this.hideAdd = true;
        this.setEditSubmitButton = false;
        this.showRoleCreationForm = flag;
        this.showAddButtonFlag= !flag;
        this.disableSelection = flag;
        if (!flag) {
            this.role = "";
            this.description = "";
            this.feature="";
            this.selectedRole = undefined;
        }
        
    }

    add_obj(role,desc,feature)
    {
        var result = this.validateRole(role);
        if(result)
        {    
            let count = 0;
            if(this.objs.length<1)
            {   
                let obj = {
                    "roleName": role,
                    "roleDesc": desc,
                    "feature":feature,
                    "createdBy":"diamond",
                    "createdDate":"2017-07-28",
                    "providerServiceMapID": this.commonDataService.provider_serviceMapID    // this needs to be fed dynmically!!!
                };
                this.objs.push(obj);
                console.log(obj, "obj pushed");
            }
            else
            {
                for (let i = 0; i < this.objs.length; i++) {
                    if (this.objs[i].roleName === role) {
                        count = count + 1;
                    }
                }
                if(count<1)
                {
                    let obj = {
                        "roleName": role,
                        "roleDesc": desc,
                        "createdBy": "diamond",
                        "createdDate": new Date(),
                        "providerServiceMapID": this.commonDataService.provider_serviceMapID   //this needs to be fed dynmically!!!
                    };
                    this.objs.push(obj);
                    console.log(obj,"obj pushed");
                }
            }
        }
        this.role = "";
        this.description = "";
        this.feature="";
    }
    othersExist: boolean = false;
    validateRole(role) {
        if(this.selectedRole!=undefined && this.selectedRole.toUpperCase() === role.toUpperCase()) {
           
            this.othersExist = false;
        }
        else {
            var count = 0;
            for (let i = 0; i < this.searchresultarray.length; i++) {
                console.log((this.searchresultarray[i].roleName).toUpperCase());
                if ((this.searchresultarray[i].roleName).toUpperCase() === role.toUpperCase()) {
                    count = count + 1;
                }
            }
            console.log(count);
            if (count > 0) {
                this.othersExist = true;
                return false;
            }
            else {
                this.othersExist = false;
                return true;
            }
        }




    }

    remove_obj(index)
    {
        this.objs.splice(index, 1);
    }

}
