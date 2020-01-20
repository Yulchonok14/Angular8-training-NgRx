import {Action} from '@ngrx/store';

export const AUTHENTICATE = '[Auth] Authenticate';
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const SINGUP_START = '[Auth] Sugnup Start';
export const AUTO_LOGIN = '[Auth] Auth Login';
export const LOGOUT = '[Auth] Logout';

export class Authenticate implements Action {
  readonly type = AUTHENTICATE;

  constructor(public payload: {
    email: string,
    id: string,
    token: string,
    expirationDate: Date
  }) {
  }
}

export class AuthLogout implements Action {
  readonly type = LOGOUT;
}

export class AuthLoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {
  }
}

export class SignupStart implements Action {
  readonly type = SINGUP_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions = Authenticate | AuthLogout | AuthLoginStart | AuthenticateFail | SignupStart | AutoLogin;
