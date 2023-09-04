import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../components/component.module';
import { MaterialModule } from '../material.module';
import { userRoutes } from './user.routing';
import { ClientComponent } from './client/client.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CompanyComponent } from './company/company.component';
import { RetentionComponent } from './retention/retention.component';
import { ProductServicesComponent } from './product-services/product-services.component';
import { AccountPlanComponent } from './account-plan/account-plan.component';
import { BankComponent } from './bank/bank.component';
import { EmployeeComponent } from './employee/employee.component';
import { PayrollConceptComponent } from './payroll-concept/payroll-concept.component';
import { UserProfileComponent } from './user-profile/user-profile.component';



@NgModule({
  declarations: [
    UserComponent,
    ClientComponent,
    SupplierComponent,
    CompanyComponent,
    RetentionComponent,
    ProductServicesComponent,
    AccountPlanComponent,
    BankComponent,
    EmployeeComponent,
    PayrollConceptComponent,
    UserProfileComponent
  ],
  exports:[
    UserComponent,
    ClientComponent,
    SupplierComponent,
    CompanyComponent,
    RetentionComponent,
    ProductServicesComponent,
    AccountPlanComponent,
    BankComponent,
    EmployeeComponent,
    PayrollConceptComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    MaterialModule,
    ComponentModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class UserModule { }
