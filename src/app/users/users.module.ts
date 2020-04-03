import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { AlertService, UserService,SharedService } from '../_services/index';
import { MatTableModule, MatFormFieldModule, MatSelectModule, MatInputModule,  MatDatepickerModule, MatNativeDateModule, MatCardModule,MatButtonModule,MatPaginatorModule,MatDividerModule ,MatGridListModule,MatSortModule,MatChipsModule,MatListModule} from '@angular/material';
// import {MatTableModule,MatCheckboxModule, MatSortModule,MatGridListModule, MatFormFieldModule, MatSelectModule, MatInputModule,  MatDatepickerModule, MatNativeDateModule, MatCardModule,MatButtonModule,MatPaginatorModule,MatChipsModule,MatListModule,MatDividerModule } from '@angular/material';
import { AddUserComponent } from './add-user/add-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDetailComponent } from './user-detail/user-detail.component';
@NgModule({
  declarations: [ListUserComponent, AddUserComponent, UserDetailComponent],
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
    MatPaginatorModule,
    MatGridListModule,
    MatSortModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule
  ],
  providers: [
    AlertService,
    UserService,
    SharedService
],
})
export class UsersModule { }
