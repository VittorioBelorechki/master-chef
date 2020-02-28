// Global app controller

import SearchModel from './Model/SearchModel';
import RecipeModel from './Model/RecipeModel';
import * as searchView from './View/SearchView';
import * as recipeView from './View/RecipeView';
import * as shoppingListView from './View/ShoppingListView';
import * as likesListView from './View/LikesListView';
import {domObjects, domStrings} from './Utility/domObjectsContainer';

const store = {
    searchModel: new SearchModel(),
    recipeModel: new RecipeModel(),
    shoppingList: new Map(),
    favouritesList: new Map()
};

domObjects.searchButton.addEventListener('click', event => {
    event.preventDefault();
    getSearch();
});

window.addEventListener('hashchange', getRecipe);

domObjects.pageButtonsContainer.addEventListener('click', event => {
    pageChange(event);
});

domObjects.recipeContainer.addEventListener('click', event => {
    if(event.target.matches('.recipe__btn, .recipe__btn *')) {
        addToShoppingList();
    }
    if(event.target.matches('.recipe__love, .recipe__love *')) {
        addToFavouritesList();
    }
    if(event.target.matches('.btn-tiny, .btn-tiny *')) {
        changeIngredientCount(event);
    }

});

domObjects.shoppingList.addEventListener('click', event => {
    deleteItemFromShoppingList(event);
});

window.addEventListener('load', load);

const getSearch = async () => {
    const searchString = searchView.getSearchFieldContent();
    if (searchString !== null && searchString.length !== 0) {
        searchView.displayLoader();
        try {
            store.searchResults = await store.searchModel.getResult(searchString);
        } catch (error) {
            searchView.removeLoader();
            alert('Error! Service is not available!');
            return;
        }
        if (!store.searchResults || store.searchResults.length === 0) {
            searchView.removeLoader();
            alert(`No results found for '${searchString}'`);
            return;
        }
        searchView.removeLoader();
        searchView.clearResults();
        searchView.displayResults(store.searchResults);
        store.currentPage = 1;
    }
};

async function getRecipe() {
    const id = window.location.hash.slice(1);
    if (id !== null && id.length !== 0) {
        recipeView.displayLoader();
        if(store.currentRecipeDOM) {
            store.currentRecipeDOM.classList.remove(domStrings.activeClass); 
        }
        store.currentRecipeDOM = searchView.getCurrentRecipe();
        if(store.currentRecipeDOM) {
            store.currentRecipeDOM.classList.add(domStrings.activeClass);
        }
        try {
            store.recipeResult = await store.recipeModel.getRecipe(id);
        } catch(error) {
            searchView.removeLoader();
            alert('Error! Service is not available!');
            return;
        }
        if (!store.recipeResult) {
            searchView.removeLoader();
            alert(`Error!`);
            return;
        }
        store.recipeResult.cookingTime = store.recipeResult.ingredients.length * 5;
        store.recipeResult.servings = 2;
        store.displayedRecipe = (store.searchResults)?
        store.searchResults.find(element => element.recipe_id === id) : null;
        if(!store.displayedRecipe) {
            store.displayedRecipe = store.favouritesList.get(id);
        }
        store.recipeResult.isLiked = store.favouritesList.has(store.recipeResult.recipe_id);
        searchView.removeLoader();
        recipeView.clearRecipe();
        recipeView.displayRecipe(store.recipeResult);
    }
};

const pageChange = event => {
    const button = event.target.closest('.btn-inline');
    if (button){
        searchView.clearResults();
        const pageNum = (button.className === 'btn-inline results__btn--next')?
        ++store.currentPage : --store.currentPage;
        searchView.displayResults(store.searchResults, pageNum);
    }
};

const addToShoppingList = () => {
    store.recipeResult.ingredients.forEach(ing => {
        if (!store.shoppingList.has(ing.text)) {
            store.shoppingList.set(ing.text, Object.assign({}, ing));
        }
        else {
            store.shoppingList.get(ing.text).count += ing.count;
        }
    });
    shoppingListView.clearItems();
    shoppingListView.displayItems(Array.from(store.shoppingList.values()));
};

const deleteItemFromShoppingList = event => {
    const button = event.target.closest('.shopping__delete');
    if (button){
        const shoppingItem = button.parentNode;
        const shoppingItemText = shoppingItem.querySelector('.shopping__description').textContent;
       store.shoppingList.delete(shoppingItemText);
        shoppingListView.removeItem(shoppingItem);
    }
};

const addToFavouritesList = () => {
    const id = store.recipeResult.recipe_id;
    let recipe = store.displayedRecipe;

    if (store.favouritesList.has(id)) {
        store.favouritesList.delete(id);
        recipe.isLiked = store.favouritesList.has(id);
        likesListView.removeFavourite(`#${id}`);
    }
    else {
        store.favouritesList.set(id, recipe);
        recipe.isLiked = store.favouritesList.has(id);
        likesListView.addFavourite(recipe);
    }
    recipeView.toggleLiked(recipe.isLiked);
    likesListView.toggleLiked(store.favouritesList.size !== 0);
    localStorage.setItem('Favourites', JSON.stringify(store.favouritesList));       
};

const changeIngredientCount = (event) => {
    const button = event.target.closest('.btn-tiny');
    let newServings = store.recipeResult.servings;
    button.querySelector(domStrings.incDecImg).getAttribute('href')  === 'img/icons.svg#icon-circle-with-plus'?
    newServings++ : newServings--;
    if (newServings <= 0) {
        alert('Servings can not be less than one!');
        return;
    }
    if (newServings >= 11) {
        alert('Servings can not be more than ten!');
        return;
    }
    const ingredientsCountArr = [];
    store.recipeResult.ingredients.forEach(ing => {
        ing.count = ((ing.count * newServings) / store.recipeResult.servings);
        if(ing.count.toString().length > 5) {
            ing.count = ing.count.toFixed(3);
        }
        ingredientsCountArr.push(ing.count);
    });
    store.recipeResult.servings = newServings;
    recipeView.displayIngredientCount(ingredientsCountArr, newServings);
};

function load() {
    window.location.hash = "";
    if (localStorage.getItem('Favourites') && localStorage.getItem('Favourites').length !== 0) {
        const favourites = JSON.parse(localStorage.getItem('Favourites'));
        favourites.forEach(element => store.favouritesList.set(element[0], element[1]));
        store.favouritesList.forEach(value => likesListView.addFavourite(value));
        likesListView.toggleLiked(store.favouritesList.size !== 0);
    }
}

