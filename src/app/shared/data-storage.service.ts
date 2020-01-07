import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { map, tap, exhaustMap, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) {
  }

  storeRecipes() {
    //const token = this.authService.getToken();

    //this.http.put('https://recipe-book-f67d8.firebaseio.com/recipes.json',
      this.store.select('recipes').pipe(
        map(recipeState => recipeState.recipes),
        switchMap(recipes =>
          this.http.put('https://recipe-book-f67d8.firebaseio.com/recipes.json', recipes)
      ))
      //this.recipeService.getRecipes()
    //)
      .subscribe(response => {
        console.log(response);
      });

    //axamit
    /*return this.http.put('https://ng-recipe-book-5b039.firebaseio.com/recipes.json',
     this.recipeService.getRecipe());
     */

  }

  fetchRecipes() {
    //const token = this.authService.getToken();

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

    //axamit
    /*return this.http.get('https://ng-recipe-book-5b039.firebaseio.com/recipes.json')
     .pipe(map(
     (response: Response) => {
     const recipes: Recipe[] = response.json();
     for(let recipe of recipes){
     if(!recipe['ingredients']) {
     recipe['ingredients'] = [];
     }
     }
     return recipes;
     }
     ))
     .subscribe(
     (recipes: Recipe[]) => {
     this.recipeService.setRecipe(recipes);
     }
     );*/
  }
}
