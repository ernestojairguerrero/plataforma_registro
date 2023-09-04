import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  apiUrl = environment.apiUrl;

  private _httpClint = inject(HttpClient);
  private userProfile: BehaviorSubject<any> = new BehaviorSubject(null);

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return 'Not Found: ${error.message}';
      }
      case 403: {
        return 'Access Denied: ${error.message}';
      }
      case 500: {
        return 'Internal Server Error: ${error.message}';
      }
      default: {
        return 'Unknown Server Error: ${error.message}';
      }

    }
  }

  getUserProfileId(id: number): Observable<any> {
    return this._httpClint.get(`${this.apiUrl}user_profiles-show/${id}`)
      .pipe(
        tap(response => {
          this.userProfile.next(response)
        }),
        catchError((error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            return errorMsg = `Error: ${error.error.message}`;
          } else {
            return errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }

  addUserProfiles(data: any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}user_profiles-create`, data)
      .pipe(
        tap(response => {
          this.userProfile.next(response)
        }),
        catchError((error) => {
          let errorMsg: string;
          if(error.error instanceof ErrorEvent){
            return errorMsg = `Error: ${error.error.message}`;
          }else{
            return errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      )
  }


  editUserProfile(id: number, data:any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}user_profiles-update/${id}`, data)
      .pipe(
        tap(response => {
          this.userProfile.next(response)
        }),
        catchError((error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            return errorMsg = `Error: ${error.error.message}`;
          } else {
            return errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }

  userProfilesDescriptionAdmin(id: number, data: any): Observable<any> {
    return this._httpClint.put(`${this.apiUrl}userProfilesDescriptionAdmin/${id}`, data)
      .pipe(
        tap(response => {
          this.userProfile.next(response);
        }),
        catchError((error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            return errorMsg = `Error: ${error.error.message}`;
          } else {
            return errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }


}
