/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GridRolesComponent } from './grid-roles.component';

describe('GridRolesComponent', () => {
  let component: GridRolesComponent;
  let fixture: ComponentFixture<GridRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
