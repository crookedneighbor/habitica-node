# Habitica

[![Greenkeeper badge](https://badges.greenkeeper.io/crookedneighbor/habitica-node.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/crookedneighbor/habitica-node.svg?branch=master)](https://travis-ci.org/crookedneighbor/habitica-node)
---

A very thin wrapper for the Habitica API

## Installation

```bash
npm install habitica --save
```

## Usage

This package is intentionally light and unopinionated. It should be used in conjunction with [Habitica's API documentation](https://habitica.com/apidoc/).


## Setup

The first thing you need to do is instantiate your client. All the configuration properties are optional and can be set later.

```js
var Habitica = require('habitica');
var api = new Habitica({
  id: 'your-habitica.com-user-id',
  apiToken: 'your-habitica.com-api-token',
  endpoint: 'http://custom-url.com/', // defaults to https://habitica.com/
  platform: 'Your-Integration-Name' // defaults to Habitica-Node
});
```

Using the `register` or `localLogin` methods will set the User Id and API token automatically.

```js
api.register(
  'username',
  'email',
  'password'
).then((res) => {
  var user = res.data

  // do something with user
  // hit a route with the authenticated client
  return api.get('/groups')
}).then((res) => {
  var groups = res.data

  // do something
});

api.localLogin(
  'username or email',
  'password'
).then((res) => {
  var creds = res.data

  // do something with the credentials
  // hit a route with the authenticated client
  return api.get('/groups')
}).then((res) => {
  var groups = res.data

  // do something
});
```

If your integration prompts the user to enter their credentials, you can use the `setOptions` method.

```js
api.setOptions({
  id: 'the-uuid',
  apiToken: 'the-api-token'
})
```

## Request Methods

There are four main methods to make requests to the API. `get`, `post`, `put` and `del`. Each corresponds to one of the main HTTP verbs.

`get` takes an optional second argument that is an object that gets converted to a query string. The rest have an optional second argument that is the post body and a third optional argument that will be converted to a query string.

Each method returns a promise which resolves the raw data back from the API. The data will reside on the data property.

```js
api.get('/user').then((res) => {
  var user = res.data

  return api.put('/user', {
    'profile.name': 'New Name'
  })
}).then((res) => {
  var user = res.data
  user.profile.name // 'New Name'

  return api.post('/tasks/user', {
    type: 'todo',
    text: 'A new todo'
  })
}).then((res) => {
  var task = res.data

  return api.post('/tasks/' + task.id + '/score/up')
}).then((res) => {
  // Your task was scored!
}).catch((err) => {
  if (err.message) {
    // API Error, display the message
  } else {
    // something else in your integration went wrong
  }
})
```

For full documentation with examples visit [the docs site](http://crookedneighbor.github.io/habitica-node/).

## Documentation

The documentation is generated automatically using [JSDoc](http://usejsdoc.org/).

## Testing

To run all the tests:

```
$ npm t
```

* The bulk of the tests are integration tets that expect a Habitica dev instance to be running.

* A mongodb instance must be running already in order to run the tests locally.

* By default, the test infrastructure assumes that the repo for Habitica is '../../habitica', relative to the test directory. You may pass in your own path by exporting the environmental variable `PATH_TO_HABITICA`.

  ```
  $ export PATH_TO_HABITICA='../../some/other/path';
  ```

* By default, the app will be served on port 3321. This can be configured with the environmental variable `HABITICA_PORT`:

  ```
  $ export HABITICA_PORT=3001;
  ```

* By default, the mongodb uri is 'mongodb://localhost/habitica-node-test'. You can configure this variable with the environmental variable `HABITICA_DB_URI`:

  ```
  $ export HABITICA_DB_URI='mongodb://localhost/some-other-db';
  ```

## Support

This module requires the `Promise` object to function. If you are using this module in a context without `Promise`s (such as Browserifying for IE9), you will need to polyfill them.

Supports Node >= 4
