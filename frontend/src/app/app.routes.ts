import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { UserGuard } from "./guards/user.guard";

export const appRoutes: Routes = [
  { path: 'login', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login', loadChildren: () => import('./public/login/login.module').then(m => m.LoginModule)
  },

  // RUTAS CLIENTE
  {
    path: 'step', loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [UserGuard]
  },

  // RUTAS ADMINISTRACIÓN
  {
    path: 'home', loadChildren: () => import('./admin/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-user', loadChildren: () => import('./admin/list-user/list-user.module').then(m => m.ListUserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-user', loadChildren: () => import('./admin/add-user/add-user.module').then(m => m.AddUserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detail-user/:id', loadChildren: () => import('./admin/detail-user/detail-user.module').then(m => m.DetailUserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-company', loadChildren: () => import('./admin/list-company/list-company.module').then(m => m.ListCompanyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-rol', loadChildren: () => import('./admin/list-rol/list-rol.module').then(m => m.ListRolModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-rol', loadChildren: () => import('./admin/add-rol/add-rol.module').then(m => m.AddRolModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full'}

];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
    })],
})
export class AppRoutesModule { }
