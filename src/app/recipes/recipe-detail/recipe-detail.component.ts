import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';

import {Recipe} from '../recipe.model';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeItem: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      map(params => +params['id']),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipeState => {
          return recipeState.recipes.find((item) => item.id === this.id);
        }
      ))
      .subscribe(recipe => {
        this.recipeItem = recipe;
      });
  }

  transferIngredients() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipeItem.ingredients));
  }

  onRemoveRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.recipeItem.id));
    this.router.navigate(['/recipes']);
  }

}
