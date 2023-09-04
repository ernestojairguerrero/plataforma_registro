import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRolComponent } from './list-rol.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { listRolRoutes } from './list-rol.routing';
import { ComponentModule } from 'src/app/components/component.module';



@NgModule({
  declarations: [
    ListRolComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(listRolRoutes),
    MaterialModule,
    ComponentModule
  ]
})
export class ListRolModule { }
