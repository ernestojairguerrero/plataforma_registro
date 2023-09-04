import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolService } from 'src/app/services/rol.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-rol',
  templateUrl: './add-rol.component.html',
  styleUrls: ['./add-rol.component.scss']
})
export class AddRolComponent implements OnInit {

  roleForm!: FormGroup;
  isChecked: string = 'No';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private _roleServices = inject(RolService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.initRoleForm();

  }

  initRoleForm(): void {

    this.roleForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      isAdmin: new FormControl(0),
    });
  }

  toggleChecked(): void {
    this.isChecked = this.isChecked === 'No' ? 'Si' : 'No';
  }

  validateForm(){
    if(this.roleForm.invalid){
      return Object.values(this.roleForm.controls)
        .forEach(control => { control.markAsTouched(); });
    }
  }


  addRol(){
    const data = this.roleForm.value;
    return this._roleServices.addRole(data)
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
