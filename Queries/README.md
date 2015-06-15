# Queries

## 1. Find objects for which a specific key exists

Find objects _without_ `someKey`: 

```js
var ref = new Firebase(fbUrl+'/someList').orderByChild("someKey").equalTo(null);
```

Find the companies _with_ `someKey`: 

```js
var ref = new Firebase(fbUrl+'/someList').orderByChild("someKey").startAt(!null);
```

Next Steps:

* See example [AngularJS factory](./src/keyExistsFactory.js).
* __Remember to add `".indexOn": "someVariable"` to the rules.__