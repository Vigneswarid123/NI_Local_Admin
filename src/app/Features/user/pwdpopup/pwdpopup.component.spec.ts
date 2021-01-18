import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdpopupComponent } from './pwdpopup.component';

describe('PwdpopupComponent', () => {
  let component: PwdpopupComponent;
  let fixture: ComponentFixture<PwdpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
