/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

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
