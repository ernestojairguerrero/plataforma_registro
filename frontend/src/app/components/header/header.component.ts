import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _router = inject(Router);

  private _authService = inject(AuthService);


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
