import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RetentionService } from 'src/app/services/retention.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-retention',
  templateUrl: './retention.component.html',
  styleUrls: ['./retention.component.scss']
})
export class RetentionComponent implements OnInit {

  dataActual: any = [];

  retentionForm!: FormGroup;
  nameFile = '';
  retention: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _retentionService = inject(RetentionService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any;

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getRetentionId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.retentionForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.retentionForm.get('user_id').setValue(user_id);

  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.retentionForm.get('file')?.setValue(file);
    }
  }


  addRetention(): void {
    this.validateForm();
    if (this.retentionForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.retentionForm.value)) {
      if (key === 'file') {
        data.append(key, this.retentionForm.get(key)?.value);
      } else {
        data.append(key, this.retentionForm.value[key]);
      }
    }
    this._retentionService.addRetention(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 4);
            this.updateStepEdit(this.data[0].id, 4);
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

  getRetentionId(id: number): any {
    return this._retentionService.getRetentionId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.retention = response.data;
            this.retentionForm.controls['description_user'].setValue(this.retention?.description_user);
          }
        },
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

  editRetention(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.retentionForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.retentionForm.value)) {
      if (key === 'file') {
        const fileValue = this.retentionForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.retentionForm.value[key]);
      }
    }

    this._retentionService.editRetention(clientId, data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepEdit(this.data[0].id, stepEdit);
            Swal.fire({
              icon: 'success',
              title: 'Actualizado correctamente',
              showConfirmButton: false,
              timer: 2500
            });
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
    if (this.retentionForm.invalid) {
      this.retentionForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
