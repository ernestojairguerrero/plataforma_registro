import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailUserComponent } from './detail-user.component';
import { RouterModule } from '@angular/router';
import { detailsUserRoutes } from './detail-user.routing';
import { MaterialModule } from 'src/app/material.module';
import { ComponentModule } from 'src/app/components/component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DetailUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(detailsUserRoutes),
    MaterialModule,
    ComponentModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DetailUserModule { }
