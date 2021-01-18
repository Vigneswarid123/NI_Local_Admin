/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddRegionComponent } from './add-region.component';

describe('AddRegionComponent', () => {
  let component: AddRegionComponent;
  let fixture: ComponentFixture<AddRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
