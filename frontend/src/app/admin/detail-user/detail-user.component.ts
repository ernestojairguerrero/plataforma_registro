import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, timeout } from 'rxjs';
import { AccountPlanService } from 'src/app/services/account-plan.service';
import { BankService } from 'src/app/services/bank.service';
import { ClientService } from 'src/app/services/client.service';
import { CompanyService } from 'src/app/services/company.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PayrollConceptService } from 'src/app/services/payroll-concept.service';
import { ProductServicesService } from 'src/app/services/product-services.service';
import { RetentionService } from 'src/app/services/retention.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {

  dataUser: any;
  dataCompany: any
  dataClient: any
  dataSupplier: any
  dataRetention: any
  dataProductServices: any
  dataemployed: any
  dataPayrollConcept: any
  dataBank: any
  dataAccountPlan: any
  dataUserProfile: any


  companyForm!: FormGroup;
  clientForm!: FormGroup;
  supplierForm!: FormGroup;
  retentionForm!: FormGroup;
  productServicesForm!: FormGroup;
  employeeForm!: FormGroup;
  payrollConceptForm!: FormGroup;
  bankForm!: FormGroup;
  accountPlanForm!: FormGroup;
  userProfilesForm!: FormGroup;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _userService = inject(UserService);
  private _clientService = inject(ClientService);
  private _companyService = inject(CompanyService);
  private _supplierService = inject(SupplierService);
  private _retentionService = inject(RetentionService);
  private _productService = inject(ProductServicesService);
  private _employeeService = inject(EmployeeService);
  private _payrollConcept = inject(PayrollConceptService);
  private _bankService = inject(BankService);
  private _accountPlanService = inject(AccountPlanService);
  private _userProfileService = inject(UserProfileService);

  private _activatedRoute = inject(ActivatedRoute);

  private _fb = inject(FormBuilder);


  ngOnInit(): void {
    this.getUserId();
    this.initCompanyForm();
    this.initClientForm();
    this.initSupplierForm();
    this.initRetentionForm();
    this.initProductervicesForm();
    this.initEmployeeForm();
    this.initPayrollConceptForm();
    this.initBankForm();
    this.initAccountPlanForm();
    this.initUserProfilesForm();
  }

  initClientForm(): void {
    this.clientForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initCompanyForm(): void {
    this.companyForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initSupplierForm(): void {
    this.supplierForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initRetentionForm(): void {
    this.retentionForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initProductervicesForm(): void {
    this.productServicesForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initEmployeeForm(): void {
    this.employeeForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initPayrollConceptForm(): void {
    this.payrollConceptForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initBankForm(): void {
    this.bankForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  initAccountPlanForm(): void {
    this.accountPlanForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }
  
  initUserProfilesForm(): void {
    this.userProfilesForm = this._fb.group({
      description_admin: new FormControl('')
    });
  }

  getUserId(): any {
    this._activatedRoute.params.subscribe(
      e => {
        const id = e['id'];
        if (id) {
          this._userService.getUserId(id).subscribe(
            (response: any) => {
              if (response.success === true) {
                this.dataUser = response.data[0];
                this.dataCompany = response.data[0].company[0];
                this.companyForm.controls['description_admin'].setValue(this.dataCompany?.description_admin);

                this.dataClient = response.data[0].client[0];
                this.clientForm.controls['description_admin'].setValue(this.dataClient?.description_admin);

                this.dataSupplier = response.data[0].supplier[0];
                this.supplierForm.controls['description_admin'].setValue(this.dataSupplier?.description_admin);

                this.dataRetention = response.data[0].retention[0];
                this.retentionForm.controls['description_admin'].setValue(this.dataRetention?.description_admin);

                this.dataProductServices = response.data[0].product_service[0];
                this.productServicesForm.controls['description_admin'].setValue(this.dataProductServices?.description_admin);

                this.dataemployed = response.data[0].employee[0];
                this.employeeForm.controls['description_admin'].setValue(this.dataemployed?.description_admin);

                this.dataPayrollConcept = response.data[0].payroll_concept[0];
                this.payrollConceptForm.controls['description_admin'].setValue(this.dataPayrollConcept?.description_admin);

                this.dataBank = response.data[0].bank[0];
                this.bankForm.controls['description_admin'].setValue(this.dataBank?.description_admin);

                this.dataAccountPlan = response.data[0].account_plan[0];
                this.accountPlanForm.controls['description_admin'].setValue(this.dataAccountPlan?.description_admin);

                this.dataUserProfile = response.data[0].user_perfile[0];
                this.userProfilesForm.controls['description_admin'].setValue(this.dataUserProfile?.description_admin);

              } else {
              }
            }
          );
        }
      }
    );
  }

  companyDescriptionAdmin(id: number) {
    const data = this.companyForm.value;
    this._companyService.companyDescriptionAdmin(id, data)
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

  clientsDescriptionAdmin(id: number) {
    const data = this.clientForm.value;
    this._clientService.clientsDescriptionAdmin(id, data)
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

  supplierDescriptionAdmin(id: number) {
    const data = this.supplierForm.value;
    this._supplierService.supplierDescriptionAdmin(id, data)
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

  retentionsDescriptionAdmin(id: number) {
    const data = this.retentionForm.value;
    this._retentionService.retentionsDescriptionAdmin(id, data)
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

  productServiceDescriptionAdmin(id: number) {
    const data = this.productServicesForm.value;
    this._productService.productServiceDescriptionAdmin(id, data)
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

  employeeDescriptionAdmin(id: number) {
    const data = this.employeeForm.value;
    this._employeeService.employeeDescriptionAdmin(id, data)
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

  payrollConceptsDescriptionAdmin(id: number) {
    const data = this.payrollConceptForm.value;
    this._payrollConcept.payrollConceptsDescriptionAdmin(id, data)
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

  bankDescriptionAdmin(id: number) {
    const data = this.bankForm.value;
    this._bankService.bankDescriptionAdmin(id, data)
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

  accountPlanDescriptionAdmin(id: number) {
    const data = this.accountPlanForm.value;
    this._accountPlanService.accountPlanDescriptionAdmin(id, data)
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

  userProfilesDescriptionAdmin(id: number) {
    const data = this.userProfilesForm.value;
    this._userProfileService.userProfilesDescriptionAdmin(id, data)
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
          Swal.fire({
            icon: 'success',
            title: 'Estado actualizado correctamente',
            showConfirmButton: false,
            timer: 2500
          });
        },
      });
  }

  activeUser(id: number, newStepValue) {
    return this._userService.desactiveActiveUser(id, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Se activo el usuario',
            showConfirmButton: false,
            timer: 2500
          });
          setTimeout(() => {
            location.reload();
          }, 1500);
        },
      });
  }

  desactiveUser(id: number, newStepValue) {
    return this._userService.desactiveActiveUser(id, newStepValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Se desactivo el usuario',
            showConfirmButton: false,
            timer: 2500
          });
          setTimeout(() => {
            location.reload();
          }, 1500);
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
