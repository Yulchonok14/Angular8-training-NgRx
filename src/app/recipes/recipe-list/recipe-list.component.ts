import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';

import {Recipe} from '../recipe.model';
import {DataStorageService} from '../../shared/data-storage.service';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataStorageService: DataStorageService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.dataStorageService.fetchRecipes().subscribe();

    this.subscription = this.store.select('recipes')
      .pipe(
        map(recipeData => recipeData.recipes))
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
