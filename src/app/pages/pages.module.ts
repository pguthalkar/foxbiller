import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { UserLoginComponent } from './user-login/user-login.component';
import { AlertService, UserService,SharedService } from '../_services/index';

@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  declarations: [
    UserLoginComponent
  ],
  exports: [
    UserLoginComponent
  ],
  
  providers: [
    AlertService,
    UserService,
    SharedService
  ]
})

export class PagesModule {}
