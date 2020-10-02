import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { SmsTemplateService } from 'app/services/adminServices/SMSMaster/sms-template-service.service';
import { dataService } from 'app/services/dataService/data.service';
import { AgentListCreationService } from 'app/services/ProviderAdminServices/agent-list-creation-service.service';
import { MdDialog } from '@angular/material';
import { EditQuestionnaireComponent } from 'app/edit-questionnaire/edit-questionnaire.component';
import { QuestionnaireServiceService } from 'app/services/questionnaire-service.service';




@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.css']
})
export class AddQuestionnaireComponent implements OnInit {
  showAdd: boolean=false;
  // questionTypes:any=["Qualitative","Utility","Quantitative"];
  answerTypes:any=["Radio","Dropdown"];
  questionnaireForm: FormGroup;
  questionArrayList:any;
  questionOptionList: any[];
  questiontype: any=null;
  disabledFlag:any=true;
  saveDisabled:boolean=true;
  minwght:number=0;
  maxwght:number=100;
  questionsList: any;
  questionrows:any=[];
  questionlists:any=[];
  providerServiceMapID: any;
  questionlistValue: any=[];
  rankArray: any=[];
  questionrowsfilter: any=[];
  services: any=[];
  state: string;
  states: any=[];
  userID: any;
  showtype: boolean=false;
  questionTypeArray: any=[];
  questiontypeID: number;
  questionnaireType: string;
  service:string;
  qindex:number=0
  sum: number=0;
 delVar:boolean=false;
  constructor(private formBuilder: FormBuilder,public commonDialogService: ConfirmationDialogsService,
    public questionnaire_service: QuestionnaireServiceService,public data_service: dataService,public _getproviderService: AgentListCreationService,
    public dialog: MdDialog) { }

  ngOnInit() {
    
    this.createQuestionnaireForm();
    this.userID = this.data_service.uid;
    this.getServices(this.userID);
    this.getQuestionType();
    
  }
  getQuestionType()
  {
    this.questionnaire_service.getQuestionTypes().subscribe(response => this.getQuestionTypeSuccessHandeler(response));
  }
  getQuestionTypeSuccessHandeler(response) {
    console.log("*QUESTION TYPES*", response);
    this.questionTypeArray=response;
  }

  getServices(userID) {
  
    this.questionnaire_service.getServices(userID)
      .subscribe(response => this.getServicesSuccessHandeler(response), (err) => console.log("Error", err));//
  
  }

