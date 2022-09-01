import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[myMobileNumberWithCopyPaste]'
})
export class MyMobileNumberWithCopyPaste {
	constructor(element:ElementRef)
	{

	}

	private mobileNumberValidator(number:any)
	{
		if (number.match(/^[+]?[0-9]{1,10}$/))
		{
			if(number.length==10)
			{
				return 1;
			}
			else
			{
				return 0;
			}
		}
		else{
			return -1;
		}
	}

	@HostListener('keyup', ['$event']) onKeyUp(ev: any)
	{

		var result = this.mobileNumberValidator(ev.target.value);
		if(result==1)
		{
			// ev.target.nextSibling.nextElementSibling.innerHTML = "Valid Number";
			// ev.target.style.border = "2px solid green";
		}
		if(result==0)
		{
			// ev.target.nextSibling.nextElementSibling.innerHTML = "mobile number should be a 10 digit number";
			// ev.target.style.border = "2px solid yellow";
		}
		if(result==-1)
		{
			// ev.target.nextSibling.nextElementSibling.innerHTML="Enter only numbers";
			// ev.target.style.border = "2px solid red";
		}
		
	}

	@HostListener('keypress',['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[a-zA-Z ~!@#$%^&*()_+\-=\[\]{};`':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}

    @HostListener("paste", ["$event"]) blockPaste(ev: any,event: KeyboardEvent) {
		let clipboardData =(ev !=undefined) ? ev.clipboardData : undefined;
		let pastedText = (clipboardData !=undefined) ? (clipboardData.getData('text')) : undefined;
		const regex = new RegExp(/^[a-zA-Z ~!@#$%^&*()_+\-=\[\]{};`':"\\|,.<>\/?]*$/);
		 // const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		  let flag=false;
		  if(pastedText !=null && pastedText != undefined && pastedText.length >0)
		  {
			Array.from(pastedText).forEach(element => {
				console.log(element);
				if (element !=null && element !=undefined && regex.test(element.toString())) {
					flag=true;
				  }
			});
		  }
		  if(flag)
		  ev.preventDefault();
		}

	//  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
	// 	e.preventDefault();
	//   }
	
	//   @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
	// 	e.preventDefault();
	//   }
	
	//   @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
	// 	e.preventDefault();
	//   }

}