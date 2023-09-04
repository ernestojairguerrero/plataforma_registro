import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  dataActual: any = [];

  companyForm!: FormGroup;
  nameSlog = '';
  nameSignature = '';

  company: any = '';

  user: any = localStorage.getItem('data');
  dataUser: any;


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _companyService = inject(CompanyService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);


  ngOnInit(): void {
    this.dataUser = JSON.parse(this.user);
    this.getCompanyId(this.dataUser[0].id);
    this.getUserId(this.dataUser[0].id);
    this.initCompanyForm();
  }

  initCompanyForm(): void {
    const user_id = this.dataUser[0].id;
    this.companyForm = this._fb.group({
      business_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      nit: new FormControl('', [Validators.required, Validators.minLength(2)]),
      slog: new FormControl(''),
      user: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.minLength(2)]),
      signature: new FormControl(''),
      company_category: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description_user: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
    });
    this.companyForm.get('user_id').setValue(user_id);
  }

  onSlogSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameSlog = file.name;
      this.companyForm.get('slog')?.setValue(file);
    }
  }

  onSignatureSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameSignature = file.name;
      this.companyForm.get('signature')?.setValue(file);
    }
  }

  addCompany(): void {
    this.validateForm();
    if (this.companyForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.companyForm.value)) {
      if (key === 'slog' || key === 'signature') {
        data.append(key, this.companyForm.get(key)?.value);
      } else {
        data.append(key, this.companyForm.value[key]);
      }
    }
    this._companyService.addCompany(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.dataUser[0].id, 1);
            this.updateStepEdit(this.dataUser[0].id, 1);
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
            icon: 'success',
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

  editCompany(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.companyForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.companyForm.value)) {
      if (key === 'file') {
        const fileValue = this.companyForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.companyForm.value[key]);
      }
    }

    this._companyService.editCompany(clientId, data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            Swal.fire({
              icon: 'success',
              title: 'Modificado correctamente',
              showConfirmButton: false,
              timer: 2500
            });
            this.updateStepEdit(this.dataUser[0].id, stepEdit);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al modificar',
              showConfirmButton: false,
              timer: 2500
            });
          }
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al modificar',
            showConfirmButton: false,
            timer: 2500
          });
        }
      });
  }

  getCompanyId(id: number): any {
    return this._companyService.getCompanyId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.company = response.data;
            this.companyForm.controls['business_name'].setValue(this.company?.business_name);
            this.companyForm.controls['nit'].setValue(this.company?.nit);
            this.companyForm.controls['email'].setValue(this.company?.email);
            this.companyForm.controls['user'].setValue(this.company?.user);
            this.companyForm.controls['password'].setValue(this.company?.password);
            this.companyForm.controls['company_category'].setValue(this.company?.company_category);
            this.companyForm.controls['description_user'].setValue(this.company.description_user);
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
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
    }
  }

  updateStepEdit(id: number, newStepValue) {

    return this._userService.updateStepEdit(id, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          location.reload();
        },
      });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
