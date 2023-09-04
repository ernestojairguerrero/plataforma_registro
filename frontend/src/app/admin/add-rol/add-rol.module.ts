import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRolComponent } from './add-rol.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { addRolRoutes } from './add-user.routing';
import { ComponentModule } from 'src/app/components/component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddRolComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(addRolRoutes),
    MaterialModule,
    ComponentModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AddRolModule { }
