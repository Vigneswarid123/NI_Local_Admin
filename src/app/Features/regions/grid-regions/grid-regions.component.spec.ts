import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRegionsComponent } from './grid-regions.component';

describe('GridRegionsComponent', () => {
  let component: GridRegionsComponent;
  let fixture: ComponentFixture<GridRegionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRegionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
