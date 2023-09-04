import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCompanyComponent } from './list-company.component';
import { RouterModule } from '@angular/router';
import { listCompanyRoutes } from './list-company.routing';
import { MaterialModule } from 'src/app/material.module';
import { ComponentModule } from 'src/app/components/component.module';



@NgModule({
  declarations: [
    ListCompanyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(listCompanyRoutes),
    MaterialModule,
    ComponentModule
  ]
})
export class ListCompanyModule { }
