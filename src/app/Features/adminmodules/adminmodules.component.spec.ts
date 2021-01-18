import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminmodulesComponent } from './adminmodules.component';

describe('AdminmodulesComponent', () => {
  let component: AdminmodulesComponent;
  let fixture: ComponentFixture<AdminmodulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminmodulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminmodulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
