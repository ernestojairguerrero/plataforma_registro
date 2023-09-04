import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepStepComponent } from './step-step.component';

describe('StepStepComponent', () => {
  let component: StepStepComponent;
  let fixture: ComponentFixture<StepStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepStepComponent]
    });
    fixture = TestBed.createComponent(StepStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
