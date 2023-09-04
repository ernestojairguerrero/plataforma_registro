import { Component, inject } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {


  dataActual: any = [];

  clientForm!: FormGroup;
  nameFile = '';
  user: any = localStorage.getItem('data');
  data: any;
  client: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _clientService = inject(ClientService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getClientId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.clientForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.clientForm.get('user_id').setValue(user_id);

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.clientForm.get('file')?.setValue(file);
    }
  }


  addClient(): void {
    this.validateForm();
    if (this.clientForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.clientForm.value)) {
      if (key === 'file') {
        data.append(key, this.clientForm.get(key)?.value);
      } else {
        data.append(key, this.clientForm.value[key]);
      }
    }
    this._clientService.addClient(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 2);
            this.updateStepEdit(this.data[0].id, 2);
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

  editClient(clientId: number): void {
    const stepEdit = this.dataActual.step
    this.validateForm();
    if (this.clientForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.clientForm.value)) {
      if (key === 'file') {
        const fileValue = this.clientForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.clientForm.value[key]);
      }
    }

    this._clientService.editClient(clientId, data)
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


  getClientId(id: number): any {
    return this._clientService.getClientId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.client = response.data;
            this.clientForm.controls['description_user'].setValue(this.client?.description_user);
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
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
