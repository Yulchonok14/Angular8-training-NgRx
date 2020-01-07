import { Store } from '@ngrx/store';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipesEffects{
  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>(
          'https://recipe-book-f67d8.firebaseio.com/recipes.json'
        )
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          imagePath: recipe.imagePath,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  )
}
