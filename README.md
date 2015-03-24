# auto-debug
Uses debug but automatically assumes file as log namespace. Optionally logs line numbers, function arguments, and even traces.


## Usage

### debug(/* args */)
```js
// lib/example.js
var debug = require('auto-debug')();

module.exports = function someFunction () {
  debug('hello'); // this line 5
  /*
    equivalent to require('debug')(lib:example)('someFunction 5 hello')
  */
  /*
    prints:
    lib:example someFunction 5 hello
  */
};
```

### debug.trace()
```js
// lib/example2.js
var debug = require('auto-debug')();

function add (a, b, c) {
  debug.trace(); // this line 5
  /*
    equivalent to require('debug')(lib:example2)('someFunction 5 hello')
  */
  /*
    prints:
    lib:example someFunction 5 hello { a:10, b:20, c:30} from main lib/example2.js:16
  */
};

(function main () {
  add(10, 20, 30) // line 16
})()
```

## License
MIT