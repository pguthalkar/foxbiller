import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SharedService } from '../../_services/index';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public auth: AuthService,
    private sharedService: SharedService) { }
  loggedInUser;

  ngOnInit() {
    this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
  }

}
