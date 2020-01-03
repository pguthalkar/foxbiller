import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMetersComponent } from './list-meters.component';

describe('ListMetersComponent', () => {
  let component: ListMetersComponent;
  let fixture: ComponentFixture<ListMetersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMetersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMetersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
