import BaseAPI from "./base-api";

export default class Dataset extends BaseAPI{
    constructor() {
        super();
        this.apiUrl = 'datasets'
    }

    async gets(apiUrl) {
        if(apiUrl) {
            this.apiUrl = `${this.apiUrl}/${apiUrl}`;
        }
        const result = await this.get();
        return result;
    }

    async posts(params) {
        this.params = params;
        const result = await this.post();
        return result;
    }
}