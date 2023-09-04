import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PayrollConceptService } from 'src/app/services/payroll-concept.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payroll-concept',
  templateUrl: './payroll-concept.component.html',
  styleUrls: ['./payroll-concept.component.scss']
})
export class PayrollConceptComponent implements OnInit {

  dataActual: any = [];

  payrollConceptForm!: FormGroup;
  nameFile = '';

  payrollConcept: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _payrollConceptService = inject(PayrollConceptService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  dataUser: any;

  ngOnInit(): void {
    this.dataUser = JSON.parse(this.user);
    this.getPayrollConcept(this.dataUser[0].id);
    this.getUserId(this.dataUser[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.dataUser[0].id;
    this.payrollConceptForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.payrollConceptForm.get('user_id').setValue(user_id);

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.payrollConceptForm.get('file')?.setValue(file);
    }
  }

  addPayrollConcept(): void {
    this.validateForm();
    if (this.payrollConceptForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.payrollConceptForm.value)) {
      if (key === 'file') {
        data.append(key, this.payrollConceptForm.get(key)?.value);
      } else {
        data.append(key, this.payrollConceptForm.value[key]);
      }
    }
    this._payrollConceptService.addPayrollConcept(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.dataUser[0].id, 7);
            this.updateStepEdit(this.dataUser[0].id, 7);
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

  editPayrollConcept(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.payrollConceptForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.payrollConceptForm.value)) {
      if (key === 'file') {
        const fileValue = this.payrollConceptForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.payrollConceptForm.value[key]);
      }
    }

    this._payrollConceptService.editPayrollConcept(clientId, data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado correctamente',
              showConfirmButton: false,
              timer: 2500
            }); this.updateStepEdit(this.dataUser[0].id, stepEdit);
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

  getPayrollConcept(id: number): any {
    return this._payrollConceptService.getPayrollConcept(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.payrollConcept = response.data;
            this.payrollConceptForm.controls['description_user'].setValue(this.payrollConcept?.description_user);
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

  updateStepUser(userId: number, newStepValue: number) {
    return this._userService.updateStepUser(userId, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
        },
      });
  }

  validateForm(): void {
    if (this.payrollConceptForm.invalid) {
      this.payrollConceptForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
