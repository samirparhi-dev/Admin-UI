import { Component, OnInit } from '@angular/core';
declare var jQuery:any;

@Component({
	selector: 'app-employee-details-capturing',
	templateUrl: './employee-details-capturing.component.html',
	styleUrls: ['./employee-details-capturing.component.css']
})
export class EmployeeDetailsCapturingComponent implements OnInit {

	constructor() { }

	ngOnInit() {

		jQuery('.accordion').each(function() {
			jQuery(this).click(function() {
				jQuery(this).toggleClass("active");
				var panel = this.nextElementSibling;
				if (panel.style.maxHeight) {
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
				} 
			});
		});
	}
}
