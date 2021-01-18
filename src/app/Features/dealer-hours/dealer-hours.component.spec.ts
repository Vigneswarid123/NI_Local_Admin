import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerHoursComponent } from './dealer-hours.component';

describe('DealerHoursComponent', () => {
  let component: DealerHoursComponent;
  let fixture: ComponentFixture<DealerHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
