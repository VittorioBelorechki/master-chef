import {domObjects, domStrings} from '../Utility/domObjectsContainer';

export const displayItems = items => {
    if(items && items.length !== 0) {
        items.forEach(element => {
            renderItem(element);
        });
    }
};

const renderItem = element => {
    if(element) {
        const ingredientHTML = `
        <li class="shopping__item">
            <div class="shopping__count">
                <input type="number" value="${(element.count)? element.count : ''}"
                step="${(element.count)? element.count : ''}">
                <p>${(element.measurment)? element.measurment : ''}</p>
            </div>
            <p class="shopping__description">${element.text}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>`;

        domObjects.shoppingList.insertAdjacentHTML('beforeend', ingredientHTML);

    }
};

export const removeItem = item => {
    item.parentNode.removeChild(item);
};

export const clearItems = () => {
    domObjects.shoppingList.innerHTML = '';
};