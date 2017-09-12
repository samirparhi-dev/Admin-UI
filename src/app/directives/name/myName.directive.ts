import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[myName]'
})
export class myName {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[0-9 ~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}


}
@Directive({
	selector: '[myProviderName]'
})
export class myProviderName {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[0-9~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}


}