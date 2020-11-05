import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
(window as any).html2canvas = html2canvas;
import { AlertService, MeterService, UserService,SharedService } from '../../_services/index';
import { AngularFireFunctions } from '@angular/fire/functions';
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  @ViewChild('content',{ static: false }) content: ElementRef;

  constructor(private functions: AngularFireFunctions,private meterService: MeterService, private sharedService:SharedService, private route: ActivatedRoute,private userService:UserService,) { }
  invoiceData;
  settingData;
  ngOnInit() {
    this.settingData = this.sharedService.getLocalStorage('settingData') ? JSON.parse(this.sharedService.getLocalStorage('settingData')) : null;
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
  sendInvoice(contentDataURL)  {
    let html = '<html><body><p>Dear User,</p> <p> Here is your invoice.</p></body></html>';
    const callable = this.functions.httpsCallable('sendEmail');
    const obs = callable({ subject: 'Invoice' ,attachments:[
      {
          "type":"application/pdf",
          "name":"invoice.pdf",
          "data":contentDataURL,
          "html" : html
      },
    ],
    email: this.invoiceData.userData.email
  });

    obs.subscribe(async res => {
        console.log('email send');
    });
  }

  createPdf(isSendEmail = 0) {
    // var data = document.getElementById('contentToConvert');
    html2canvas(this.content.nativeElement).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      if(isSendEmail) {
        var binary = pdf.output();
        let pdfAttachment =  binary ? btoa(binary) : "";
        this.sendInvoice(pdfAttachment);
      } else {
       
        pdf.save('new-file.pdf'); // Generated PDF
      }

      
    });
  }


}
