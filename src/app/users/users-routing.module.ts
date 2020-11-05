import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListUserComponent } from './list-user/list-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component : ListUserComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component : AddUserComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    component : AddUserComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'user-detail/:id',
    component : UserDetailComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'user-reset-password',
    component : ResetPasswordComponent 
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
