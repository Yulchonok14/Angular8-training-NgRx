import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.css'],
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private dataStorageService:DataStorageService,
              private authService:AuthService,
              private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit(){
    this.userSub = this.store.select('auth').pipe(
      map(auth => auth.user))
        .subscribe( user => {
        this.isAuthenticated = !!user;
    });
  }

  onLogout(){
    this.store.dispatch(new AuthActions.AuthLogout());
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
