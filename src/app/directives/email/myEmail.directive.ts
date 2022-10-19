import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[myEmail]",
})
export class myEmail {
  constructor(element: ElementRef) {}

  private emailValidator(email: any) {
    if (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      return 1;
    } else {
      return -1;
    }
  }
  /**
   * Commented by JA354063 as PSMRI requested to enable the copy paste functionality

	//   @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
	// 	e.preventDefault();
	//   }
	
	//   @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
	// 	e.preventDefault();
	//   }
	
	//   @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
	// 	e.preventDefault();
	//   }
	*/
}
