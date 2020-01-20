import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {AuthService} from './auth/auth.service';
import {Store} from '@ngrx/store';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyC0awTFZhoN9QSFRkaDa1ErA2rnL6QXXLc',
      authDomain: 'recipe-book-f67d8.firebaseapp.com',
    });

    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
