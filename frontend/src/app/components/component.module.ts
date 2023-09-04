import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { StepStepComponent } from './step-step/step-step.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    StepStepComponent,
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    StepStepComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ]
})
export class ComponentModule { }
