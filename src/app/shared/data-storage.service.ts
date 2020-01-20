import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';

import {Recipe} from '../recipes/recipe.model';
import {AuthService} from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) {
  }

  storeRecipes() {
    this.store.select('recipes').pipe(
      map(recipeState => recipeState.recipes),
      switchMap(recipes =>
        this.http.put('https://recipe-book-f67d8.firebaseio.com/recipes.json', recipes)
      ))
      .subscribe(() => {
      });

  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://recipe-book-f67d8.firebaseio.com/recipes.json'
      ).pipe(
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
        tap(recipes => {
            this.store.dispatch(new RecipesActions.SetRecipes(recipes));
          }
        )
      );
  }
}
