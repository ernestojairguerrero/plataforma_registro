import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.scss']
})
export class ListCompanyComponent {

  companies: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _companyService = inject(CompanyService);

  ngOnInit(): void {
    this.getCompany();

  }

  getCompany(): any {
    return this._companyService.getCompany()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {

          if (response.success === true) {
            this.companies = response.data;
          } else {
            return ;
          }
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
