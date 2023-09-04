import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {

  hide: boolean = true;

  loginForm!: FormGroup;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.initLoginForm();
    const token = localStorage.getItem('token');
    if (token) {
      this._router.navigate(['/home']);
      return;
    }
  }

  initLoginForm(): void {

    this.loginForm = this._fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  validateForm(): any {
    if (this.loginForm.invalid) {
      return Object.values(this.loginForm.controls)
        .forEach(control => { control.markAsTouched(); });
    }
  }

  login(): void {
    const data = this.loginForm.value;
    this._authService.login(data)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('data', JSON.stringify(response.data));
            localStorage.setItem('isAdmin', JSON.stringify(response.data[0].role.isAdmin));
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              showConfirmButton: false,
              timer: 1500
            });
            this._router.navigate(['/home']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Inicio de sesión fallido',
              text: 'Verifica tus credenciales e intenta nuevamente.',
            });
            window.localStorage.clear();
          }
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


}
