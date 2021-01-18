import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OemgrouppopupComponent } from './oemgrouppopup.component';

describe('OemgrouppopupComponent', () => {
  let component: OemgrouppopupComponent;
  let fixture: ComponentFixture<OemgrouppopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OemgrouppopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OemgrouppopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
