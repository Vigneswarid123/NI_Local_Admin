import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealershipDetailComponent } from './dealership-detail.component';

describe('DealershipDetailComponent', () => {
  let component: DealershipDetailComponent;
  let fixture: ComponentFixture<DealershipDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealershipDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealershipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