  getServicesSuccessHandeler(response) {
    console.log('SERVICES', response);
    this.services = response;
  }
  getStates(serviceID, isNational) {
    this.state = '';
    this._getproviderService.getStates(this.userID, serviceID, isNational)
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
  setProviderServiceMapID(providerServiceMapID) {
    console.log('providerServiceMapID', providerServiceMapID);
    this.providerServiceMapID = providerServiceMapID;
    this.showtype=true;
    this.createQuestionList(this.providerServiceMapID);
  }
  createQuestionList(providerServiceMapID)
  {
 
    this.questionnaire_service.fetchQuestionnaire({
      "providerServiceMapID":  providerServiceMapID
    }).subscribe((response) => {
      console.log("Hello",response);
      if (response.statusCode == 200) {
        this.questionlists = response.data;
        
        console.log("Successfull Message", this.questionlists);
        
      }
    },
      (error) => {
        console.log(error);
        // this.commonDialogService.alert(error.errorMessage, 'error');
      });


   
    // this.questionrows = respObj.data.questions;
    // this.questionlists = respObj.data;
  }
createQuestionnaireForm()
{
  this.questionnaireForm=this.formBuilder.group({
    newQuestions:  this.formBuilder.array([this.createQuestions() ])
    

  })
}

  createQuestions(): FormGroup {
    return this.formBuilder.group({
      questionName : new FormControl(''),
      questionRank: new FormControl(''),
      questionWeight: new FormControl(''),
      answerType: new FormControl(''),
      answerOptions:  this.formBuilder.array([this.createQuestionsOptions() ])
    });
  }
    createQuestionsOptions(): FormGroup {
      return this.formBuilder.group({
        
        option: new FormControl(''),
        optionWeightage: new FormControl(''),
        deleted: this.delVar
  
      });
    }
  
  
  

  get answerOptions(): FormArray {
    return this.questionnaireForm.get('answerOptions') as FormArray;
  }
  get newQuestions(): FormArray {
    return this.questionnaireForm.get('newQuestions') as FormArray;
  }
  addOptionField(i) {
    this.questionOptionList = [];
    
    console.log("Ind",i)
     let questList = <FormArray>this.questionnaireForm.controls['newQuestions'];
     console.log("questList1",questList)
    let questionList = <FormArray>questList.controls[i].get('answerOptions');
    
    
    console.log("questList",questionList)
    questionList.push(this.createItem());
    this.questionArrayList = questionList;
   
  

  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      option: null,
      optionWeightage: null,
      deleted: this.delVar
    })
  }
  deleteOptionField(i,idx) {
  
   const control = <FormArray>this.questionnaireForm.get(['newQuestions',i,'answerOptions']);
   if (control.length !== 1) 
   {
   
   control.removeAt(idx);
  }
 

  

  
    
  }
 
  onFormSubmit() {
     
    this.questionlistValue=[];
    let postQuestionList=[];
    console.log("FormValue",this.questionnaireForm.value);

  this.questionlistValue = this.questionnaireForm.value;
 
    postQuestionList = this.iterateArray(this.questionlistValue);
//apply for edit also
   for(let j=0;j<this.questionlistValue.newQuestions.length;j++) {
      this.sum=0;
      this.qindex++;
            for(let k=0;k<this.questionlistValue.newQuestions[j].answerOptions.length;k++)
            {
              console.log("Weightage",this.questionlistValue.newQuestions[j].answerOptions[k].optionWeightage);

               this.sum =  this.sum + parseInt(this.questionlistValue.newQuestions[j].answerOptions[k].optionWeightage);
            }
            if(this.sum!=100)
            {
              this.commonDialogService.alert("Sum of option  weightage of Question"+this.qindex+" should be 100", 'error');
             break;
                 
            }
           
          }
          
          this.qindex=0;
console.log("Sum",this.sum)
if(this.sum==100)
{
this.questionnaire_service.saveQuestionnaire(postQuestionList)
    .subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.successhandler();
        this.navigateToPrev();
        this.commonDialogService.alert(resp.data.response, 'success');
        console.log("Successfull Message");
        
      }
      
      
    }, (err) => {
      this.commonDialogService.alert(err.errorMessage, 'error');
      // this.successhandler();
    });

  } 
  this.sum=0; 
  }
  iterateArray(questionlistValue) {
    console.log("QuestionTypeID",this.questiontypeID);
    let postQuestionList = [];
    let reqObj={};
   
    
    
    questionlistValue.newQuestions.forEach((question) => {

      // question.answerOptions.deleted.patchValue({"deleted": false });
      // this.answerOptions[0].patchValue({"deleted": false });
      for (let i = 0; i < question.answerOptions.length; i++) {

       
     
        // question.answerOptions[i].patchValue({"deleted": false});
        question.answerOptions[i].deleted=false;
       
      }
      const questionObj = {
       
        "questionnaireDetail": {
          "questionTypeID":this.questiontypeID,
          "questionType": this.questiontype,
          "question": question.questionName,
          "questionRank": question.questionRank,
          "questionWeightage": question.questionWeight,
          "answerType": question.answerType,
          "questionOptions":question.answerOptions,
          "providerServiceMapID": this.providerServiceMapID,
          "createdBy": this.data_service.uname,
          "deleted": false
        
        }
      };
      postQuestionList.push(questionObj);
    
    })
   
    return postQuestionList
  
  }

  successhandler()
  {
    this.questionnaireForm.reset();
  
    this.createQuestionnaireForm();
    this.showAddForm();
  }
  showAddForm()
  {
   this.showAdd=true;
  }
  weightFlag: any = true;
  weightageInput(index) {
    let value= this.newQuestions.at(index).value.questionWeight;
    if (value == undefined) {
    }
    else if (value >= 0 && value <= 100) {
      this.weightFlag = false;
      console.log("wght",this.weightFlag)
    }
    else {
    
      this.weightFlag = true;
        this.commonDialogService.alert("Enter valid Weightage (between 0 and 100)", 'error');
    }
  }
   optionweightFlag: any = true;
   optionweightage(index,mainIndex) {
    console.log("Index",index)
   let questionvalue= this.newQuestions.at(mainIndex).value.answerOptions;
   console.log("ValueIndex",questionvalue)
   let value=questionvalue[index].optionWeightage;
   console.log("Valueee",value)
    if (value == undefined) {
    }
    else if (value >= 0 && value <= 100) {
      this.optionweightFlag = false;
      console.log("wght",this.optionweightFlag)
    }
    else {
      this.optionweightFlag = true;
         this.commonDialogService.alert("Enter valid Weightage (between 0 and 100)", 'error');
     
    }
  }
  setQuestionType(value)
  {
    
    console.log("questionrows",this.questionlists)
    console.log("questiontyepvalue",value)
   this.questionrows=[];
    this.questionrowsfilter=[];
    for (let i = 0; i < this.questionlists.length; i++) {

      if(value == this.questionlists[i].questionType)
      {
        this.questionrows.push(this.questionlists[i]);
        this.questionrowsfilter.push(this.questionlists[i]);
      }
    }
    console.log("questionrows1",this.questionrows)
    console.log("questionrows2",this.questionrowsfilter)

    if(value == null)
    {
      this.disabledFlag=true;
    }
    else{
      this.disabledFlag=false;
    }
    this.questiontype=value;
    console.log("questionTypeArray",this.questionTypeArray)
    for(let k=0;k<this.questionTypeArray.length;k++)
    {
      if(this.questiontype == this.questionTypeArray[k].questionType)
      {
    this.questiontypeID= this.questionTypeArray[k].questionTypeID;
     
      }
    }
  }
 
  onAddRow() {
    this.questionsList = [];
    let questionList = <FormArray>this.questionnaireForm.controls['newQuestions'];
    questionList.push(this.createQuestions());
    this.questionsList = questionList;

 
  }
  onDeleteRow(index) {
    let questionList = <FormArray>this.questionnaireForm.controls['newQuestions'];
    console.log("questionList",questionList)
    console.log("questionList1",questionList.value[index].questionRank)
    if (questionList.length !== 1) 
   {
        
        if(this.rankArray[index]==questionList.value[index].questionRank)
            {
              // this.rankArray.removeAt(index);
              this.rankArray[index]="";
            }
    questionList.removeAt(index);
  }


}
navigateToPrev()
{
  this.questionnaireForm.reset();
  this.questionnaire_service.fetchQuestionnaire({
    "providerServiceMapID":  this.providerServiceMapID
  }).subscribe((respon) => {
    // this.listDisplay = true;
    this.questionlists = respon.data;
    this.setQuestionType(this.questiontype);
   
  },
  (error) => {
    console.log(error);
  });

  this.showAdd=false;
  
}

