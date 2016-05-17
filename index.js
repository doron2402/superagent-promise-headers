module.exports = function(Promise, options) {

  var superagent = require("superagent");
  var _ = require('lodash');
  var Request = superagent.Request;
  var ACTIONS = ['GET', 'POST', 'DELETE', 'PUT'];
  var HEADERS = (options.headers && options.headers.base) ? options.headers.base : {};
  var GET_HEADERS = (options.headers && options.headers.get) ? options.headers.get : {};
  var POST_HEADERS = (options.headers && options.headers.post) ? options.headers.post : {};
  var DELETE_HEADERS = (options.headers && options.headers.del) ? options.headers.del : {};
  var PUT_HEADERS = (options.headers && options.headers.put) ? options.headers.put : {};

  var SuperagentPromiseError = superagent.SuperagentPromiseError = function (message) {
    this.name = 'SuperagentPromiseError';
    this.message = message || 'Bad request';
  };

  SuperagentPromiseError.prototype = new Error();
  SuperagentPromiseError.prototype.constructor = SuperagentPromiseError;
  Request.prototype.promise = function() {
    var req = this;
    var error;

    return new Promise(function(resolve, reject) {
        req.end(function(err, res) {
          if (typeof res !== "undefined" && res.status >= 400) {
            var msg = 'cannot ' + req.method + ' ' + req.url + ' (' + res.status + ')';
            error = new SuperagentPromiseError(msg);
            error.status = res.status;
            error.body = res.body;
            error.res = res;
            reject(error);
          } else if (err) {
            reject(new SuperagentPromiseError(err));
          } else {
            resolve(res);
          }
        });
      })
  };
  Request.prototype.then = function() {
    var promise = this.promise();
    return promise.then.apply(promise, arguments);
  };

  function httpCall(action) {
    return function(url, data){
      var headers = HEADERS;
      if (action.toLowerCase() === 'get') {
        //GET
        headers = _.assign(HEADERS, GET_HEADERS);
      } else if (action.toLowerCase() === 'post') {
        //POST
        headers = _.assign(HEADERS, POST_HEADERS);
      } else if  ('del'.indexOf(action.toLowerCase()) !== -1) {
        //DELETE
        headers = _.assign(HEADERS, DELETE_HEADERS);
      } else if (action.toLowerCase() === 'put') {
        //PUT
        headers = _.assign(HEADERS, PUT_HEADERS);
      }
      var currentRequest = superagent(action, url);
      currentRequest.set(headers);
      currentRequest.query(data);
      return _.assign(currentRequest,{ method: action.toLowerCase(), url: url });
    };
  }

  ACTIONS.forEach(function(action){
    var name = (action === 'DELETE') ? 'del' : action.toLowerCase();
    superagent[name] = httpCall(action);
  });

  return superagent;
};

