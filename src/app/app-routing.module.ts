import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { AuthGuard } from './core/auth.guard';
const routes: Routes = [
  { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'import', loadChildren: () => import('./import-data/import-data.module').then(m => m.ImportDataModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'meter', loadChildren: () => import('./meter-details/meter-details.module').then(m => m.MeterDetailsModule) },
  { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
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
