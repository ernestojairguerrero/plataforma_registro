import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUserComponent } from './list-user.component';
import { listUserRoutes } from './list-user.routing';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';



@NgModule({
  declarations: [
    ListUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(listUserRoutes),
    MaterialModule,
    ComponentModule
  ]
})
export class ListUserModule { }
