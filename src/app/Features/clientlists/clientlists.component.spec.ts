import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientlistsComponent } from './clientlists.component';

describe('ClientlistsComponent', () => {
  let component: ClientlistsComponent;
  let fixture: ComponentFixture<ClientlistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientlistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
