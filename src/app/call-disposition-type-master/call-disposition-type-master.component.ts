import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-call-disposition-type-master',
	templateUrl: './call-disposition-type-master.component.html',
	styleUrls: ['./call-disposition-type-master.component.css']
})
export class CallDispositionTypeMasterComponent implements OnInit {


	data:any;

	constructor() {
	console.log("10"+20+30); }

	ngOnInit() {
		this.data=[
		{
			"id":"1",
			"state":"Karnataka",
			"serviceline":"104",
			"calltype":"CALLTYPE1",
			"callsubtype":["CALLSUBTYPE1.1","CALLSUBTYPE1.2","CALLSUBTYPE1.3"]
		},
		{
			"id":"2",
			"state":"Karnataka",
			"serviceline":"104",
			"calltype":"CALLTYPE2",
			"callsubtype":["CALLSUBTYPE2.1","CALLSUBTYPE2.2","CALLSUBTYPE2.3"]
		},
		{
			"id":"3",
			"state":"Andhra Pradesh",
			"serviceline":"1097",
			"calltype":"CALLTYPE1",
			"callsubtype":["CALLSUBTYPE3.1","CALLSUBTYPE3.2","CALLSUBTYPE3.3"]
		},
		{
			"id":"3",
			"state":"Andhra Pradesh",
			"serviceline":"1097",
			"calltype":"CALLTYPE1",
			"callsubtype":["CALLSUBTYPE3.1","CALLSUBTYPE3.2","CALLSUBTYPE3.3"]
		},
		{
			"id":"2",
			"state":"Karnataka",
			"serviceline":"104",
			"calltype":"CALLTYPE2",
			"callsubtype":["CALLSUBTYPE2.1","CALLSUBTYPE2.2","CALLSUBTYPE2.3"]
		},
		{
			"id":"1",
			"state":"Karnataka",
			"serviceline":"104",
			"calltype":"CALLTYPE1",
			"callsubtype":["CALLSUBTYPE1.1","CALLSUBTYPE1.2","CALLSUBTYPE1.3"]
		}
		];

	}



}
