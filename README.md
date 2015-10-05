Habitica-Node
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

## Utilities

### setCredentials()

Set credentials after initialization. If you do not provide a value, it will default to the previous value stored on initialization.

```js
api.setCredentials({
  uuid: 'new-user-id',
  token: 'new-api-token',
  endpoint: 'http://localhost:3000/api/v2',
});
```

### getUuid()

```js
api.getUuid(); // returns uuid
```

### getToken()

```js
api.getToken(); // returns token
```

### getEndpoint()

```js
api.getEndpoint(); // returns api endpoint
```

## API Wrapper Methods

### account.register()

The uuid and api token will be set automatically after a sucessful registration call. 
```js
api.account.register('username', 'email', 'password');

// If the uuid or api token are already set, the register call will throw an error. You can override this behavior by passing in an object with a resetOldCreds parameter set to true
api.account.register('username', 'email', 'password', {resetOldCreds: true});
```

### account.login()

The uuid and api token will be set automatically after a sucessful login call. 
```js
api.account.login('username or email', 'password');
```

### content.get()

```js
// Get all content
api.content.get()
  .then((content) => {
    content.gear.tree; // all gear objects
    content.egg.Wolf; // wolf egg object
    content.quests.whale; // whale quest object
  });

// Get specific piece of content
api.content.get('eggs')
  .then((eggs) => {
    eggs.Wolf; // wolf egg object
  });

// Get specific piece of nested content
api.content.get('gear.tree.weapon.warrior')
  .then((warriorWeapons) => {
    warriorWeapons['0']; // initial warrior weapon
  });
```

### content.getPaths()

```js
// Get all possible user paths
api.content.getPaths()
  .then((paths) => {
    paths['achievements.beastMaster']; // Boolean
    paths['contributor.level']; // Number
    paths['items.currentPet']; // String
    paths['items.gear.owned.weapon_warrior_0']; // Boolean
  });
```
