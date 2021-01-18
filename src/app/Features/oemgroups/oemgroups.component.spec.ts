import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OemgroupsComponent } from './oemgroups.component';

describe('OemgroupsComponent', () => {
  let component: OemgroupsComponent;
  let fixture: ComponentFixture<OemgroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OemgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OemgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
