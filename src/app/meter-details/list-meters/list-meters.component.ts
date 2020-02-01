import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MeterService, SharedService } from '../../_services/index';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list-meters',
  templateUrl: './list-meters.component.html',
  styleUrls: ['./list-meters.component.css']
})
export class ListMetersComponent implements OnInit {

  meters;

  dataSource;
  loggedInUser;
  displayedColumns = ['MeterSerialNumber', 'ReadingTime', 'CustomerName', 'type', 'meterCondition'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private meterService: MeterService, private router: Router, public sharedService: SharedService, private route: ActivatedRoute) { }

  /**
  * Set the paginator and sort after the view init since this component will
  * be able to query its view for the initialized paginator and sort.
  */
  // ngAfterViewInit() {

  // }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    const type: string = this.route.snapshot.paramMap.get('type');
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    let condn = {
      'key': 'parent',
      'value': this.loggedInUser.uid
    }
    if (type) {
      this.meterService.getMeterDetailCondn({'key': 'type', 'value':type}).subscribe(meterData => {
        this.meters = meterData;
        this.dataSource = new MatTableDataSource<any>(this.meters);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    else {
      this.meterService.getAllMeter().subscribe(meterData => {
        this.meters = meterData;
        this.dataSource = new MatTableDataSource<any>(this.meters);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }


  }

  addUserNavigate() {
    this.router.navigate(['/meters/add']);
  }


}
