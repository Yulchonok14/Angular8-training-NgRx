import { Actions, ofType, Effect} from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../../auth/auth.service'

export interface authDataResponse {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

const handleSuccess = (expiresIn: number, email: string, id: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(
    email,
    id,
    token,
    expirationDate
  );
  localStorage.setItem('user', JSON.stringify(user));
  return new AuthActions.Authenticate({
    email,
    id,
    token,
    expirationDate
  })
};

const handleError = (errorRes) => {
  let errorMessage = 'Unknown error is occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  } else {
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email has already existed';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password does not exist';
        break;
    }
    this.router.navigate(['/']);
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
};

@Injectable()
export class AuthEffects {
  constructor(public actions$:Actions, public http:HttpClient, public router: Router, public authService: AuthService) {
  }

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SINGUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http.post<authDataResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC0awTFZhoN9QSFRkaDa1ErA2rnL6QXXLc',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
          map(resData => {
            return handleSuccess(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        )
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData:AuthActions.AuthLoginStart) => {
      return this.http.post<authDataResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC0awTFZhoN9QSFRkaDa1ErA2rnL6QXXLc',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData => { this.authService.setLogoutTimer(+resData.expiresIn * 1000)}),
          map(resData => {
            return handleSuccess(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        )
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE),
    tap((authSuccessActions: AuthActions.Authenticate) => {
      this.router.navigate(['/']);
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('user');
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _expirationDate: string
      } = JSON.parse(localStorage.getItem('user'));

      if(!userData){
        return { type: 'DUMMY' };
      }

      const restoreUser = new User(userData.email, userData.id, userData._token, new Date(userData._expirationDate));

      if(restoreUser.token){
        const expirationTime: number = new Date(userData._expirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationTime);
        return new AuthActions.Authenticate({
          email: userData.email,
          id: userData.id,
          token: userData._token,
          expirationDate: new Date(userData._expirationDate)
        });
      }

      return { type: 'DUMMY' };
    })
  );
}
