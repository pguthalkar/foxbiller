import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, SharedService } from '../../_services/index';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource,MatSort} from '@angular/material';
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
  displayedColumns = ['name', 'email', 'role','company'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private userService: UserService, private router: Router, private sharedService:SharedService) { }
  
  ngOnInit() {
    this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));;
    let condn = {
      'key' : 'parent',
      'value' : this.loggedInUser.uid
    }
    if(this.loggedInUser.role == 'master') {
      this.userService.getAllUser().subscribe( userData => {
        this.users = userData;
        
        this.dataSource = new MatTableDataSource<any>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    else {
      this.userService.getUserCondn(condn).subscribe( userData => {
        this.users = userData;
        
        this.dataSource = new MatTableDataSource<any>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    

  }

  addUserNavigate() {
    this.router.navigate(['/users/add']);  
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}



