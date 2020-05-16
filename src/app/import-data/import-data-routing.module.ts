import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { ImportComponent } from './import/import.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  {
    path: 'import',
    component : ImportComponent,canActivate: [AuthGuard]
  },
  {
    path: 'list',
    component : ListComponent,canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportDataRoutingModule { }
