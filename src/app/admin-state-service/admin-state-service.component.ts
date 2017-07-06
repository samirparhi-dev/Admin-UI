import { Component, OnInit } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormControl, FormArray, FormGroup } from '@angular/forms';
import { StateServiceMapp } from '../services/adminServices/AdminServiceProvider/Stateservice.service';


@Component({
  selector: 'app-admin-state-service',
  templateUrl: './admin-state-service.component.html',
  styleUrls: ['./admin-state-service.component.css']
})
export class AdminStateServiceComponent implements OnInit {


logoFilePath:any;
//createdBy:any;
		// primaryContactName: new FormControl(),
		// primaryContactNo: new FormControl(),
		// emailID: new FormControl(),
		// address: new FormControl(),
		// validity: new FormControl(),
		// roleName: new FormControl(),
		// roleDescription: new FormControl(),

		// services: new FormControl(),
		// minEducationalQualification: new FormControl(),
		// specialization: new FormControl(),
		// role: new FormControl(),
		// zoneDistrict: new FormControl(),
		// zoneName: new FormControl(),
		// stateParkingPlace: new FormControl(),
		// zoneParkingPlace: new FormControl(),
		// districtParkingPlace: new FormControl(),
		// parkingPlace: new FormControl(),
		// stateServicePoint: new FormControl(),
		// parkingPlaceServicePoint: new FormControl(),
		// servicePoint: new FormControl(),
		// loginID: new FormControl(),
		// pwd: new FormControl(),
		// firstName: new FormControl(),
		// lastName: new FormControl(),
		// education: new FormControl(),
		// employeeID: new FormControl(),
		// aadharNo: new FormControl(),
		// gender: new FormControl(),
		// panNo: new FormControl(),
		// father: new FormControl(),
		// mother: new FormControl(),
		// emergencyContactPerson: new FormControl(),
		// emergencyContactNo: new FormControl(),
		// serviceProviderName: new FormControl('',Validators.required),
		
		// createdDate: new FormControl('2017-01-01'),
		// stateId: new FormControl('1'),
		// joiningDate: new FormControl('2017-01-01')










  public showCreateFlag=false;
  userslist:string[];

  
  //service1:any;
  service:any;
   name:any;
   idx:any;
   idx1:any;
   index:number=0;
  

  stateID = new FormArray([
     new FormControl('stateID')
  ]);
    serviceID=new FormArray([
       new FormControl('serviceID')

    ]);
   formabc = new FormGroup({
     createdDate:new FormControl(),
     createdBy:new FormControl(),
     serviceProviderName:new FormControl(),
    //   primaryContactName: new FormControl(),
		//  primaryContactNo: new FormControl(),
		//  emailID: new FormControl(),
		//  address: new FormControl(),
		//  validity: new FormControl(),
		//  roleName: new FormControl(),
		// roleDescription: new FormControl(),

		// services: new FormControl(),
	  // minEducationalQualification: new FormControl(),
		//  specialization: new FormControl(),
		//  role: new FormControl(),
		//  zoneDistrict: new FormControl(),
		//  zoneName: new FormControl(),
		// stateParkingPlace: new FormControl(),
		//  zoneParkingPlace: new FormControl(),
		//  districtParkingPlace: new FormControl(),
		//  parkingPlace: new FormControl(),
		// stateServicePoint: new FormControl(),
		//  parkingPlaceServicePoint: new FormControl(),
		//  servicePoint: new FormControl(),
		// loginID: new FormControl(),
		//  pwd: new FormControl(),
		//  firstName: new FormControl(),
		//  lastName: new FormControl(),
		//  education: new FormControl(),
		//  employeeID: new FormControl(),
		// aadharNo: new FormControl(),
		//  gender: new FormControl(),
		//  panNo: new FormControl(),
		//  father: new FormControl(),
		//  mother: new FormControl(),
		//  emergencyContactPerson: new FormControl(),
     stateId:new FormControl(),
     stateID: this.stateID,
     serviceID:this.serviceID,
     
   });
   
