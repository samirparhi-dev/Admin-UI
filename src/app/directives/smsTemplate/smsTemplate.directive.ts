import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[smsTemplateValidator]',
})
export class SmsTemplateDirective {
  @HostListener('keypress', ['$event']) onKeyPress(ev: any) {
    const regex = new RegExp(/^[~!@#%^&*_+\=\[\]{}"`''\\|<>\?]*$/);
    const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
  /**
   * Commented by JA354063 as PSMRI requested to enable the copy paste functionality
  // @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
  //   e.preventDefault();
  // }

  // @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
  //   e.preventDefault();
  // }

  // @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
  //   e.preventDefault();
  // }
  */
}
