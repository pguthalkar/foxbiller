import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportDataRoutingModule } from './import-data-routing.module';
import { ImportComponent } from './import/import.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ImportComponent],
  imports: [
    CommonModule,
    ImportDataRoutingModule,
    DragDropModule
  ]
})
export class ImportDataModule { }
