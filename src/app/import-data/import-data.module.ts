import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportDataRoutingModule } from './import-data-routing.module';
import { ImportComponent } from './import/import.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [ImportComponent],
  imports: [
    CommonModule,
    ImportDataRoutingModule,
    DragDropModule,
    MatButtonModule
  ]
})
export class ImportDataModule { }
