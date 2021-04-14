import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealeruserchangepwdpopupComponent } from './dealeruserchangepwdpopup.component';

describe('DealeruserchangepwdpopupComponent', () => {
  let component: DealeruserchangepwdpopupComponent;
  let fixture: ComponentFixture<DealeruserchangepwdpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealeruserchangepwdpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealeruserchangepwdpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
