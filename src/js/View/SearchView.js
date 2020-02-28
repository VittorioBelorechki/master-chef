import {domObjects, domStrings} from '../Utility/domObjectsContainer';

export const getSearchFieldContent = () => {
    return domObjects.searchField.value;
};

export const displayResults = (searchResults, page = 1) => {
    if (searchResults) {
        const lastElementIndex = page * 10;
        const firstElementIndex = lastElementIndex - 10;
        const displayResults = (lastElementIndex >= searchResults.length)?
        searchResults.slice(firstElementIndex) : searchResults.slice(firstElementIndex, lastElementIndex);
        displayResults.forEach(element => {
            renderElement(element);
        });
        displayPageButtons(page, lastElementIndex >= searchResults.length);
    }
};

const renderElement = (element) => {
    if(element === null) {
        return;
    }
    const stringHTML =
    `<li>
        <a class="results__link" href="#${element.recipe_id}">
            <figure class="results__fig">
                <img src=${element.image_url} alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${formatTitle(element.title)}</h4>
                <p class="results__author">${element.publisher}</p>
            </div>
        </a>
    </li>`;
    domObjects.resultsList.insertAdjacentHTML("beforeend", stringHTML);
};

const formatTitle = (text) => {
    if (text === null || text.length === 0) {
        return text;
    }
    const words = text.split(' ');
    let newText = '';
    for(let i = 0; i < words.length; i++) {
        if (newText.length + words[i].length <= 17) {
            newText += words[i] + " ";
        }
    };
    return newText.trim().concat('...');
};

export const clearResults = () => {
    domObjects.resultsList.innerHTML = '';
};

export const displayLoader = () => {
    const loaderHTML = `
    <div class="loader">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`;
    domObjects.results.insertAdjacentHTML('afterbegin', loaderHTML);
};

export const removeLoader = () => {
    const loader = document.querySelector(domStrings.loader);
    if(loader) {
        loader.parentNode.removeChild(loader);
    }
};

const displayPageButtons = (page, isLastPage = 0) => {
    const buttonContainer = domObjects.pageButtonsContainer;
    if(!buttonContainer) {
        return;
    }
    buttonContainer.innerHTML = '';

    const prevButtonHTML = `
    <button class="btn-inline results__btn--prev">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
    </button>`;

    const nextButtonHTML = `
    <button class="btn-inline results__btn--next">
        <span>Page ${page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </button>`;

    if (page > 1) {
        buttonContainer.insertAdjacentHTML('afterbegin', prevButtonHTML);
    }

    if (!isLastPage) {
        buttonContainer.insertAdjacentHTML('beforeend', nextButtonHTML);
    }
};

export const getCurrentRecipe = () => {
    const resultList = Array.from(document.querySelectorAll(domStrings.result));
    return resultList.find((element) => window.location.hash === element.getAttribute('href'));
};




