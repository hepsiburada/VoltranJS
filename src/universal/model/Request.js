export default class Request {
  constructor(client, payload, uri, response) {
    this.uri = uri;
    this.client = client;
    this.payload = payload;
    this.hash = [payload.baseURL || client.defaults.baseURL, uri, payload.method].join(',');
    this.response = response;
  }

  execute() {
    let promise;
    if (this.response?.cacheResponse) {
      promise = Promise.resolve(this.response.cacheResponse);
    } else {
      promise = this.client
        .request(this.payload)
        .then(response => {
          if (this.response?.onSuccess) {
            return this.response.onSuccess(response);
          }
          return response;
        })
        .catch(error => {
          if (this.response?.onError) {
            return this.response.onError(error);
          }
          return error;
        });
    }
    return promise;
  }
}
