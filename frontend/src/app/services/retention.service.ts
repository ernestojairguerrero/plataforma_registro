import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetentionService {

  apiUrl = environment.apiUrl;

  private _httpClint = inject(HttpClient);
  private retention: BehaviorSubject<any> = new BehaviorSubject(null);

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

  addRetention(data: any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}retentions-create`, data)
      .pipe(
        tap(response => {
          this.retention.next(response)
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

  editRetention(id: number, data:any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}retentions-update/${id}`, data)
      .pipe(
        tap(response => {
          this.retention.next(response)
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


  getRetentionId(id: number): Observable<any> {
    return this._httpClint.get(`${this.apiUrl}retentions-show/${id}`)
      .pipe(
        tap(response => {
          this.retention.next(response)
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

  retentionsDescriptionAdmin(id: number, data: any): Observable<any> {
    return this._httpClint.put(`${this.apiUrl}retentionsDescriptionAdmin/${id}`, data)
      .pipe(
        tap(response => {
          this.retention.next(response);
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
