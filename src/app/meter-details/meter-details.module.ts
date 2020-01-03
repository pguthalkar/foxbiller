import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMetersComponent } from './list-meters/list-meters.component';
import { AlertService,SharedService,MeterService } from '../_services/index';

import { MeterRoutingModule } from './meter-routing.module';
import { MatTableModule, MatFormFieldModule, MatSelectModule, MatInputModule,  MatDatepickerModule, MatNativeDateModule, MatCardModule,MatButtonModule,MatPaginatorModule } from '@angular/material';
// import { AddUserComponent } from './add-user/add-user.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListMetersComponent],
  imports: [
    CommonModule,
    MeterRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  providers: [
    AlertService,
    MeterService,
    SharedService
],
})
export class MeterDetailsModule { }
