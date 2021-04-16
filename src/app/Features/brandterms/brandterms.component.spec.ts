import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandtermsComponent } from './brandterms.component';

describe('BrandtermsComponent', () => {
  let component: BrandtermsComponent;
  let fixture: ComponentFixture<BrandtermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandtermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandtermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
