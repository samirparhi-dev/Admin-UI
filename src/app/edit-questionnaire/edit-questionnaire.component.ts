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
  answerTypes:any=["Radio","Dropdown"];
  questionOptionList: any[];
  questionArrayList: FormArray;
  weightFlag: any = false;
  optionweightFlag: any = false;
  questionlistValue: any[];
  providerServiceMapID: any;
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
    this.editQuestionnaireForm.controls['questionWeight'].setValue(this.data.selectedQuestion.questionWeightage)
    this.editQuestionnaireForm.controls['answerType'].setValue(this.data.selectedQuestion.answerType)

    for (let i = 0; i < this.data.selectedQuestion.qvalues.length; i++) {
      this.addOptionField(i);
      // console.log("questionOptions",this.data.selectedQuestion.questionnaireDetail.questionOptions[i])
      // this.editQuestionnaireForm.controls.answerOptions.setValue([
      //   this.data.selectedQuestion.questionnaireDetail.questionOptions[i]
        
      // ]);
    }
    for (let i = 0; i < this.answerOptions.length; i++) {

      // console.log(this.answerOptions.at(i).value);
      // this.answerOptions.at(i).patchValue(this.data.selectedQuestion.questionnaireDetail.questionOptions[i]);
      this.answerOptions.at(i).patchValue({"questionValuesID":this.data.selectedQuestion.qvalues[i].questionValuesID ,"option": this.data.selectedQuestion.qvalues[i].option, "optionWeightage": this.data.selectedQuestion.qvalues[i].optionWeightage});
      console.log("NewOptions",this.answerOptions.at(i).value);
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
 addOptionField(i) {
  this.questionOptionList = [];

  console.log("Ind",i)
   let questionList = <FormArray>this.editQuestionnaireForm.controls['answerOptions'];
  
  
  

  questionList.push(this.createQuestionsOptions());
  this.questionArrayList = questionList;

  console.log("FormValues",this.editQuestionnaireForm.value)
 


}
deleteOptionField(i,idx) {
    let questList = <FormArray>this.editQuestionnaireForm.controls['answerOptions'];
 
   if (questList.length !== 1) 
   {
   
    questList.removeAt(idx);
  }
 

  

  
    
  }
  onSubmit()
  {
     
    //   this.questionlistValue=[];
    //   let postQuestionList=[];
    //   console.log("FormValue",this.editQuestionnaireForm.value);
  
    // this.questionlistValue = this.editQuestionnaireForm.value;
   
    //   postQuestionList = this.iterateArray(this.questionlistValue);
      const questionObj = {
      
        "questionnaireDetail": {
          "questionID": this.editQuestionnaireForm.value.questionID,
          "questionTypeID": this.editQuestionnaireForm.value.questionTypeID,
          "questionType": this.editQuestionnaireForm.value.questionType,
          "question": this.editQuestionnaireForm.value.questionName,
          "questionRank": this.editQuestionnaireForm.value.questionRank,
          "questionWeightage": this.editQuestionnaireForm.value.questionWeight,
          "answerType": this.editQuestionnaireForm.value.answerType,
          "questionOptions":this.editQuestionnaireForm.value.answerOptions,
          "providerServiceMapID": this.providerServiceMapID,
          "createdBy": this.data_service.uname,
          "modifiedBy": this.data_service.uname,
          
        
        }
      };
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
 
}
