import { categoryConstants } from '../_constants';
import { categoryService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

const addCategory = (cat) => ({
    type: categoryConstants.CATEGORY_ADD,
    cat
})
const loadCategories = (cat) => ({
    type: categoryConstants.CATEGORY_LOAD,
    cat
})
const _delete = (cat) => ({
    type: categoryConstants.DELETE_REQUEST,
    cat
})
const _purge = () => ({
    type: categoryConstants.CATEGORY_PURGE,
})
export const categoryActions = {
    loadCategories,
    addCategory,
    delete: _delete,
    purge: _purge
};
