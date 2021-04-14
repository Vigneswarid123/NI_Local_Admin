import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubscriptionGroupComponent } from './edit-subscription-group.component';

describe('EditSubscriptionGroupComponent', () => {
  let component: EditSubscriptionGroupComponent;
  let fixture: ComponentFixture<EditSubscriptionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubscriptionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubscriptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
