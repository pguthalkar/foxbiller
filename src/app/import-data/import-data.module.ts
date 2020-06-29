import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportDataRoutingModule } from './import-data-routing.module';
import { ImportComponent } from './import/import.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule,MatDialogModule, MatSortModule,MatGridListModule, MatFormFieldModule, MatSelectModule, MatInputModule,  MatDatepickerModule, MatNativeDateModule, MatCardModule,MatButtonModule,MatPaginatorModule,MatChipsModule,MatListModule,MatDividerModule } from '@angular/material';

import { AlertModule } from '../_directives/alert.module';
import { MeterService } from '../_services/index';
import { ListComponent } from './list/list.component';
import { DialogOverviewExampleDialog } from './list/list.component';

@NgModule({
  declarations: [ImportComponent, ListComponent,DialogOverviewExampleDialog],
  imports: [
    CommonModule,
    ImportDataRoutingModule,
    DragDropModule,
    MatButtonModule,
    AlertModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatGridListModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatListModule,
    MatDialogModule
    
  ],
  providers: [
    MeterService
],
})
export class ImportDataModule { }
