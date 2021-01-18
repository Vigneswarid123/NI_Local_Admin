import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempDashboardComponent } from './temp-dashboard.component';

describe('TempDashboardComponent', () => {
  let component: TempDashboardComponent;
  let fixture: ComponentFixture<TempDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
