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

### #setCredentials

Set credentials after initialization.

```js
api.setCredentials({
  uuid: 'new-user-id',
  token: 'new-api-token',
});
```

## API Wrapper Methods

### #content.get

```js
\\ Get all content
api.content.get()
  .then((content) => {
    content.gear.tree; // all gear objects
    content.egg.Wolf; // wolf egg object
    content.quests.whale; // whale quest object
  });

\\ Get specific piece of content
api.content.get('eggs')
  .then((eggs) => {
    eggs.Wolf; // wolf egg object
  });

\\ Get specific piece of nested content
api.content.get('gear.tree.weapon.warrior')
  .then((warriorWeapons) => {
    warriorWeapons['0']; // initial warrior weapon
  });
```

### #content.getPaths

```js
\\ Get all possible user paths
api.content.getPaths()
  .then((paths) => {
    paths['achievements.beastMaster']; // Boolean
    paths['contributor.level']; // Number
    paths['items.currentPet']; // String
    paths['items.gear.owned.weapon_warrior_0']; // Boolean
  });
```
