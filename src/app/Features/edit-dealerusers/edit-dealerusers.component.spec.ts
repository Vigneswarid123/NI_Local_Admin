import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDealerusersComponent } from './edit-dealerusers.component';

describe('EditDealerusersComponent', () => {
  let component: EditDealerusersComponent;
  let fixture: ComponentFixture<EditDealerusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDealerusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDealerusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
