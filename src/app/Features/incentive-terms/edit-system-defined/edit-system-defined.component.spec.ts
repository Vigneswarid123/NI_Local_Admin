import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSystemDefinedComponent } from './edit-system-defined.component';

describe('EditSystemDefinedComponent', () => {
  let component: EditSystemDefinedComponent;
  let fixture: ComponentFixture<EditSystemDefinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSystemDefinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSystemDefinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
