import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting-routing.module';
import { MetaDataComponent } from './meta-data/meta-data.component';
import { SettingComponent } from './setting.component';

import { MatStepperModule, MatFormFieldModule, MatInputModule,MatButtonModule,MatSelectModule,MatDatepickerModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService, UserService, SharedService, MeterService } from '../_services/index';
import { AlertModule } from '../_directives/alert.module';
@NgModule({
  declarations: [MetaDataComponent, SettingComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    AlertModule
  ],
  providers: [
    AlertService,
    UserService,
    SharedService,
    MeterService
],
})
export class SettingModule { }
