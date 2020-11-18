import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ComponentMasterServiceService } from 'app/services/ProviderAdminServices/component-master-service.service';

import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-component-name-search',
  templateUrl: './component-name-search.component.html',
  styleUrls: ['./component-name-search.component.css']
})
export class ComponentNameSearchComponent implements OnInit {

  searchTerm: string;

  components = [];
  pageCount: any;
  selectedComponentsList = [];
  currentPage: number = 1;
  pager: any = {
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    pages: 0
  };
  pagedItems = [];
  placeHolderSearch: any
  current_language_set: any;
  
  selectedComponent: any=null;
  selectedComponentNo: any;
  

 
  


  constructor( @Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<ComponentNameSearchComponent>,
    private componentMasterServiceService: ComponentMasterServiceService,
   ) { }

  ngOnInit() {
    
    this.search(this.input.searchTerm, 0);
  
     
  }

  selectComponentName(item,component) {
    this.selectedComponent=null;
  
    
      
      this.selectedComponentNo=item;
      this.selectedComponent=component;
      console.log("selectedComponent",this.selectedComponent)
      
    
    
  }

  
 

 
 



 
  submitComponentList() {
    let reqObj={
      "componentNo":this.selectedComponentNo,
      "component":this.selectedComponent
    }
    this.dialogRef.close(reqObj);
  }
  showProgressBar: Boolean = false;
  search(term: string, pageNo): void {
    
    this.selectedComponent=null;
    if (term.length > 2) {
      this.showProgressBar = true;
      this.componentMasterServiceService.searchComponent(term, pageNo).subscribe((res) => {
        if (res.statusCode == 200) {
          this.showProgressBar = false;
          if (res.data && res.data.lonicMaster.length > 0) {
            this.showProgressBar = true;
            this.components = res.data.lonicMaster;
            if (pageNo == 0) {
              this.pageCount = res.data.pageCount;
            }
            this.pager = this.getPager(pageNo);
            this.showProgressBar = false;
          }
        } else {
          this.resetData();
          this.showProgressBar = false;
        }
      }, err => {
        this.resetData();
        this.showProgressBar = false;
      })
    }

  }
  checkPager(pager, page) {
    if (page == 0 && pager.currentPage != 0) {
      this.setPage(page);
    } else if (pager.currentPage < page) {
      this.setPage(page);
    }
  }
  setPage(page: number) {
    if (page <= this.pageCount - 1 && page >= 0) {
      this.search(this.input.searchTerm, page);
      // get pager object
      this.pager = this.getPager(page);
    }

  }
  getPager(page) {
    // Total page count
    let totalPages = this.pageCount;
    // ensure current page isn't out of range
    if (page > totalPages) {
      page = totalPages - 1;
    }
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 0;
      endPage = totalPages - 1;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (page <= 2) {
        startPage = 0;
        endPage = 4;
      } else if (page + 2 >= totalPages) {
        startPage = totalPages - 5;
        endPage = totalPages - 1;
      } else {
        startPage = page - 2;
        endPage = page + 2;
      }
    }
    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    // return object with all pager properties required by the view
    return {
      currentPage: page,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages
    };
  }
  resetData() {
   
    this.components = [];
    this.pageCount = null;
    this.pager = {
      totalItems: 0,
      currentPage: 0,
      totalPages: 0,
      startPage: 0,
      endPage: 0,
      pages: 0
    };
  }

// setEnable()
// {
//   this.selectedComponent=null;
// }
}
