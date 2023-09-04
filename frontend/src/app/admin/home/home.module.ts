import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { homeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { ComponentModule } from 'src/app/components/component.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    MaterialModule,
    ComponentModule

  ]
})
export class HomeModule { }
