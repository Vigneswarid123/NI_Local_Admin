import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineitemsComponent } from './lineitems.component';

describe('LineitemsComponent', () => {
  let component: LineitemsComponent;
  let fixture: ComponentFixture<LineitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
