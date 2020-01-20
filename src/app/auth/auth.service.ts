import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable()
export class AuthService {
  expirationDateTimer: number;

  constructor(private store: Store<fromApp.AppState>) {
  }

  setLogoutTimer(expirationDate: number) {
    this.expirationDateTimer = setTimeout(() => this.store.dispatch(new AuthActions.AuthLogout()), expirationDate);
  }

  clearLogoutTimer() {
    if (this.expirationDateTimer) {
      clearTimeout(this.expirationDateTimer);
      this.expirationDateTimer = null;
    }
  }
}
