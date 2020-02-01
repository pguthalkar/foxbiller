import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMetersComponent } from './list-meters/list-meters.component';
import { MeterDetailComponent } from './meter-detail/meter-detail.component';
import { AuthGuard } from '../core/auth.guard';


const routes: Routes = [
  {
    path: '',
    component : ListMetersComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'filter/:type',
    component : ListMetersComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'detail/:id',
    component : MeterDetailComponent, canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeterRoutingModule { }
