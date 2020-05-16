import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MeterService, SharedService, FirebaseService, AlertService } from '../../_services/index';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
    selector: 'app-list-meters',
    templateUrl: './list-meters.component.html',
    styleUrls: ['./list-meters.component.css']
})

export class ListMetersComponent implements OnInit {

    meters;
    selection = new SelectionModel<any>(true, []);

    dataSource;
    loggedInUser;
    displayedColumns = ['Select', 'MeterSerialNumber', 'ReadingTime', 'CustomerName', 'type', 'status', 'meterCondition', 'invoice','action'];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private meterService: MeterService, private router: Router, public sharedService: SharedService, private route: ActivatedRoute, private firebaseService: FirebaseService, private alertService: AlertService) { }

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

        // const type: string = this.route.snapshot.paramMap.get('type');
        let type;
        let arrParams = window.location.pathname.split("/").filter(function(el) {
            return el != null && el != "";
          });
          if (arrParams && arrParams[arrParams.length -1]) {
            type = arrParams[arrParams.length -1];
          }
        this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
        let condn = {
            'key': 'uid',
            'value': this.loggedInUser.uid
        }
        if (type != 'all') {
            this.meterService.getMeterDetailCondn({ 'key': 'type', 'value': type }, condn).subscribe((meterData: any) => {
                let lastmonthDate = new Date(meterData[0].ReadingTimeTimestamp);
                lastmonthDate.setMonth(lastmonthDate.getMonth() - 1);
                let condn = {
                    'key': 'ReadingTimeTimestamp',
                    'value': lastmonthDate.getTime(),
                    'operator': '>='
                };
                let isFetchInvoice = false;
                this.meterService.getInvoicesCondn(condn).subscribe(invoiceData => {
                    let currentMeterSerialNumbers = invoiceData.map((meter: any) => meter.MeterSerialNumber);


                    this.meters = meterData.map(meter => {
                        if (currentMeterSerialNumbers.includes(meter.MeterSerialNumber)) {
                            meter['isInvoice'] = true;
                        } else {
                            meter['isInvoice'] = false;
                        }
                        meter['totalAmount'] = this.sharedService.getMeterTotalAmount(meter.MeterType,meter) || 0;
                        return meter;
                    });
                    
                    this.dataSource = new MatTableDataSource<any>(this.meters);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            });
        }
        else {
            var date = new Date();
            let currentDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
            this.meterService.getAllMeter(condn).subscribe((meterData: any) => {
                let lastmonthDate = new Date(meterData[0].ReadingTimeTimestamp);
                lastmonthDate.setMonth(lastmonthDate.getMonth() - 1);
                let condn = {
                    'key': 'ReadingTimeTimestamp',
                    'value': lastmonthDate.getTime(),
                    'operator': '>='
                };
                let isFetchInvoice = false;
                this.meterService.getInvoicesCondn(condn).subscribe(invoiceData => {
                    let currentMeterSerialNumbers = invoiceData.map((meter: any) => meter.MeterSerialNumber);


                    meterData = meterData.map((meter: any) => {
                        if (currentMeterSerialNumbers.includes(meter.MeterSerialNumber)) {
                            meter['isInvoice'] = true;
                        } else {
                            meter['isInvoice'] = false;
                        }
                        meter['totalAmount'] = this.sharedService.getMeterTotalAmount(meter.MeterType,meter) || 0;
                        return meter;
                    });
                    meterData = this.aggregateMeterData(meterData);
                    // let arrMeter = this.removeDuplicates(meterData, 'MeterSerialNumber');
                    this.meters = meterData.map(meter => {
                        if (meter['ReadingTimeTimestamp'] >= currentDate) {
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

    aggregateMeterData(meterData) {
        // let arrMeter = meterData.map( meter => {

        // });
        let arrMeter = {};
        for (const meter of meterData) {
            if (!arrMeter[meter.MeterSerialNumber]) {
                arrMeter[meter.MeterSerialNumber] = meter;
            }
        }
        // let keys = Object.values(arrMeter);
        return Object.values(arrMeter);
        // console.log(arrMeter);
    }

    isAllSelected() {
        if (this.dataSource) {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.length;
            return numSelected === numRows;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => {
                this.selection.select(row);
            });
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    bulkAction($event) {
        let value = $event.target.value;
        //let meterIds = this.selection.selected.map( row => row._id);
        if (value == 'invoice' && this.selection.selected.length > 0) {
            this.createInvoice(this.selection.selected);
        }
    }

    createInvoice(meters) {
        if(!Array.isArray(meters)) {
            let temp = [];
            temp.push(meters);
            meters = temp;
        }
        let lastmonthDate = new Date(meters[0].ReadingTimeTimestamp);
        lastmonthDate.setMonth(lastmonthDate.getMonth() - 1);
        let condn = {
            'key': 'ReadingTimeTimestamp',
            'value': lastmonthDate.getTime(),
            'operator': '>='
        };
        let isFetchInvoice = false;
        this.meterService.getInvoicesCondn(condn).subscribe(resData => {
            if (isFetchInvoice) {
                return false;
            }
            isFetchInvoice = true;
            let currentMeterSerialNumbers = resData.map((meter: any) => meter.MeterSerialNumber)

            var batch = this.firebaseService.getBatch();
            let invoiceCollection = this.firebaseService.getInvoiceCollection();
            let index = 1;
            for (const meter of meters) {
                

                if (!currentMeterSerialNumbers.includes(meter.MeterSerialNumber) && meter.totalAmount) {
                    let docId = 'INVO' + new Date().getTime() + index;
                    index++;
                    let invoice = {};
                    invoice['customerId'] = meter.CustomerNumber;
                    invoice['customerName'] = meter.CustomerName;
                    invoice['invoiceDate'] = new Date();
                    invoice['ReadingTime'] = meter.ReadingTime;
                    invoice['ReadingTimeTimestamp'] = meter.ReadingTimeTimestamp;
                    invoice['lastElectricityEnergy'] = meter.lastElectricityEnergy  || 0;
                    invoice['lastCoolingEnergy'] = meter.lastCoolingEnergy || 0;
                    invoice['lastVolumeWater'] = meter.lastVolumeWater || 0;
                    invoice['ElectricityEnergy'] = meter.ElectricityEnergy || 0;
                    invoice['CoolingEnergy'] = meter.CoolingEnergy || 0;
                    invoice['VolumeWater'] = meter.VolumeWater || 0;
                    invoice['uid'] = meter.uid;
                    invoice['MeterType'] = this.sharedService.getMeterType(meter.MeterType);
                    invoice['totalAmount'] = meter.totalAmount;
                    invoice['MeterSerialNumber'] = meter.MeterSerialNumber;
                    invoice['invoiceId'] = docId;
                    let ref = invoiceCollection.doc(docId);
                    batch.set(ref, invoice);
                }

            }
            batch.commit().then(resData => {
                isFetchInvoice = true;
                // console.log(resData);
                this.alertService.success("Successfully Invoices Created.");
                this.selection.clear()
                // alert('done');
            }).catch(err => {
                console.log(err);
            });
        })
    }


}
