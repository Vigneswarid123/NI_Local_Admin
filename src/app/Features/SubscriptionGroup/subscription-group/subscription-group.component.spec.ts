import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionGroupComponent } from './subscription-group.component';

describe('SubscriptionGroupComponent', () => {
  let component: SubscriptionGroupComponent;
  let fixture: ComponentFixture<SubscriptionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
