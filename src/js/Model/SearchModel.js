import axios from 'axios';
export default class SearchModel {

    constructor() {
        this.baseURL = 'https://www.food2fork.com/api/search';
        this.apiKey = '6788b680e2f30477241b6d8969869153';
        //this.apiKey = '893e31a5cb14d8f14f7b4d4cbca24e7f';
    }

    async getResult(searchText, page = 1) {
        const searchURL = `${this.baseURL}?key=${this.apiKey}&q=${searchText}&page=${page}`;
        let result;
        try {
            result = await axios(searchURL);
            return result.data.recipes;;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}
