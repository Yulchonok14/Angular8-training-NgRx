import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root'})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>){}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable <boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map(auth => auth.user),
      map( user => {
        const isAuth = !!user;
        if(isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    )
  }
}
