import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../_services/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import {DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users;

  dataSource;
  loggedInUser;
  displayedColumns = ['name', 'email', 'role'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private userService: UserService, private router: Router,) { }
  
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    let condn = {
      'key' : 'parent',
      'value' : this.loggedInUser.uid
    }
    if(this.loggedInUser.role == 'master') {
      this.userService.getAllUser().subscribe( userData => {
        this.users = userData;
        
        this.dataSource = new MatTableDataSource<any>(this.users);
      });
    }
    else {
      this.userService.getUserCondn(condn).subscribe( userData => {
        this.users = userData;
        
        this.dataSource = new MatTableDataSource<any>(this.users);
      });
    }
    

  }

  addUserNavigate() {
    this.router.navigate(['/users/add']);  
  }

}



