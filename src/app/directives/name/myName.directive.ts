import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[myName]'
})
export class myName {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[0-9 ~!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}

	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }

}

@Directive({
	selector: '[myName2]'
})
export class myName2 {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[0-9~!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
 @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

}

@Directive({
	selector: '[agentID_one]'
})
export class agentID_one {
	constructor(element: ElementRef) {

	}

	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[a-zA-Z ~!@#$%^&*`()_+\-=\[\]{};':"\\|.<>\/?]*$/);
		//   "^(\\s*\\d+\\s*\\-\\s*\\d+\\s*,?|\\s*\\d+\\s*,?)+$"
		//   /^[a-zA-Z~!@#$%^&*`()_+\=\[\]{};':"\\|.<>\/?]*$/
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}

	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }
}

@Directive({
	selector: '[agentID_two]'
})
export class agentID_two {
	constructor(element: ElementRef) {

	}

	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[a-zA-Z ~!@#$%^&*`()_+\=\[\]{};':"\\|,.<>\/?]*$/);
		//   "^(\\s*\\d+\\s*\\-\\s*\\d+\\s*,?|\\s*\\d+\\s*,?)+$"
		//   /^[a-zA-Z~!@#$%^&*`()_+\=\[\]{};':"\\|.<>\/?]*$/
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }
}

@Directive({
	selector: '[myProviderName]'
})
export class myProviderName {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[0-9~!@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }


}
@Directive({

	selector: '[PAN]'
})
export class PAN {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[~ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }


}
@Directive({

	selector: '[VehicleNO]'
})
export class VehicleNO {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }

}
@Directive({

	selector: '[VehicleNONew]'
})
export class VehicleNONew {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[~!@#$%^&*()_+\=\[\]{};':"\\|,.<>\?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }

}
@Directive({

	selector: '[measuringUnit]'
})
export class measuringUnit {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[~!@#$&*()+={};':"<>?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }

}

@Directive({

	selector: '[DLNO]'
})
export class DLNO {
	constructor(element: ElementRef) {

	}


	@HostListener('keypress', ['$event']) onKeyPress(ev: any) {
		var regex = new RegExp(/^[~ !@#$%^&*()_+\=\[\]{};':"\\|,.<>\?]*$/);
		var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
		if (regex.test(key)) {
			ev.preventDefault();
		}
	}
	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	  }
	
	  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	  }

}