onEditClick(row) {
  // EditQuestionnaireComponent
  // SurveyorQuestionnaireModelComponent
  console.log(row);
  let editDialog = this.dialog.open(EditQuestionnaireComponent, {
    disableClose: true,
    // width: '700px',
    height: '500px',
    data: {
      "selectedQuestion": row
    }
  });
  editDialog.afterClosed()
    .subscribe((response) => {
    
      if (response) {

        // console.log(response);
        this.commonDialogService.alert(response.resp.data.response, 'success');
      

        this.questionnaire_service.fetchQuestionnaire({
          "providerServiceMapID":  this.providerServiceMapID
        }).subscribe((respon) => {
          // this.listDisplay = true;
          this.questionlists = respon.data;
        
          this.setQuestionType(response.questionType);
         
        },
        (error) => {
          console.log(error);
        });
      } 
     
   else{
        this.questionnaire_service.fetchQuestionnaire({
          "providerServiceMapID":  this.providerServiceMapID
        }).subscribe((respon) => {
          // this.listDisplay = true;
          this.questionlists = respon.data;
        
          this.setQuestionType(this.questiontype);
         
        },
        (error) => {
          console.log(error);
        });
      } 
    },
    (error) => {
      console.log(error);
    })
   
}

onDeleteClick(row, event) {
  event.preventDefault();
  console.log(row);
  this.commonDialogService.confirm('', 'Are you sure you want to delete?')
    .subscribe((response) => {
      if (response) {
        this.questionnaire_service.deleteQuestionaire({
          "providerServiceMapID": this.providerServiceMapID,
          "questionID": row.questionID,
          "deleted": true,
          "questionRank":row.questionRank,
        }).subscribe((response) => {
          console.log(response);
          if (response.statusCode == 200) {

            console.log(response);
            this.commonDialogService.alert(response.data.response, 'success');
           
            this.questionnaire_service.fetchQuestionnaire({
              "providerServiceMapID":  this.providerServiceMapID
            }).subscribe((respon) => {
              // this.listDisplay = true;
              this.questionlists = respon.data;
            
              this.setQuestionType(this.questiontype);
             
            },
            (error) => {
              console.log(error);
            });
          }
        },
          (error) => {
            this.commonDialogService.alert(error.errorMessage, 'error');
          });
      }
    });
}

