import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any = localStorage.getItem('data');

  name: string = 'John Guerrero';

  ngOnInit() {
    this.user = JSON.parse(this.user);

  }


}
