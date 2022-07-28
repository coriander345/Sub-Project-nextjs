// postData("http://example.com/answer", { answer: 42 })
//   .then((data) => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
//   .catch((error) => console.error(error));

// function postData(url = "", data = {}) {
//   // Default options are marked with *
//   return fetch(url, {
//     method: "POST", // *GET, POST, PUT, DELETE, etc.
//     mode: "cors", // no-cors, cors, *same-origin
//     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: "same-origin", // include, *same-origin, omit
//     headers: {
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: "follow", // manual, *follow, error
//     referrer: "no-referrer", // no-referrer, *client
//     body: JSON.stringify(data), // body data type must match "Content-Type" header
//   }).then((response) => response.json()); // parses JSON response into native JavaScript objects
// }

export default class BaseAPI {
    constructor() {
      this._params = {};
      this._apiUrl = "";
      this._baseApiUrl = "http:/127.0.0.1:3333/v1";
      this._config = {
        method: "", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
      };
    }
  
    get config() {
      return this._config;
    }
  
    set config(value) {
      this._config = value;
    }
  
    get apiUrl() {
      return this._apiUrl;
    }
  
    set apiUrl(value) {
      this._apiUrl = value;
    }
  
    get params() {
      return this._params;
    }
  
    set params(value) {
      this._params = value;
    }
  
    get baseApiUrl() {
      return this._baseApiUrl;
    }
  
    responseHandler(body) {
      console.log("response handler:", body.json());
      return body.json();
    }
  
    targetUrl() {
      return `${this.baseApiUrl}/${this.apiUrl}`;
    }
  
    errorHandler(err) {
      console.error(err);
    }
  
    async post() {
      const config = Object.assign({}, this.config, {
        method: "POST",
        body: JSON.stringify(this.params),
      });
      return fetch(this.targetUrl(), config)
        .then((res) => res.json());
    }
  
    async put() {
      const config = Object.assign({}, this.config, {
        method: "PUT",
        body: JSON.stringify(this.params),
      });
      return fetch(this.targetUrl(), config)
        .then((res) => res.json());
    }
  
    async delete() {
      const config = Object.assign({}, this.config, {
        method: "DELETE",
        body: JSON.stringify(this.params),
      });
      return fetch(this.targetUrl(), config)
        .then((res) => res.json());
    }
  
    async postUpload() {
      const config = Object.assign({}, this.config, {
        method: "POST",
        body: this.params,
        redirect: "follow",
      });
      return fetch(this.targetUrl(), config)
        .then((res) => res.json());
    }
  
    async get() {
      const config = Object.assign({}, this.config, {
        method: "GET",
      });
      console.log("get class:", this.targetUrl());
      return fetch(this.targetUrl(), config)
        .then((res) => res.json());
    }
  }
  