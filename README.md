# cog

[![browser support](https://ci.testling.com/DamonOehlman/cog.png)](https://ci.testling.com/DamonOehlman/cog)

### querySelectorAll

```js
var qsa = require('cog/qsa');

// find all the divs with class status
qsa('div.status');
```

### extend

```js
var extend = require('cog/extend');

// shallow extend an object as per jQuery, underscore, etc
var test = extend({}, { a : 5 }, { b : 7 });
```