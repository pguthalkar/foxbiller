import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';
import {SharedService } from '../_services/shared.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userData;
  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotifyService,
    private sharedService:SharedService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        
        this.userData = this.sharedService.getLocalStorage('user') ? JSON.parse(this.sharedService.getLocalStorage('user')) : null;
        if (!loggedIn || !this.userData) {
         
          console.log('access denied');
          this.notify.update('You must be logged in!', 'error');
          this.router.navigate(['/login']);
        }
        else {
          this.sharedService.changeData('1');
        }
      })
    );
  }
}
