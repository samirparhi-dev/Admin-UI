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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMappingBlockSubcenterComponent } from './data-mapping-block-subcenter.component';

describe('DataMappingBlockSubcenterComponent', () => {
  let component: DataMappingBlockSubcenterComponent;
  let fixture: ComponentFixture<DataMappingBlockSubcenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataMappingBlockSubcenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMappingBlockSubcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
