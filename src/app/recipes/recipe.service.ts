import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Store} from "@ngrx/store";

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import * as shoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  constructor(private store: Store<fromApp.AppState>) {
  }

  private recipes:Recipe[] = [
    new Recipe(
      1,
      'Chicken masala Recipe',
      'Healthy Thai Chicken masala with asparagus',
      'https://www.rd.com/wp-content/uploads/2017/06/01-healthiest-chinese-food-dishes_StringBeanChicken-via-pandaexpress.com_-380x254.jpg',
      [
        new Ingredient('Chicken', 1),
        new Ingredient('Asparagus', 1),
        new Ingredient('Masala source', 3),
        new Ingredient('Cabbage', 5)
      ]
    ),
    new Recipe(
      2,
      'Salami pizza Recipe',
      'This is a delicious salami pizza on a thin dough',
      'https://media-cdn.tripadvisor.com/media/photo-s/16/da/71/67/real-salami-pizza.jpg',
      [
        new Ingredient('Salami', 2),
        new Ingredient('Cheese', 5),
        new Ingredient('Dough', 1),
        new Ingredient('Tomato', 1)
      ]
    )
  ];

  getRecipeById(id:number) {
    return this.recipes.filter((recipe: Recipe) => recipe.id === id)[0];
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addRecipe(newRecipe:Recipe) {
    newRecipe.id = this.recipes.length + 1;
    this.recipes.push(newRecipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id:number, recipe:Recipe) {
    this.recipes[id - 1] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientToShoppingList(ingredients:Ingredient[]) {
    this.store.dispatch(new shoppingListActions.AddIngredients(ingredients));
  }

  removeRecipe(id:number) {
    const index = this.recipes.map((recipe: Recipe) => recipe.id).indexOf(id);
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipe(recipes:Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
