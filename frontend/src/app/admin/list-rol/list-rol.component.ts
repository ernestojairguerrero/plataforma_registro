import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { RolService } from 'src/app/services/rol.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-rol',
  templateUrl: './list-rol.component.html',
  styleUrls: ['./list-rol.component.scss']
})


export class ListRolComponent {

  roles: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _roleService = inject(RolService);

  ngOnInit(): void {
    this.getRole();

  }

  getRole(): any {
    return this._roleService.getRole()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.roles = response.data;
          } else {
            return ;
          }
        },
      });
  }

  userDelete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el rol de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._roleService.userDelete(id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: (response: any) => {
              this.getRole();
              if (response.success === true) {
                Swal.fire({
                  icon: 'success',
                  title: 'Eliminado correctamente',
                  showConfirmButton: false,
                  timer: 2000
                });
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
              Swal.fire({
                icon: 'error',
                title: 'Lo sentimos, se ha presentado un error',
                showConfirmButton: false,
                timer: 2000
              });
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
