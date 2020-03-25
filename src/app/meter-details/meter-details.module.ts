import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMetersComponent } from './list-meters/list-meters.component';
import { AlertService,SharedService,MeterService } from '../_services/index';

import { MeterRoutingModule } from './meter-routing.module';
import { MatTableModule,MatCheckboxModule, MatSortModule,MatGridListModule, MatFormFieldModule, MatSelectModule, MatInputModule,  MatDatepickerModule, MatNativeDateModule, MatCardModule,MatButtonModule,MatPaginatorModule,MatChipsModule,MatListModule,MatDividerModule } from '@angular/material';
// import { AddUserComponent } from './add-user/add-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MeterDetailComponent } from './meter-detail/meter-detail.component';

@NgModule({
  declarations: [ListMetersComponent, MeterDetailComponent],
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
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  providers: [
    AlertService,
    MeterService,
    SharedService
],
})
export class MeterDetailsModule { }
