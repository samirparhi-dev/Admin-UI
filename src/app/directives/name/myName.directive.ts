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
import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[myName]",
})
export class myName {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[0-9 ~!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}

@Directive({
  selector: "[myName2]",
})
export class myName2 {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[0-9~!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}

@Directive({
  selector: "[agentID_one]",
})
export class agentID_one {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[a-zA-Z ~!@#$%^&*`()_+\-=\[\]{};':"\\|.<>\/?]*$/);
    //   "^(\\s*\\d+\\s*\\-\\s*\\d+\\s*,?|\\s*\\d+\\s*,?)+$"
    //   /^[a-zA-Z~!@#$%^&*`()_+\=\[\]{};':"\\|.<>\/?]*$/
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}

@Directive({
  selector: "[agentID_two]",
})
export class agentID_two {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[a-zA-Z ~!@#$%^&*`()_+\=\[\]{};':"\\|,.<>\/?]*$/);
    //   "^(\\s*\\d+\\s*\\-\\s*\\d+\\s*,?|\\s*\\d+\\s*,?)+$"
    //   /^[a-zA-Z~!@#$%^&*`()_+\=\[\]{};':"\\|.<>\/?]*$/
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}

@Directive({
  selector: "[myProviderName]",
})
export class myProviderName {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[0-9~!@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}
@Directive({
  selector: "[PAN]",
})
export class PAN {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[~ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}
@Directive({
  selector: "[VehicleNO]",
})
export class VehicleNO {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}
@Directive({
  selector: "[VehicleNONew]",
})
export class VehicleNONew {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[~!@#$%^&*()_+\=\[\]{};':"\\|,.<>\?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}
@Directive({
  selector: "[measuringUnit]",
})
export class measuringUnit {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[~!@#$&*()+={};':"<>?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}

@Directive({
  selector: "[DLNO]",
})
export class DLNO {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[~ !@#$%^&*()_+\=\[\]{};':"\\|,.<>\?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
}
