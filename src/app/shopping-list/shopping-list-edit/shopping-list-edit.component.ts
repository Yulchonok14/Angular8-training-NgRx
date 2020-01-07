import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
    selector: 'app-shopping-list-edit',
    templateUrl: './shopping-list-edit.component.html',
    styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
    @ViewChild('f')shoppingListForm:NgForm;
    subscription:Subscription;
    editedItem:Ingredient;
    editMode = false;


  constructor(private store:Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList')
      .subscribe(stateState => {
        if(stateState.ingredientEditedIndex > -1) {
          this.editMode = true;
          this.editedItem = stateState.ingredientEdited;
          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        } else {
          this.editMode = false;
        }
      });
  }

    onSubmit(form:NgForm) {
        const formValue = form.value;
        const newIngredient = new Ingredient(formValue.name, formValue.amount);
        if (this.editMode) {
          this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
        } else {
          this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
        }
        this.editMode = false;
        form.reset();
    }

    onClear() {
        this.shoppingListForm.reset();
        this.editMode = false;
    }

    onDelete() {
        this.onClear();
      this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
