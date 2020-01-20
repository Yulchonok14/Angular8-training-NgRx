import {User} from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  error: string;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  error: null,
  isLoading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE:
      const user = new User(action.payload.email, action.payload.id, action.payload.token, action.payload.expirationDate);
      return {
        ...state,
        user,
        isLoading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SINGUP_START:
      return {
        ...state,
        error: null,
        isLoading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        error: action.payload,
        isLoading: false
      };
  }
  return state;
}
