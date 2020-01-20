import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {of} from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor() {
  }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot,
              routeStateSnapshot: RouterStateSnapshot) {
    return of(true);
  }
}
