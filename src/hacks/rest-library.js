// Ripped from https://github.com/mattsains/react-native-rest-client
export default class RestClient {
    constructor (baseUrl = '', { headers = {}, devMode = false, simulatedDelay = 0 } = {}) {
      if (!baseUrl) throw new Error('missing baseUrl');
      this.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      Object.assign(this.headers, headers);
      this.baseUrl = baseUrl;
      this.simulatedDelay = simulatedDelay;
      this.devMode = devMode;
    }

    _simulateDelay () {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, this.simulatedDelay);
      });
    }

    _fullRoute (url) {
      return `${this.baseUrl}${url}`;
    }

    _fetch (route, method, body, options) {
      if (!route) throw new Error('Route is undefined');
      var fullRoute = this._fullRoute(route);
      if (options.isQuery && body) {
        var qs = require('qs');
        const query = qs.stringify(body);
        fullRoute = `${fullRoute}?${query}`;
        body = undefined;
      }
      let opts = {
        method,
        headers: this.headers
      };
      if (body) {
        Object.assign(opts, { body: JSON.stringify(body) });
      }
      const fetchPromise = () => fetch(fullRoute, opts);

      const extractResponse = result =>
        result.text().then(text =>
          (!text && options.allowEmptyResponse) ? undefined : JSON.parse(text));

      if (this.devMode && this.simulatedDelay > 0) {
        // Simulate an n-second delay in every request
        return this._simulateDelay()
          .then(() => fetchPromise())
          .then(extractResponse);
      } else {
        return fetchPromise()
          .then(extractResponse);
      }
    }

    GET (route, query, options) { return this._fetch(route, 'GET', query, { isQuery: true, ...options }); }
    POST (route, body, options) { return this._fetch(route, 'POST', body, options); }
    PUT (route, body, options) { return this._fetch(route, 'PUT', body, options); }
    DELETE (route, query, options) { return this._fetch(route, 'DELETE', query, { isQuery: true, ...options }); }
  }
