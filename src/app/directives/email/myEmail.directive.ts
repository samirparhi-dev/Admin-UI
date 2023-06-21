/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
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
