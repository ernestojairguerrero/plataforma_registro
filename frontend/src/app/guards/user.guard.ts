import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {


  private _router = inject(Router);

  canActivate(): boolean {
    const token = localStorage.getItem('token')
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    if (token) {
      if(isAdmin === 0){
        return true;
      }else{
        this._router.navigate(['/home']);
        return false;
      }
    } else{
      this._router.navigate(['/login']);
      window.localStorage.clear();
      return false;
    }
  }
}
