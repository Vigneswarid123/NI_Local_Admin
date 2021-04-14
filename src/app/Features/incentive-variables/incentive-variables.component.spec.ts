import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveVariablesComponent } from './incentive-variables.component';

describe('IncentiveVariablesComponent', () => {
  let component: IncentiveVariablesComponent;
  let fixture: ComponentFixture<IncentiveVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentiveVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
