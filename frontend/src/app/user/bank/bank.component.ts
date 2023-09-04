import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {

  dataActual: any = [];

  bankForm!: FormGroup;
  nameFile = '';

  bank: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _bankService = inject(BankService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any;

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getBankId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.bankForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.bankForm.get('user_id').setValue(user_id);

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.bankForm.get('file')?.setValue(file);
    }
  }

  addBank(): void {
    this.validateForm();
    if (this.bankForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.bankForm.value)) {
      if (key === 'file') {
        data.append(key, this.bankForm.get(key)?.value);
      } else {
        data.append(key, this.bankForm.value[key]);
      }
    }
    this._bankService.addBank(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 8);
            this.updateStepEdit(this.data[0].id, 8);
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

  editBank(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.bankForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.bankForm.value)) {
      if (key === 'file') {
        const fileValue = this.bankForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.bankForm.value[key]);
      }
    }

    this._bankService.editBank(clientId, data)
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

  getBankId(id: number): any {
    return this._bankService.getBankId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.bankForm.controls['description_user'].setValue(this.bank?.description_user);
            this.bank = response.data;
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
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
