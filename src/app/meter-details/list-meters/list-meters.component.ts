import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MeterService, SharedService } from '../../_services/index';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of , pipe} from 'rxjs';
import { filter, map  } from 'rxjs/operators';
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
  displayedColumns = ['Select','MeterSerialNumber', 'ReadingTime', 'CustomerName', 'type','status', 'meterCondition'];
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
    const nums = of(1, 2, 3, 4, 5);
    const squareOddVals = pipe(
      filter((n: number) => n % 2 !== 0),
      map(n => n * n)
    );

    // Create an Observable that will run the filter and map functions
const squareOdd = squareOddVals(nums);

// Subscribe to run the combined functions
squareOdd.subscribe(x => console.log(x));
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
      var date = new Date();
      let currentDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      this.meterService.getAllMeter().subscribe(meterData => {
      
        let arrMeter = this.removeDuplicates(meterData,'MeterSerialNumber');
        this.meters = arrMeter.map( meter => {
          if(meter['ReadingTimeTimestamp'] >= currentDate) {
            meter['status'] = 'read';
          }
          else {
            meter['status'] = 'not read';
          }
          return meter;
        });
        this.dataSource = new MatTableDataSource<any>(this.meters);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }


  }
  removeDuplicates(array, key) {
    let lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }

  addImportNavigate() {
    this.router.navigate(['/import']);
  }



}
