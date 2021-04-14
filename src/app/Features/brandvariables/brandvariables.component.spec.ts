import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandvariablesComponent } from './brandvariables.component';

describe('BrandvariablesComponent', () => {
  let component: BrandvariablesComponent;
  let fixture: ComponentFixture<BrandvariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandvariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandvariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
