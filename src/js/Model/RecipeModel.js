import axios from 'axios';
export default class RecipeModel {

    constructor() {
        this.baseURL = 'https://www.food2fork.com/api/get';
        this.apiKey = '6788b680e2f30477241b6d8969869153';
        //this.apiKey = '893e31a5cb14d8f14f7b4d4cbca24e7f';
    }

    async getRecipe(recipeID){
        const searchURL = `${this.baseURL}?key=${this.apiKey}&rId=${recipeID}`;
        let result;
        try {
            result = await axios(searchURL);
            const recipe = result.data.recipe;
            try {
                recipe.ingredients = this.parseIngredients(recipe.ingredients);
            }
            catch(error) {
                console.log(error);
                recipe.ingredients = recipe.ingredients.map(item => {
                    return {text: item};
                });
            }
            return recipe;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    parseIngredients(ingredients) {
        const measurmentTypes = ['cups', 'cup', 'ounces', 'ounce', 'tbsps', 'tbsp', 'tablespoons', 'tablespoon',
         'tsps', 'tsp', 'teaspoons', 'teaspoon', 'pounds', 'pound'];
         const typesBig = ['ounces', 'ounce', 'tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'pounds', 'pound'];
         const typesSmall = ['oz','oz', 'tbsps', 'tbsp', 'tsps', 'tsp', 'lbs', 'lb'];
        const newIngredients = ingredients.map(item => {
            let ingredient = item.toLowerCase().trim();
            if (ingredient.includes('(') && ingredient.includes(')')) {
                ingredient = ingredient.replace( ingredient.substring( ingredient.indexOf('('), ingredient.indexOf(')') + 1 ), '' );
            }
            let ingredientArr = ingredient.split(' ');
            let ingredientObj = {};
            let indexOfMeasurment;
            for (let index = 0; index < measurmentTypes.length; index++) {
                const element = measurmentTypes[index];
                if (ingredient.includes(element)) {
                    ingredientObj.measurment = element;
                    indexOfMeasurment = ingredient.indexOf(element);
                    break;
                }
            }
            if(parseInt(ingredient.charAt(0))) {
                let count;
                if(indexOfMeasurment) {
                    count = ingredient.substring(0, indexOfMeasurment).trim();
                     while(!parseInt(count.charAt(count.length - 1))){
                         count = count.substring(0, count.length - 1);
                     }
                }
                else {
                    count = ingredientArr[0];
                    if (parseInt(ingredientArr[1].charAt(0))) {
                        count += ingredientArr[1];
                    }
                }
                ingredientObj.count = count;
            }
            ingredientObj.text = ingredient.replace(ingredientObj.measurment, '')
            .replace(ingredientObj.count, '').trim();
            if (typesBig.includes(ingredientObj.measurment)) {
                ingredientObj.measurment = typesSmall[typesBig.indexOf(ingredientObj.measurment)];
            }
            if(ingredientObj.count) {
                ingredientObj.count = eval(ingredientObj.count.replace(/ |-/gi, '+'));
                if(ingredientObj.count.toString().length > 5) {
                    ingredientObj.count = ingredientObj.count.toFixed(3);
                }
            }
            return ingredientObj;
        });
        return newIngredients;
    }

}