import { Component, OnInit, ViewChild ,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MeterService, SharedService } from '../../_services/index';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  histories;
  dataSource;
  loggedInUser;
  displayedColumns = ['ImportedDate', 'FileName', 'MetersImported', 'MetersNotImported', 'status'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog,private meterService: MeterService, private router: Router, public sharedService: SharedService, private route: ActivatedRoute) { }

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
    this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
    let condn = {
      'key': 'uid',
      'value': this.loggedInUser.uid
    }

      var date = new Date();
      let currentDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      this.meterService.getMeterHistory(condn).subscribe((meterData:any) => {

      
        this.histories = meterData.map( element => {
          if(this.sharedService.diff_minutes(new Date(), new Date(element.dateCreated.seconds * 1000 )) < 2 ) {
            element['isNew'] = true;
          } else {
            element['isNew'] = false;
          }
          return element;
        });
        this.dataSource = new MatTableDataSource<any>(this.histories);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    


  }

  openDialog(data,isSuccess): void {
   
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '850px',
      data:{ isSuccess : isSuccess, data : data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
   
    });
  }


}



@Component({
  selector: 'imported-status',
  templateUrl: './imported-status.html',
  styleUrls: ['./list.component.css']
})
export class DialogOverviewExampleDialog {


  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {
   
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  displayedColumns: string[] = ['date', 'meterId', 'status'];
  // success = this.success;
 
  dataSource = this.data.data.map(el => {
     el.date = new Date(el.date.seconds * 1000 );
     el.status = this.data.isSuccess ? 'Imported' : 'Failed';
     return el
  });

  

}