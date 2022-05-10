import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { dataService } from 'app/services/dataService/data.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { QuestionnaireServiceService } from 'app/services/questionnaire-service.service';

@Component({
  selector: 'app-edit-questionnaire',
  templateUrl: './edit-questionnaire.component.html',
  styleUrls: ['./edit-questionnaire.component.css']
})
export class EditQuestionnaireComponent implements OnInit {
  selectedQuestion: any;  
  editQuestionnaireForm:  FormGroup;
  answerTypes:any=["Radio","Dropdown","Free Text"];
  questionOptionList: any[];
  questionArrayList: FormArray;
  weightFlag: any = false;
  optionweightFlag: any = false;
  questionlistValue: any[];
  providerServiceMapID: any;
  deleteArray: any=[];
  enableUpdate: boolean=true;
  disableWeightage: boolean=false;
  enableOptionArray: boolean;
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<EditQuestionnaireComponent>,
  private formBuilder: FormBuilder,public commonDialogService: ConfirmationDialogsService,public data_service: dataService,
  public questionnaire_service: QuestionnaireServiceService,) { }

  ngOnInit() {
    this.selectedQuestion = this.data.selectedQuestion;
    this.createQuestionnaireForm();
    this.patchSelectedQuestion();
  }
  patchSelectedQuestion()
  {
    this.providerServiceMapID=this.data.selectedQuestion.providerServiceMapID;
    this.editQuestionnaireForm.controls['questionID'].setValue(this.data.selectedQuestion.questionID)
    this.editQuestionnaireForm.controls['questionTypeID'].setValue(this.data.selectedQuestion.questionTypeID)
    this.editQuestionnaireForm.controls['questionType'].setValue(this.data.selectedQuestion.questionType)
    this.editQuestionnaireForm.controls['questionName'].setValue(this.data.selectedQuestion.question)
    this.editQuestionnaireForm.controls['questionRank'].setValue(this.data.selectedQuestion.questionRank)
    this.editQuestionnaireForm.controls['answerType'].setValue(this.data.selectedQuestion.answerType)

if(this.data.selectedQuestion.answerType == "Free Text"){
  this.editQuestionnaireForm.controls['questionWeight'].setValue(" ");
  this.disableWeightage=false;
  this.enableOptionArray=false;
}
else{
  this.disableWeightage=true;
  this.enableOptionArray=true;
    this.editQuestionnaireForm.controls['questionWeight'].setValue(this.data.selectedQuestion.questionWeightage)
    let j=0;
    for (let i = 0; i < this.data.selectedQuestion.qvalues.length;i++) {
      if(this.data.selectedQuestion.qvalues[i].deleted == false)
      {

      this.addOptField(j);
      this.answerOptions.at(j).patchValue({"questionValuesID":this.data.selectedQuestion.qvalues[i].questionValuesID ,"option": this.data.selectedQuestion.qvalues[i].option, "optionWeightage": this.data.selectedQuestion.qvalues[i].optionWeightage,"deleted":this.data.selectedQuestion.qvalues[i].deleted });
      j++;
    
      }
      // console.log("questionOptions",this.data.selectedQuestion.questionnaireDetail.questionOptions[i])
      // this.editQuestionnaireForm.controls.answerOptions.setValue([
      //   this.data.selectedQuestion.questionnaireDetail.questionOptions[i]
        
      // ]);
    }
    // for (let i = 0; i < this.answerOptions.length;i++) {

    //   if(this.data.selectedQuestion.qvalues[i].deleted == false)
    //   {
    //   this.answerOptions.at(i).patchValue({"questionValuesID":this.data.selectedQuestion.qvalues[i].questionValuesID ,"option": this.data.selectedQuestion.qvalues[i].option, "optionWeightage": this.data.selectedQuestion.qvalues[i].optionWeightage,"deleted":this.data.selectedQuestion.qvalues[i].deleted });
    //   console.log("NewOptions",this.answerOptions.at(i).value);
     
    //   }
    // }
    
  }

  }
  get answerOptions(): FormArray {
    return this.editQuestionnaireForm.get('answerOptions') as FormArray;
  }
  createQuestionnaireForm()
  {
    this.editQuestionnaireForm=this.formBuilder.group({
      questionID:  new FormControl(''),
      questionTypeID: new FormControl(''),
      questionType: new FormControl(''),
      questionName : new FormControl(''),
      questionRank: new FormControl(''),
      questionWeight:new FormControl(''),
      answerType: new FormControl(''),
      answerOptions:  this.formBuilder.array([])
  
    })
  }
  createQuestionsOptions(): FormGroup {
    return this.formBuilder.group({
      questionValuesID: null,
      option: new FormControl(''),
      optionWeightage: new FormControl(''),
      deleted: new FormControl(''),
    });
  }
  
  weightageInput() {
    let value= this.editQuestionnaireForm.controls['questionWeight'].value;
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
  
  optionweightage(index) {
 
  let questionvalue= this.editQuestionnaireForm.value.answerOptions;
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
 addOptField(i) {
  this.questionOptionList = [];

  console.log("Ind",i)
   let questionList = <FormArray>this.editQuestionnaireForm.controls['answerOptions'];
  
  
  

  questionList.push(this.createQuestionsOptions());
  this.questionArrayList = questionList;
 
  console.log("FormValues",this.editQuestionnaireForm.value)
 


}

 addOptionField(i,idx) {
  this.questionOptionList = [];

  console.log("Ind",i)
   let questionList = <FormArray>this.editQuestionnaireForm.controls['answerOptions'];
  
  
  

  questionList.push(this.createQuestionsOptions());
  this.questionArrayList = questionList;
  if(this.answerOptions.at(idx+1).value.deleted != true){
  this.answerOptions.at(idx+1).patchValue({"deleted": false });
  }
  console.log("FormValues",this.editQuestionnaireForm.value)
 


}
deleteOptionField(i,idx) {
    let questList = <FormArray>this.editQuestionnaireForm.controls['answerOptions'];
   console.log("questionWeight1",this.answerOptions.at(idx).value.option);
   console.log("questionWeight2",this.answerOptions.at(idx).value.optionWeightage);
  //  this.answerOptions.at(idx).patchValue({"option":"","optionWeightage": "" });

  // for (let i = 0; i < this.data.selectedQuestion.qvalues.length;i++) {
   

  //     if(this.answerOptions.at(idx).value.option===this.data.selectedQuestion.qvalues[i].option || this.answerOptions.at(idx).value.optionWeightage===this.data.selectedQuestion.qvalues[i].optionWeightage)
  //     {

  
  //   j++;
  //     }
  
  //   }



    if(this.answerOptions.at(idx).value.questionValuesID===null|| this.answerOptions.at(idx).value.option==="" || this.answerOptions.at(idx).value.optionWeightage==="")
    {
      questList.removeAt(idx);
    }
  else{ 
   if (idx === 0) 
   {
    // this.answerOptions.at(idx).value.questionValuesID
     let count=0;
    for (let i = 0; i < this.answerOptions.length;i++) {
      if(this.answerOptions.at(i).value.deleted === false)
      {
        count++;
     
     
    
      }
    }
    console.log("Count1",count)
    if(count>1){

    this.deleteArray[idx]=idx;
    this.enableUpdate=false;
    this.answerOptions.at(idx).patchValue({"optionWeightage": "0","deleted": true });
    }
  }
  else{

    let count=0;
    for (let i = 0; i < this.answerOptions.length;i++) {
      if(this.answerOptions.at(i).value.deleted === false)
      {
        count++;
     
     
    
      }
    }

if(count>1)
{
    this.deleteArray[idx]=idx;
    this.enableUpdate=false;
    this.answerOptions.at(idx).patchValue({"optionWeightage": "0","deleted": true });
}
  }
}

  

console.log("FormValues1",this.editQuestionnaireForm.value)
    
  }
  onSubmit()
  {
     
    this.questionlistValue = this.editQuestionnaireForm.value;


    if(this.editQuestionnaireForm.value.questionWeight===" ")
    {
      this.editQuestionnaireForm.value.questionWeight=null;
      for (let i = 0; i < this.editQuestionnaireForm.value.answerOptions.length; i++) {

      
       
      
        this.editQuestionnaireForm.value.answerOptions[i].deleted=true;
       
      }
    
    }
    else
    {
      for (let i = 0; i < this.editQuestionnaireForm.value.answerOptions.length; i++) {

      
       if(this.editQuestionnaireForm.value.answerOptions[i].deleted=="")
      
        this.editQuestionnaireForm.value.answerOptions[i].deleted=false;
       
      }
    }

 

  //  let sum=0;
     
  //           for(let k=0;k<this.editQuestionnaireForm.value.answerOptions.length;k++)
  //           {
             

  //              sum =  sum + parseInt(this.editQuestionnaireForm.value.answerOptions[k].optionWeightage);
  //           }
            // if(sum!=100)
            // {
            //   this.commonDialogService.alert("Sum of option weightage should be 100", 'error');
             
                 
            // }
           
          
    //  if(sum==100)
    //  {     
      const questionObj = {
      
        "questionnaireDetail": {
          "questionID": this.editQuestionnaireForm.value.questionID,
          "questionTypeID": this.editQuestionnaireForm.value.questionTypeID,
          "questionType": this.editQuestionnaireForm.value.questionType,
          "question": (this.editQuestionnaireForm.value.questionName !== undefined && this.editQuestionnaireForm.value.questionName !== null) ? this.editQuestionnaireForm.value.questionName.trim() : null,
          "questionRank": this.editQuestionnaireForm.value.questionRank,
          "questionWeightage": this.editQuestionnaireForm.value.questionWeight,
          "answerType": this.editQuestionnaireForm.value.answerType,
          "questionOptions":this.editQuestionnaireForm.value.answerOptions,
          "providerServiceMapID": this.providerServiceMapID,
          "createdBy": this.data_service.uname,
          "modifiedBy": this.data_service.uname,
          
        
        }
      };

console.log("QuestionListValue",questionObj)

      this.questionnaire_service.editQuestionnaire(questionObj)
      .subscribe((resp) => {
        if (resp.statusCode == 200) {
        
          // this.commonDialogService.alert(resp.data.response, 'success');
          // console.log("Successfull Message");
          this.dialogRef.close({"resp":resp,"questionType": this.editQuestionnaireForm.value.questionType});
          
        }
        
        
      }, (err) => {
        console.log(err);
        this.dialogRef.close();
      });
  
    
    
  }
// }

enableUpdateButton()
{
  this.enableUpdate=false;
}
enableoptionField()
{

  



   this.editQuestionnaireForm.controls['questionWeight'].setValue(" ");





  if(this.editQuestionnaireForm.value.answerType=="Radio" || this.editQuestionnaireForm.value.answerType=="Dropdown")
  {



    let questList = <FormArray>this.editQuestionnaireForm.controls['answerOptions'];

    for(let j=0;j<questList.length;j++)
     {
    
     
      questList.removeAt(j);
     }
     questList.removeAt(questList.length-1);


    this.weightFlag=true;
    this.optionweightFlag=true;
    this.addOptField(0);
    this.disableWeightage=true;
  this.enableOptionArray=true;
 
  }
else
{


 


  this.weightFlag=false;
   this.optionweightFlag=false;
  //  this.addOptField(0);

   this.disableWeightage=false;
  this.enableOptionArray=false;
}
}

}
