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
