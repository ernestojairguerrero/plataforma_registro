import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private _authService = inject(AuthService);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any[] = [];

  ngOnInit() {
    this.data = JSON.parse(this.user);

  }

  logout() {
    this._authService.logout()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Cierre de sesión exitoso',
            showConfirmButton: false,
            timer: 2000
          });
          window.localStorage.clear();
        this._router.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }



}
