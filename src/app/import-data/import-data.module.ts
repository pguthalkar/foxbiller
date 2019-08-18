import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportDataRoutingModule } from './import-data-routing.module';
import { ImportComponent } from './import/import.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';

import { AlertComponent } from '../_directives/index';
import { AlertService } from '../_services/index';

@NgModule({
  declarations: [ImportComponent,AlertComponent],
  imports: [
    CommonModule,
    ImportDataRoutingModule,
    DragDropModule,
    MatButtonModule,
    
  ],
  providers: [
    AlertService
],
})
export class ImportDataModule { }
