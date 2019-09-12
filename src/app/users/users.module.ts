import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { AlertService, UserService,SharedService } from '../_services/index';
import { MatTableModule, MatFormFieldModule, MatSelectModule, MatInputModule,  MatDatepickerModule, MatNativeDateModule, MatCardModule,MatButtonModule,MatPaginatorModule } from '@angular/material';
import { AddUserComponent } from './add-user/add-user.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ListUserComponent, AddUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
    UserService,
    SharedService
],
})
export class UsersModule { }
