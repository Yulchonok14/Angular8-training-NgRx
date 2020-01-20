import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLogin = true;
  isLoading = false;
  error: string = null;

  authSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.authSub = this.store.select('auth').subscribe(authData => {
      this.isLoading = authData.isLoading;
      this.error = authData.error;
    });
  }

  switchTo() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;
    if (this.isLogin) {
      this.store.dispatch(new AuthActions.AuthLoginStart({email, password}));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email, password}));
    }
    authForm.reset();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
