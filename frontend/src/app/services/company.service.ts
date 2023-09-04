import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  apiUrl = environment.apiUrl;

  private _httpClint = inject(HttpClient);
  private company: BehaviorSubject<any> = new BehaviorSubject(null);

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

  getCompanyId(id: number): Observable<any> {
    return this._httpClint.get(`${this.apiUrl}companies-show/${id}`)
      .pipe(
        tap(response => {
          this.company.next(response)
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

  getCompany(): Observable<any> {
    return this._httpClint.get(`${this.apiUrl}companies`)
      .pipe(
        tap(response => {
          this.company.next(response)
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


  companyDescriptionAdmin(id: number, data: any): Observable<any> {
    return this._httpClint.put(`${this.apiUrl}companyDescriptionAdmin/${id}`, data)
      .pipe(
        tap(response => {
          this.company.next(response);
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


  addCompany(data: any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}companies-create`, data)
      .pipe(
        tap(response => {
          this.company.next(response)
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

  editCompany(id: number, data:any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}companies-update/${id}`, data)
      .pipe(
        tap(response => {
          this.company.next(response)
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
    const requestData = { step: newStepValue };
    return this._httpClint.put(`${this.apiUrl}clients-updateStepEdit/${id}`, requestData)
      .pipe(
        tap(response => {
          this.company.next(response);
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
