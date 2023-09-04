import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountPlanService } from 'src/app/services/account-plan.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-plan',
  templateUrl: './account-plan.component.html',
  styleUrls: ['./account-plan.component.scss']
})
export class AccountPlanComponent {

  dataActual: any = [];

  accountPlanForm!: FormGroup;
  nameFile = '';

  accountPlan: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _accountPlanSerice = inject(AccountPlanService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any;

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getAccountPlanId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.accountPlanForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.accountPlanForm.get('user_id').setValue(user_id);

  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.accountPlanForm.get('file')?.setValue(file);
    }
  }

  addAccountPlan(): void {
    this.validateForm();
    if (this.accountPlanForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.accountPlanForm.value)) {
      if (key === 'file') {
        data.append(key, this.accountPlanForm.get(key)?.value);
      } else {
        data.append(key, this.accountPlanForm.value[key]);
      }
    }
    this._accountPlanSerice.addAccountPlan(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 9);
            this.updateStepEdit(this.data[0].id, 9);
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

  editAccountPlan(clientId: number): void {
    const stepEdit = this.dataActual.step
    this.validateForm();
    if (this.accountPlanForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.accountPlanForm.value)) {
      if (key === 'file') {
        const fileValue = this.accountPlanForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.accountPlanForm.value[key]);
      }
    }

    this._accountPlanSerice.editAccountPlan(clientId, data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            Swal.fire({
              icon: 'error',
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

  getAccountPlanId(id: number): any {
    return this._accountPlanSerice.getAccountPlanId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.accountPlan = response.data;
            this.accountPlanForm.controls['description_user'].setValue(this.accountPlan?.description_user);
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

  updateStepUser(userId: number, newStepValue: number) {
    return this._userService.updateStepUser(userId, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          setTimeout(() => {
            location.reload();
          }, 2000);
        },
      });
  }

  updateStepEdit(id: number, newStepValue) {
    return this._userService.updateStepEdit(id, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
        },
      });
  }

  validateForm(): void {
    if (this.accountPlanForm.invalid) {
      this.accountPlanForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
