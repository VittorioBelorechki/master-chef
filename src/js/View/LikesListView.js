import {domObjects, domStrings} from '../Utility/domObjectsContainer';

export const removeFavourite = href => {
    const favList = domObjects.favouritesList;
    const item = Array.from(favList.querySelectorAll(domStrings.favouriteItem))
    .find(element => href === element.getAttribute('href'));
    item.parentNode.parentNode.removeChild(item.parentNode);
};

export const addFavourite = element => {
    if(element === null) {
        return;
    }
    const stringHTML =
    `<li>
        <a class="likes__link" href="#${element.recipe_id}">
            <figure class="likes__fig">
                <img src=${element.image_url} alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${formatTitle(element.title)}</h4>
                <p class="likes__author">${element.publisher}</p>
            </div>
        </a>
    </li>`;
    domObjects.favouritesList.insertAdjacentHTML("beforeend", stringHTML);
};

const formatTitle = text => {
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

export const toggleLiked = hasLikes => {
    domObjects.likesFieldImg
    .setAttribute('href', `img/icons.svg#icon-heart${(hasLikes)? '' : '-outlined'}`);
};
