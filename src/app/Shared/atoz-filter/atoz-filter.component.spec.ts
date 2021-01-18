import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtozFilterComponent } from './atoz-filter.component';

describe('AtozFilterComponent', () => {
  let component: AtozFilterComponent;
  let fixture: ComponentFixture<AtozFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtozFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtozFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
