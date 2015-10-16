# Habitica-Node
[![Build Status](https://travis-ci.org/crookedneighbor/habitica-node.svg?branch=master)](https://travis-ci.org/crookedneighbor/habitica-node)
---

A wrapper for the Habitica API

## Installation

```js
let Habitica = require('habitica');
let api = new Habitica({
  uuid: 'your-habitica.com-user-id',
  token: 'your-habitica.com-api-token',
  endpoint: 'custom-url', // defaults to https://habitica.com/api/v2
});
```

## Usage

You can register, login, get your user object, manipulate your tasks, and parse the content object, among other things. For more comprehensive information, [read the documentation](http://crookedneighbor.github.io/habitica-node/docs/).

```js
api.account.register(
  'username',
  'email',
  'password',
).then((user) => {
  // The uuid and token are automatically applied the Habitica instance
});

api.account.login(
  'username or email',
  'password',
).then((user) => {
  // The uuid and token are automatically applied the Habitica instance
});

api.user.get()
  .then((user) => {
    user; // the user object
  });

api.task.score(
  'task-id',
  'up',
).then((stats) => {
  stats._tmp.drop; // a drop, if awarded for scoring the task
});
```

## Testing

To run all the tests:

```
$ npm t
```

* The bulk of the tests are integration tets that expect a Habitica dev instance to be running. 

* A mongodb instance must be running already in order to run the tests locally.

* By default, the test infrastructure assumes that the repo for Habitica is '../../habitrpg', relative to the test directory. You may pass in your own path by exporting the environmental variable `PATH_TO_HABITICA`.

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
