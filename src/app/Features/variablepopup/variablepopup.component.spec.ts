import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablepopupComponent } from './variablepopup.component';

describe('VariablepopupComponent', () => {
  let component: VariablepopupComponent;
  let fixture: ComponentFixture<VariablepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
