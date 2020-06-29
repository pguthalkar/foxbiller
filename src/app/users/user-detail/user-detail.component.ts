import { Component, OnInit } from '@angular/core';
import { AlertService,MeterService, UserService } from '../../_services/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(private route:ActivatedRoute, private userService : UserService, private meterService:MeterService) { }
  userData ;
  invoices;
  ngOnInit() {
    const userId: string = this.route.snapshot.paramMap.get('id');
    let condn = {
      'key': 'uid',
      'value': userId
    }
    this.userService.getUserCondn(condn).subscribe(userData => {


      this.userData = userData ? userData[0] : {};
      
      this.meterService.getInvoicesCondn({ key : 'customerId',operator:'==',value:this.userData.customerNumber}).subscribe( invoices => {
        this.invoices = invoices;
        this.invoices = this.invoices.map(invoice => {
          invoice.invoiceDate = new Date(invoice.invoiceDate.seconds*1000);
          return invoice;
        })
      })

    });
  }

}
