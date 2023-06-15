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
import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-provider-on-board',
  templateUrl: './provider-on-board.component.html',
  styleUrls: ['./provider-on-board.component.css']
})
export class ProviderOnBoardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tab:any="1";
   change( val )
  {
    this.tab = val;
    jQuery( "#service" + val ).parent().find( "li" ).removeClass();
    jQuery( "#service" + val ).addClass( "animation-nav-active" );

    jQuery( "#service" + val ).parent().find( 'a' ).removeClass();
    jQuery( "#service" + val + " a" ).addClass( "f-c-o" );
  }

}