   push() {
     this.stateID.push(new FormControl(''));
     
     
   }

      push1() {
     
     this.serviceID.push(new FormControl(''));
     
   }

   splice(idx){
     console.log(idx);
     this.stateID.removeAt(idx);
      

   }
splice1(idx1){
     console.log(idx1);
     this.serviceID.removeAt(idx1);
      

   }
   
  constructor(private Service: StateServiceMapp) { 
  this.userslist;
   
    this.name = 'State'
    this.service="Services"
    //this.logoFilePath=Service.data1.logoFilePath
    //this.formabc.controls.createdBy =Service.data1.createdBy
  }


  ngOnInit() {
    console.log(this.formabc.controls.createdBy);
    //   this.service.getUsers()
	 	// .subscribe(resProviderData => this.providers(resProviderData));
  }
//   showCreate(){
// 		this.showCreateFlag=!this.showCreateFlag;
// 	}
  onSubmit() {
    console.log(this.Service.data1.createdBy  );
    // this.formabc.controls.createdBy.setValue(this.Service.data1.createdBy); 
    this.formabc.controls.createdBy.setValue('test'); 
    this.formabc.controls.createdDate.setValue(this.Service.data1.createdDate);
    this.formabc.controls.serviceProviderName.setValue(this.Service.data1.serviceProviderName);
    this.formabc.controls.stateId.setValue(this.Service.data1.stateId);
    // this.formabc.controls.primaryContactName.setValue(this.Service.data1.primaryContactName);
    // this.formabc.controls.emailID.setValue(this.Service.data1.emailID);
    // this.formabc.controls.address.setValue(this.Service.data1.address);
    // this.formabc.controls.validity.setValue(this.Service.data1.validity);
    // this.formabc.controls.roleName.setValue(this.Service.data1.roleName);
    // this.formabc.controls.roleDescription.setValue(this.Service.data1.roleDescription);
    // this.formabc.controls.Services.setValue(this.Service.data1.Services);
    // this.formabc.controls.minEducationalQualification.setValue(this.Service.data1.minEducationalQualification);
    // this.formabc.controls.role.setValue(this.Service.data1.role);
    // this.formabc.controls.specialization.setValue(this.Service.data1.specialization);
    // this.formabc.controls.zoneDistrict.setValue(this.Service.data1.zoneDistrict);
    // this.formabc.controls.zoneName.setValue(this.Service.data1.zoneName);
    // this.formabc.controls.parkingPlace.setValue(this.Service.data1.parkingPlace);
    // this.formabc.controls.districtParkingPlace.setValue(this.Service.data1.districtParkingPlace);
    // this.formabc.controls.zoneParkingPlace.setValue(this.Service.data1.zoneParkingPlace);
    // this.formabc.controls.stateParkingPlace.setValue(this.Service.data1.stateParkingPlace);
    // this.formabc.controls.servicePoint.setValue(this.Service.data1.servicePoint);
    // this.formabc.controls.stateServicePoint.setValue(this.Service.data1.stateServicePoint);
    // this.formabc.controls.parkingPlaceServicePoint.setValue(this.Service.data1.parkingPlaceServicePoint);
    // this.formabc.controls.loginID.setValue(this.Service.data1.loginID);
    // this.formabc.controls.firstName.setValue(this.Service.data1.firstName);
    // this.formabc.controls.lastName.setValue(this.Service.data1.lastName);
    // this.formabc.controls.pwd.setValue(this.Service.data1.pwd);



    
		let bodyString = this.formabc.value;
		console.log(this.formabc.value);
    //console.log(this.Service.data1);
    //var dummyobj=this.Service.data1;
    //console.log('while fetching',this.Service.data1);
    
		this.Service.saveUser(bodyString)
			.subscribe(resProviderData => this.showUsers(resProviderData));
	//	this.showCreate();
	}
  showUsers(data) {
		console.log(JSON.parse(data));
	}
  providers(data) {
    this.userslist=data;
		console.log(data);
	}
  
 }
  


