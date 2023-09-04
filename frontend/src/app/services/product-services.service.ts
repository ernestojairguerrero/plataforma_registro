import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {

  apiUrl = environment.apiUrl;

  private _httpClint = inject(HttpClient);
  private productServices: BehaviorSubject<any> = new BehaviorSubject(null);

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

  addProducServices(data: any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}products-create`, data)
      .pipe(
        tap(response => {
          this.productServices.next(response)
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


  getProductServiceId(id: number): Observable<any> {
    return this._httpClint.get(`${this.apiUrl}products-show/${id}`)
      .pipe(
        tap(response => {
          this.productServices.next(response)
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


  editProductService(id: number, data:any): Observable<any> {
    return this._httpClint.post(`${this.apiUrl}products-update/${id}`, data)
      .pipe(
        tap(response => {
          this.productServices.next(response)
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

  productServiceDescriptionAdmin(id: number, data: any): Observable<any> {
    return this._httpClint.put(`${this.apiUrl}productServiceDescriptionAdmin/${id}`, data)
      .pipe(
        tap(response => {
          this.productServices.next(response);
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
