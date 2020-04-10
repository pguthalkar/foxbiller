import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { AuthGuard } from './core/auth.guard';
const routes: Routes = [
  { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'import', loadChildren: './import-data/import-data.module#ImportDataModule' },
  { path: 'users', loadChildren: './users/users.module#UsersModule' },
  { path: 'meter', loadChildren: './meter-details/meter-details.module#MeterDetailsModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingModule' },
  { path: 'login', component: UserLoginComponent },
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full'
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
