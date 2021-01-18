/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GridIncentiveTypeComponent } from './grid-incentiveType.component';

describe('GridIncentiveTypeComponent', () => {
  let component: GridIncentiveTypeComponent;
  let fixture: ComponentFixture<GridIncentiveTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridIncentiveTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridIncentiveTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
