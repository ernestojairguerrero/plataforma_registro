import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfilesForm!: FormGroup;
  nameFile = '';

  dataActual: any = [];

  userProfile: any = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _userProfile = inject(UserProfileService);
  private _userService = inject(UserService);

  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  user: any = localStorage.getItem('data');
  data: any;

  ngOnInit(): void {
    this.data = JSON.parse(this.user);
    this.getUserProfileId(this.data[0].id);
    this.getUserId(this.data[0].id);
    this.initclientForm();
  }

  initclientForm(): void {
    const user_id = this.data[0].id;
    this.userProfilesForm = this._fb.group({
      file: new FormControl(''),
      user_id: this._fb.control(''),
      description_user: new FormControl(' '),
    });
    this.userProfilesForm.get('user_id').setValue(user_id);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nameFile = file.name;
      this.userProfilesForm.get('file')?.setValue(file);
    }
  }

  addUserProfiles(): void {
    this.validateForm();
    if (this.userProfilesForm.invalid) {
      return;
    }
    const data = new FormData();
    for (const key of Object.keys(this.userProfilesForm.value)) {
      if (key === 'file') {
        data.append(key, this.userProfilesForm.get(key)?.value);
      } else {
        data.append(key, this.userProfilesForm.value[key]);
      }
    }
    this._userProfile.addUserProfiles(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.updateStepUser(this.data[0].id, 10);
            this.updateStepEdit(this.data[0].id, 10);
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

  editUserProfile(clientId: number): void {
    const stepEdit = this.dataActual.step;
    this.validateForm();
    if (this.userProfilesForm.invalid) {
      return;
    }

    const data = new FormData();
    for (const key of Object.keys(this.userProfilesForm.value)) {
      if (key === 'file') {
        const fileValue = this.userProfilesForm.get(key)?.value;
        if (fileValue instanceof File) {
          data.append(key, fileValue);
        }
      } else {
        data.append(key, this.userProfilesForm.value[key]);
      }
    }

    this._userProfile.editUserProfile(clientId, data)
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

  getUserProfileId(id: number): any {
    return this._userProfile.getUserProfileId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.userProfile = response.data;
            this.userProfilesForm.controls['description_user'].setValue(this.userProfile?.description_user);
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
    if (this.userProfilesForm.invalid) {
      this.userProfilesForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

}
