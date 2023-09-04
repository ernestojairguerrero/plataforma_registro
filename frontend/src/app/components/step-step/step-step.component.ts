import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-step-step',
  templateUrl: './step-step.component.html',
  styleUrls: ['./step-step.component.scss']
})
export class StepStepComponent implements OnInit {


  dataUser: any = [];
  dataCompany: any = [];
  dataClient: any = [];
  dataSupplier: any = [];
  dataRetention: any = [];
  dataProductServices: any = [];
  dataEmployed: any = [];
  dataPayrollConcept: any = [];
  dataBank: any = [];
  dataAccountPlan: any = [];
  dataUserProfile: any = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _userService = inject(UserService);


  userStorage: any = localStorage.getItem('data');
  data: any;

  ngOnInit() {
    this.data = JSON.parse(this.userStorage);
    this.getUserId(this.data[0].id)

  }

  getUserId(id: number) {
    return this._userService.getUserId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {

            this.dataUser = response.data[0];
            this.dataCompany = response.data[0].company[0];
            this.dataClient =response.data[0].client[0];
            this.dataSupplier =response.data[0].supplier[0];
            this.dataRetention =response.data[0].retention[0];
            this.dataProductServices =response.data[0].product_service[0];
            this.dataEmployed =response.data[0].employee[0];
            this.dataPayrollConcept =response.data[0].payroll_concept[0];
            this.dataBank =response.data[0].bank[0];
            this.dataAccountPlan =response.data[0].account_plan[0];
            this.dataUserProfile = response.data[0].user_perfile[0];
          }
        },
        error: () => {
          console.log('Se ha presentado un error');
        }
      });
  }

  company(): void{

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


}
