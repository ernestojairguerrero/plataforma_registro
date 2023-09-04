import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollConceptComponent } from './payroll-concept.component';

describe('PayrollConceptComponent', () => {
  let component: PayrollConceptComponent;
  let fixture: ComponentFixture<PayrollConceptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollConceptComponent]
    });
    fixture = TestBed.createComponent(PayrollConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
