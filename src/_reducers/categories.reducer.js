import { categoryConstants } from '../_constants';
import { carData } from '../_helpers/sample';
import { saveCategory, loadCategory } from '../CategoryPage/localStorage';

let initialState = {
  items: [],  
};

export function categories(state = initialState, action) {
  switch (action.type) {
    case categoryConstants.CATEGORY_ADD:
      return {
        ...state,
        items: state.items.concat([action.cat]),
        filteredItems: state.items.concat([action.cat])
          .filter(x=>x.parentCategory? x.parentCategory.key == action.cat.parentCategory.key : x.parentCategory == action.cat.parentCategory),
      };
    case categoryConstants.CATEGORY_LOAD:
      return {
        ...state,
        items: state.items.filter(x=>x.key == 0).length == 0 ? state.items.concat([action.cat]):state.items,
        parentCategory: action.cat,
        items: state.items,
        filteredItems: state.items.filter(x=>x.parentCategory? x.parentCategory.key == action.cat.key:null),
      };
    case categoryConstants.DELETE_REQUEST:
      return {
        ...state,
        items: state.items.filter(cat => cat.key !== action.cat.key && cat.key !== action.cat.parentCategory.key),
        filteredItems: state.items.filter(cat => cat.key !== action.cat.key)
          .filter(x=>x.parentCategory? x.parentCategory.key == action.cat.parentCategory.key : x.parentCategory == action.cat.parentCategory),
      };
    case categoryConstants.CATEGORIES_FAILURE, 
          categoryConstants.CATEGORY_CREATE_FAILURE,
          categoryConstants.DELETE_FAILURE:
      return {
        error: action.error
      };
    case categoryConstants.CATEGORY_PURGE:
      return {
        ...state,
        items: []
      };
    default:
      return state
  }
}
