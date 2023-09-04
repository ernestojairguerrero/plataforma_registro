import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {

  dataActual: any = [];

  employeeForm!: FormGroup;
  nameFile = '';

  employee: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _employeeService = inject(EmployeeService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any;

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getEmployeeId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.employeeForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.employeeForm.get('user_id').setValue(user_id);

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.employeeForm.get('file')?.setValue(file);
    }
  }

  addEmployee(): void {
    this.validateForm();
    if (this.employeeForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.employeeForm.value)) {
      if (key === 'file') {
        data.append(key, this.employeeForm.get(key)?.value);
      } else {
        data.append(key, this.employeeForm.value[key]);
      }
    }
    this._employeeService.addEmployee(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 6);
            this.updateStepEdit(this.data[0].id, 6);
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

  editEmployee(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.employeeForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.employeeForm.value)) {
      if (key === 'file') {
        const fileValue = this.employeeForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.employeeForm.value[key]);
      }
    }

    this._employeeService.editEmployee(clientId, data)
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

  updateStepUser(userId: number, newStepValue: number) {
    return this._userService.updateStepUser(userId, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
        },
      });
  }

  getEmployeeId(id: number): any {
    return this._employeeService.getEmployeeId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.employeeForm.controls['description_user'].setValue(this.employee.description_user);
            this.employee = response.data;
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

  validateForm(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
