/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DMSNamesComponent } from './DMSNames.component';

describe('DMSNamesComponent', () => {
  let component: DMSNamesComponent;
  let fixture: ComponentFixture<DMSNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DMSNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DMSNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
