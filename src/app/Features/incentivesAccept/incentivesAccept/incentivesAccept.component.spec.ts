/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IncentivesAcceptComponent } from './incentivesAccept.component';

describe('IncentivesAcceptComponent', () => {
  let component: IncentivesAcceptComponent;
  let fixture: ComponentFixture<IncentivesAcceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentivesAcceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivesAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
