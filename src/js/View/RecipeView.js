import {domObjects, domStrings} from '../Utility/domObjectsContainer';

export const displayRecipe = (recipe) => {
    if(recipe) {
        const stringHTML =
        ` <figure class="recipe__fig">
            <img src="${recipe.image_url}" alt="Tomato" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${(recipe.isLiked)? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
            
            </ul>

            <button class="btn-small recipe__btn">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.source_url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>`;

        domObjects.recipeContainer.insertAdjacentHTML("afterbegin", stringHTML);
        displayIngredients(recipe.ingredients);
    }
};

const displayIngredients = (ingredients) => {
    if (ingredients === null || ingredients.length === 0) {
        return;
    }

    ingredients.forEach(element => {
        renderElement(element);
    });
}

const renderElement = (element) => {
    if(!element) {
        return;
    }
    const stringHTML =
    `<li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${(element.count)? fractionNum(element.count) : ''}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${(element.measurment)? element.measurment : ''}</span>
            ${element.text}
        </div>
    </li>`;
    document.querySelector(domStrings.recipeIngredientsList).insertAdjacentHTML("beforeend", stringHTML);
}

export const clearRecipe = () => {
    domObjects.recipeContainer.innerHTML = '';
}

export const displayLoader = () => {
    const loaderHTML = `
    <div class="loader">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`;
    domObjects.recipeContainer.insertAdjacentHTML('afterbegin', loaderHTML);
};

export const removeLoader = () => {
    const loader = document.querySelector(domStrings.loader);
    if(loader) {
        loader.parentNode.removeChild(loader);
    }
};

export const toggleLiked = isLiked => {
    document.querySelector(domStrings.favouritesButtonImg)
    .setAttribute('href', `img/icons.svg#icon-heart${(isLiked)? '' : '-outlined'}`);
};

export const displayIngredientCount = (ingredientsCountArr, newServings) => {
    const recipe = domObjects.recipeContainer;
    recipe.querySelector(domStrings.recipeServingsCount).textContent = newServings;
    const itemsArr = Array.from(recipe.querySelectorAll(domStrings.recipeItem));
    itemsArr.forEach((item, index) => {
        if (!isNaN(ingredientsCountArr[index])) {
            item.querySelector(domStrings.recipeItemCount).textContent = fractionNum(ingredientsCountArr[index]);
        }
    });
};

const fractionNum = num => {
    if(!num || num.toString().length === 1 || !num.toString().includes('.')){
        return num;
    }
    let numStr = '';
    const [whole, decimal] = num.toString().split('.');
    if(parseInt(whole) >= 1) {
        numStr += whole + ' ';
    }
    for (let index = 1; index <= 6; index++) {
        if(decimal.substring(0, decimal.length - 1) === 
        (index/6).toFixed(decimal.length).toString().slice(2).substring(0, decimal.length - 1) && decimal !== '5') {
            if(index === 6) {
                return numStr;
            }
            if(index % 2 === 0) {
                numStr += `${index/2}/3`;
                return numStr;
            }
            if(index === 3) {
                numStr += `1/2`;
                return numStr;
            }
            numStr += `${index}/6`;
            return numStr;
        }
    }
    const nod = nodCalc(Math.pow(10, decimal.length), parseInt(decimal));
    numStr += (parseInt(decimal) / nod).toString() + '/' + (Math.pow(10, decimal.length) / nod).toString();
    return numStr;
};

const nodCalc = (num1, num2) => {
    if (!num1 || !num2) {
        return 1;
    }
    while (num1 != num2) {
        if (num1 < num2) {
            num1 = num1 + num2;
            num2 = num1 - num2;
            num1 = num1 - num2;
        }
        num1 -= num2;
    }
    return num1;
};
