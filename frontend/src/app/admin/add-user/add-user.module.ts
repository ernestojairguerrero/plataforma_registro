import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { MaterialModule } from 'src/app/material.module';
import { addUserRoutes } from './add-user.routing';
import { RouterModule } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(addUserRoutes),
    MaterialModule,
    ComponentModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AddUserModule { }
