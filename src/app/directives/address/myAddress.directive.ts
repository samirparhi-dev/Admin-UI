import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[myAddress]",
})
export class myAddress {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[~!@$%^&*()_+\=\[\]{};"`':'\\|<>\?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
  /**
   * Commented by JA354063 as PSMRI requested to enable the copy paste functionality
	// @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
	// 	e.preventDefault();
	//   }
	
	// @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
	// e.preventDefault();
	// }

	// @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
	// e.preventDefault();
	// }
	*/
}
@Directive({
  selector: "[myUserName]",
})
export class myUserName {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[~!`@#+:,$%^&/*()={};'"\\|<>?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
  /**
   * Commented by JA354063 as PSMRI requested to enable the copy paste functionality
	// @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
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
