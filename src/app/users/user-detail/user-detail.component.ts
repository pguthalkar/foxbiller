import { Component, OnInit } from '@angular/core';
import { AlertService, FirebaseService, UserService } from '../../_services/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(private route:ActivatedRoute, private userService : UserService) { }
  userData ;
  ngOnInit() {
    const userId: string = this.route.snapshot.paramMap.get('id');
    let condn = {
      'key': 'uid',
      'value': userId
    }
    this.userService.getUserCondn(condn).subscribe(userData => {

      this.userData = userData ? userData[0] : {};

    });
  }

}
