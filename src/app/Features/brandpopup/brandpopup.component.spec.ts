import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandpopupComponent } from './brandpopup.component';

describe('BrandpopupComponent', () => {
  let component: BrandpopupComponent;
  let fixture: ComponentFixture<BrandpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
