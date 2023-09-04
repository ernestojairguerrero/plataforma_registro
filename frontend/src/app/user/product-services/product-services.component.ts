import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductServicesService } from 'src/app/services/product-services.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-services',
  templateUrl: './product-services.component.html',
  styleUrls: ['./product-services.component.scss']
})
export class ProductServicesComponent {

  dataActual: any = [];

  producServicesForm!: FormGroup;
  nameFile = '';
  productService: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _productService = inject(ProductServicesService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any;

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getProductServiceId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();


  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.producServicesForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control('', [Validators.required]),
      description_user: new FormControl(''),
    });
    this.producServicesForm.get('user_id').setValue(user_id);

  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.producServicesForm.get('file')?.setValue(file);
    }
  }

  addProducServices(): void {
    this.validateForm();
    if (this.producServicesForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.producServicesForm.value)) {
      if (key === 'file') {
        data.append(key, this.producServicesForm.get(key)?.value);
      } else {
        data.append(key, this.producServicesForm.value[key]);
      }
    }
    this._productService.addProducServices(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 5);
            this.updateStepEdit(this.data[0].id, 5);
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

  editProductService(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.producServicesForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.producServicesForm.value)) {
      if (key === 'file') {
        const fileValue = this.producServicesForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.producServicesForm.value[key]);
      }
    }

    this._productService.editProductService(clientId, data)
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

  getProductServiceId(id: number): any {
    return this._productService.getProductServiceId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.productService = response.data;
            this.producServicesForm.controls['description_user'].setValue(this.productService?.description_user);
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
    if (this.producServicesForm.invalid) {
      this.producServicesForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
