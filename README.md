superagent-promise-headers
====================================
SuperAgent Bluebird promises - header extension

## What
	- Adding headers to HTTP request.
	- Converting superagent to `Bluebird` promise.

## How

```javascript

var request = require('superagent-promise-headers')({
	headers: {
		base: { 'content-service': 'Doron-Service' },
		get: { 'content-service-type': 'Doron-Service-GET' },
		post: { 'content-service': 'Doron-Service-POST' },
		del: { 'content-service': 'Doron-Service-DELETE' },
		put: { 'content-service': 'Doron-Service-PUT' }
	}
});

request
.get('http://google.com')
.then(function(res){
	// Success
	console.log(res);
}).catch(function(e){
	//Failure
	console.log(e.res);
});

```

## issues?
Just checkout the github issue page [Github](https://github.com/doron2402/superagent-promise-headers/issues)