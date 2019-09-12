import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { AlertService, UserService,SharedService } from '../../_services/index';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public auth: AuthService, private sharedService:SharedService) { }
  userInfo;
  logout() {
    this.auth.signOut();
  }
  ngOnInit() {
    this.userInfo = this.sharedService.getLocalStorage('user') ? JSON.parse(this.sharedService.getLocalStorage('user')) : "";
  }

}
