/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GridSubscriptionPlanComponent } from './grid-subscriptionPlan.component';

describe('GridSubscriptionPlanComponent', () => {
  let component: GridSubscriptionPlanComponent;
  let fixture: ComponentFixture<GridSubscriptionPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSubscriptionPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
