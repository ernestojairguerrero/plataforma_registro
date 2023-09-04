import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent {

  users: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _userService = inject(UserService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.getUser();

  }
  getUserId(id: number) {
    return this._userService.getUserId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.users = response.data;
            this._router.navigateByUrl('/detail-user');
          }
        },
        error: () => {
        }
      });
  }

  getUser(): any {
    return this._userService.getUser()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response[0].success === true) {
            this.users = response[0].data;
          } else {
          }
        },
      });
  }

  userDelete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._userService.userDelete(id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: (response: any) => {
              if (response.success === true) {
                Swal.fire({
                  icon: 'success',
                  title: 'Eliminado correctamente',
                  showConfirmButton: false,
                  timer: 2000
                });
                this.getUser();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo eliminar',
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            },
            error: () => {
              console.log('Se ha presentado un error');
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
