import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolService } from 'src/app/services/rol.service';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit{


  roles: any[] = [];
  userForm!: FormGroup;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _roleService = inject(RolService);


  private _fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private _userServices = inject(UserService);
  private _router = inject(Router);


  ngOnInit(): void {
    this.getRole();
    this.initRoleForm();

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


  initRoleForm(): void {

    this.userForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.minLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      role_id: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
  }

  validateForm(){
    if(this.userForm.invalid){
      return Object.values(this.userForm.controls)
        .forEach(control => { control.markAsTouched(); });
    }
  }

  addUser(){
    const data = this.userForm.value;
    return this._userServices.addUser(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) =>{
          if (response[0].success === true){
            Swal.fire({
              icon: 'success',
              title: 'Creado correctamente',
              showConfirmButton: false,
              timer: 2000
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Lo sentimos no se pudo crear',
              showConfirmButton: false,
              timer: 2000
            });
          }
        },
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
