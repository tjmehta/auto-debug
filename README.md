# auto-debug
Uses debug but automatically assumes file as log namespace. Optionally logs line numbers, function arguments, and even traces.


## Usage

### Default
```js
// example.js
var debug = require('auto-debug')();

module.exports = function someFunction () {
  debug();
  /*
    ...
  */
};
```
