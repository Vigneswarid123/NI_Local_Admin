import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSystemDefinedComponent } from './add-system-defined.component';

describe('AddSystemDefinedComponent', () => {
  let component: AddSystemDefinedComponent;
  let fixture: ComponentFixture<AddSystemDefinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSystemDefinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSystemDefinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
