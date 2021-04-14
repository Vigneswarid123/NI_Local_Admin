import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OembrandsComponent } from './oembrands.component';

describe('OembrandsComponent', () => {
  let component: OembrandsComponent;
  let fixture: ComponentFixture<OembrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OembrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OembrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
