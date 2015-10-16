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

You can register, login, get your user object, manipulate your tasks, and parse the content object, among other things.

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
