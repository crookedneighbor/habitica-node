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
