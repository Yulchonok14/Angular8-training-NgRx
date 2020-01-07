import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

export interface State {
  ingredients: Ingredient[],
  ingredientEdited: Ingredient,
  ingredientEditedIndex: number
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ],
  ingredientEdited: null,
  ingredientEditedIndex: -1
};

export function shoppingListReducer(state: State = initialState, action:ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.ingredientEditedIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.ingredientEditedIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        ingredientEditedIndex: -1,
        ingredientEdited: null
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient, index) =>
          index !== state.ingredientEditedIndex
        ),
        ingredientEditedIndex: -1,
        ingredientEdited: null
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        ingredientEditedIndex: action.payload,
        ingredientEdited: {...state.ingredients[action.payload]}
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        ingredientEditedIndex: -1,
        ingredientEdited: null
      };
    default:
      return state;
  }
}
