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
import { Component, OnInit,Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { SnomedMasterService } from 'app/services/ProviderAdminServices/snomed-master.service';


@Component({
  selector: 'app-snomed-code-search',
  templateUrl: './snomed-code-search.component.html',
  styleUrls: ['./snomed-code-search.component.css']
})
export class SnomedCodeSearchComponent implements OnInit {

  searchTerm: string;

  snomedData = [];
  pageCount: any;
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
  
  selectedTerm: any=null;
  selectedSnomedNo: any;
  message: string="";
  selectedItem: any;
  

 
  


  constructor( @Inject(MD_DIALOG_DATA) public input: any,
    public dialogRef: MdDialogRef<SnomedCodeSearchComponent>,
    private SnomedMasterServiceService: SnomedMasterService,
   ) { }

  ngOnInit() {
    
    this.search(this.input.searchTerm, 0);
  
     
  }

  selectSnomedCode(snomedNo,snomedTerm) {
    this.selectedTerm=null;
  
    
      
      this.selectedSnomedNo=snomedNo;
      this.selectedTerm=snomedTerm;
      this.selectedItem = snomedNo;
    
    
  }

  
 

 
 



 
  submitComponentList() {
    let reqObj={
      "snomedNo":this.selectedSnomedNo,
      "snomedTerm":this.selectedTerm
    }
    this.dialogRef.close(reqObj);
  }
  showProgressBar: Boolean = false;
  search(term: string, pageNo): void {
    
    if (term.length > 2) {
      this.showProgressBar = true;
      this.SnomedMasterServiceService.searchSnomedRecord(term, pageNo).subscribe((res) => {
        if (res.statusCode == 200) {
          this.showProgressBar = false;
          if (res.data && res.data.sctMaster.length > 0) {
            this.showProgressBar = true;
            this.snomedData = res.data.sctMaster;

           

            
            if (pageNo == 0) {
              this.pageCount = res.data.pageCount;
            }
            this.pager = this.getPager(pageNo);
            this.showProgressBar = false;
          }
          else{
            this.message="No Record Found";
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
   
    this.snomedData = [];
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

}
