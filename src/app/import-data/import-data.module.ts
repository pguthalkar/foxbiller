import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportDataRoutingModule } from './import-data-routing.module';
import { ImportComponent } from './import/import.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';

import { AlertModule } from '../_directives/alert.module';
import { AlertService } from '../_services/index';

@NgModule({
  declarations: [ImportComponent],
  imports: [
    CommonModule,
    ImportDataRoutingModule,
    DragDropModule,
    MatButtonModule,
    AlertModule
    
  ],
  providers: [
    // AlertService
],
})
export class ImportDataModule { }
