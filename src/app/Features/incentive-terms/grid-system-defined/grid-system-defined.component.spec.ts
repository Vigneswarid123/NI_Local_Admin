import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSystemDefinedComponent } from './grid-system-defined.component';

describe('GridSystemDefinedComponent', () => {
  let component: GridSystemDefinedComponent;
  let fixture: ComponentFixture<GridSystemDefinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSystemDefinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSystemDefinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