rankFlag: any = true;
rankInput(index) {
  let setRank:any=false;
  let value= this.newQuestions.at(index).value.questionRank;
  if(this.rankArray[index]==value)
  {
    // this.rankArray.removeAt(index);
    this.rankArray[index]="";
  }

    if (value == undefined) {
    }
    else if (value > 0) {

     
        if(this.rankArray.length==0)
        {
          this.rankFlag = false;
        }
        else{
        for (let j = 0; j < this.rankArray.length; j++) {
          if(value == this.rankArray[j])
          {
            this.rankFlag = true;
            setRank= true;
            this.commonDialogService.alert("Question with same rank is already adding", 'error');
            break;
          }
          else{
            this.rankFlag = false;
          }
        }
      }
    




    
      console.log("Rank",value);
      if(setRank== false){
      for (let i = 0; i < this.questionlists.length; i++) {
        // console.log("qiestioList", this.questionlists[i].questionnaireDetail.questionRank);
        if(value == this.questionlists[i].questionRank)
        {
          // this.rankFlag = true;
          // setRank=true;
        // this.commonDialogService.alert("Question with same rank is already exist", 'error');

        this.commonDialogService.confirm('', 'Question with same rank is already exist.Are you sure want to proceed with the same rank?(Further higher rank questions will incremented by 1)')
        .subscribe((response) => {
          if (response) {
            this.rankFlag=false;
            
          }
          else{
            // this.newQuestions.at(i).patchValue({ "questionRank": ""});
            this.rankFlag=true;
          }
        
        });

        break;


        
        }
      }
    }
     
/* */


      if(this.rankFlag == false)
    {
      this.rankArray[index]=value;
    }
     
    }
    else {
    
      this.rankFlag = true;
        this.commonDialogService.alert("Enter a valid Rank (It should greater than zero)", 'error');
    }
  }
  filterQuestionList(searchTerm: string) {
		if (!searchTerm)
			this.questionrows = this.questionrowsfilter;
		else {
      this.questionrows = [];
      console.log("questionrowsfilter",this.questionrowsfilter)
			this.questionrowsfilter.forEach((item) => {
				for (let key in item) {
          console.log("Key",key)
					if (key == 'questionRank') {
						let value: string = '' + item[key];
						if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
							this.questionrows.push(item); break;
						}
					}
					else if (key == 'question') {
					
							let value: string = '' + item[key];
							if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
								this.questionrows.push(item); break;
							}
						
					}
				}
			});
		}
	}
}