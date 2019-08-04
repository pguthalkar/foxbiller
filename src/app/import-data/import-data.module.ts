import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportDataRoutingModule } from './import-data-routing.module';
import { ImportComponent } from './import/import.component';


@NgModule({
  declarations: [ImportComponent],
  imports: [
    CommonModule,
    ImportDataRoutingModule
  ]
})
export class ImportDataModule { }
