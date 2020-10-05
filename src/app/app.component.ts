import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { UserService,SharedService } from './_services/index';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn = false  ;
  constructor(public auth: AuthService,private sharedService:SharedService) {

    this.sharedService.isLoggedIn.subscribe(data => this.isLoggedIn = data == '1' ? true : false); ;

   }
  title = 'code';
}
