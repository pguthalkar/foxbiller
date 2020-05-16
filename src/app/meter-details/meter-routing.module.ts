import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMetersComponent } from './list-meters/list-meters.component';
import { MeterDetailComponent } from './meter-detail/meter-detail.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { AuthGuard } from '../core/auth.guard';


const routes: Routes = [
  {
    path: 'all',
    component : ListMetersComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'heat',
    component : ListMetersComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'water',
    component : ListMetersComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'electricity',
    component : ListMetersComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'detail/:id',
    component : MeterDetailComponent, canActivate: [AuthGuard]
  },
  {
    path: 'invoices',
    component : InvoicesComponent, canActivate: [AuthGuard]
  },
  {
    path: 'invoice/:id',
    component : InvoiceDetailComponent, canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeterRoutingModule { }
