import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
(window as any).html2canvas = html2canvas;
import { AlertService, MeterService, UserService,SharedService } from '../../_services/index';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  @ViewChild('content',{ static: false }) content: ElementRef;

  constructor(private meterService: MeterService, private sharedService:SharedService, private route: ActivatedRoute,private userService:UserService,) { }
  invoiceData;
  ngOnInit() {
    const invoiceId: string = this.route.snapshot.paramMap.get('id');
    let condn = {
      'key': 'invoiceId',
      'operator': '==',
      'value': invoiceId
    }
    this.meterService.getInvoicesCondn(condn).subscribe(invoiceData => {
      this.invoiceData = invoiceData ? invoiceData[0] : {};
      let condn = {
        'key' : 'customerNumber',
        'value' : this.invoiceData.customerId
      }
      this.userService.getUserCondn(condn).subscribe(userData => {

        this.invoiceData['userData'] = userData ? userData[0] : {};
        this.invoiceData['invoiceDate'] = new Date(this.invoiceData['invoiceDate'].seconds*1000);
        let lastBillDate = new Date(this.invoiceData['ReadingTimeTimestamp']);
        this.invoiceData['currentBilldate'] = new Date(this.invoiceData['ReadingTimeTimestamp']);
        lastBillDate.setMonth(lastBillDate.getMonth() - 1);
        // this.invoiceData['lastBillDate'] =lastBillDate;
        this.sharedService.getMeterLastReading(this.invoiceData.MeterType,this.invoiceData);

      })
    });

  }

  createPdf() {
    // var data = document.getElementById('contentToConvert');
    html2canvas(this.content.nativeElement).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }


}