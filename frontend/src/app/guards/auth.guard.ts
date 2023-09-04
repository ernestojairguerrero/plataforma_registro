import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  private _router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token')

    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    if (token) {
      if(isAdmin === 1){
        return true;
      }else{
        this._router.navigate(['/step']);
        return false;
      }
    } else{
      this._router.navigate(['/login']);
      window.localStorage.clear();
      return false;
    }
  }

}
