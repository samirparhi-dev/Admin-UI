import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[itemNameMasterValidator]',
})
export class itemNameMasterDirective {
  @HostListener('keypress', ['$event']) onKeyPress(ev: any) {
    const regex = new RegExp(/^[~!@#$%^&*_+\=\[\]{};"`','\\|<>\/?]*$/);
    const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
  
}
