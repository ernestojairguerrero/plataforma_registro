import { Component, inject, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SupplierService } from 'src/app/services/supplier.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  dataActual: any = [];

  supplierForm!: FormGroup;
  nameFile = '';
  supplier: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _supplierService = inject(SupplierService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any;

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getSupplierId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.supplierForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.supplierForm.get('user_id').setValue(user_id);

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.supplierForm.get('file')?.setValue(file);
    }
  }

  addSupplier(): void {
    this.validateForm();
    if (this.supplierForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.supplierForm.value)) {
      if (key === 'file') {
        data.append(key, this.supplierForm.get(key)?.value);
      } else {
        data.append(key, this.supplierForm.value[key]);
      }
    }
    this._supplierService.addSupplier(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 3);
            this.updateStepEdit(this.data[0].id, 3);
            Swal.fire({
              icon: 'success',
              title: 'Guardado correctamente',
              showConfirmButton: false,
              timer: 2500
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al guardar',
              showConfirmButton: false,
              timer: 2500
            });
          }
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            showConfirmButton: false,
            timer: 2500
          });
        }
      });
  }

  updateStepUser(userId: number, newStepValue: number) {
    return this._userService.updateStepUser(userId, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
        },
      });
  }

  editSupplier(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.supplierForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.supplierForm.value)) {
      if (key === 'file') {
        const fileValue = this.supplierForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.supplierForm.value[key]);
      }
    }

    this._supplierService.editSupplier(clientId, data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado correctamente',
              showConfirmButton: false,
              timer: 2500
            });
            this.updateStepEdit(this.data[0].id, stepEdit);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar',
              showConfirmButton: false,
              timer: 2500
            });
          }
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            showConfirmButton: false,
            timer: 2500
          });
        }
      });
  }

  updateStepEdit(id: number, newStepValue) {

    return this._userService.updateStepEdit(id, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          setTimeout(() => {
            location.reload();
          }, 2000);
        },
      });
  }

  getSupplierId(id: number): any {
    return this._supplierService.getSupplierId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.supplier = response.data;

            this.supplierForm.controls['description_user'].setValue(this.supplier?.description_user);
          }
        },
      });
  }

  getUserId(id: number): any {
    return this._userService.getUserId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.dataActual = response.data[0];
          }
        },
      });
  }

  validateForm(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
