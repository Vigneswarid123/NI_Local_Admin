import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerusersComponent } from './dealerusers.component';

describe('DealerusersComponent', () => {
  let component: DealerusersComponent;
  let fixture: ComponentFixture<DealerusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
