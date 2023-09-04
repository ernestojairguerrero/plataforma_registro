import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiUrl;

  private _httpClint = inject(HttpClient);
  private user: BehaviorSubject<any> = new BehaviorSubject(null);

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

  addUser(data: any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}users-create`, data)
      .pipe(
        tap(response => {
          this.user.next(response)
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

  updateStepUser(id: number, newStepValue: number): Observable<any> {
    const requestData = { step: newStepValue };
    return this._httpClint.put(`${this.apiUrl}users-updateStep/${id}`, requestData)
      .pipe(
        tap(response => {
          this.user.next(response);
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

  getUser(): Observable<any> {
    return this._httpClint.get(`${this.apiUrl}users`)
      .pipe(
        tap(response => {
          this.user.next(response)
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

  getUserId(id: number): Observable<any> {
    return this._httpClint.get(`${this.apiUrl}users-show/${id}`)
      .pipe(
        tap(response => {
          this.user.next(response)
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

  userDelete(id: number): Observable<any> {
    return this._httpClint.delete(`${this.apiUrl}users-destroy/${id}`)
      .pipe(
        tap(response => {
          this.user.next(response)
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

  updateStepEdit(id: number, newStepValue: number): Observable<any> {
    const requestData = { step_edit: newStepValue };
    return this._httpClint.put(`${this.apiUrl}users-updateStepEdit/${id}`, requestData)
      .pipe(
        tap(response => {
          this.user.next(response);
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

  desactiveActiveUser(id: number, active: number): Observable<any> {
    const requestData = { active: active };
    return this._httpClint.put(`${this.apiUrl}users-desactiveActiveUser/${id}`, requestData)
      .pipe(
        tap(response => {
          this.user.next(response);
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
