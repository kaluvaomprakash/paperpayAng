import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ACustomerComponent } from './a-customer.component';

describe('ACustomerComponent', () => {
  let component: ACustomerComponent;
  let fixture: ComponentFixture<ACustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ACustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ACustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
