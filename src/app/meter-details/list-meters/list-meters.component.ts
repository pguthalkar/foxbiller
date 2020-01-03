import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MeterService } from '../../_services/index';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-list-meters',
  templateUrl: './list-meters.component.html',
  styleUrls: ['./list-meters.component.css']
})
export class ListMetersComponent implements OnInit {

  meters;

  dataSource;
  loggedInUser;
  displayedColumns = ['MeterSerialNumber', 'ReadingTime', 'CustomerName'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private meterService: MeterService, private router: Router) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    let condn = {
      'key' : 'parent',
      'value' : this.loggedInUser.uid
    }

      this.meterService.getAllMeter().subscribe( userData => {
        this.meters = userData;
        
        this.dataSource = new MatTableDataSource<any>(this.meters);
      });
        

  }

  addUserNavigate() {
    this.router.navigate(['/meters/add']);  
  }

}
