import { Component, inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  users: any = [];
  userData: any = localStorage.getItem('data');
  data: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _userService = inject(UserService);

  ngOnInit(): void {
    this.data = JSON.parse(this.userData);
    this.getUser(this.data[0].id);
  }

  getUser(id:number): any {
    return this._userService.getUserId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if(response.success === true){
            this.users = response.data[0];

          }
        },
      });
  }



}
