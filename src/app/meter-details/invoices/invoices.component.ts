import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MeterService, SharedService, FirebaseService, AlertService } from '../../_services/index';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices;
  selection = new SelectionModel<any>(true, []);

  dataSource;
  loggedInUser;
  displayedColumns = ['InvoiceNo', 'InvoiceDate', 'CustomerName', 'meterId', 'totalAmount', 'action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private meterService: MeterService, private router: Router, public sharedService: SharedService, private route: ActivatedRoute, private firebaseService: FirebaseService, private alertService: AlertService) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
    let condn = {
      'key': 'uid',
      'operator': '==',
      'value': this.loggedInUser.uid
    }
    this.meterService.getInvoicesCondn(condn).subscribe(invoiceData => {
      this.invoices = invoiceData.map(invoice => {
        invoice['invoiceDate'] = new Date(invoice['invoiceDate'].seconds * 1000);
        return invoice;
      });
      this.dataSource = new MatTableDataSource<any>(this.invoices);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  deleteInvoice(invoiceData) {
    if(confirm('Are you sure to Delete ?')) {
    
      console.log(invoiceData);
      this.meterService.deleteInvoice(invoiceData.invoiceId);
    }
  }

}
