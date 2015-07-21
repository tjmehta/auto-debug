# auto-debug
Uses [debug](http://github.com/tj/debug) but automatically assumes filenames as the log namespace.
Optionally logs line numbers, function arguments, and caller location.


## Usage

### debug(/* args */)
```js
// lib/example.js
var debug = require('auto-debug')();

module.exports = function someFunction () {
  debug('hello'); // this line 5
  /*
    prints:
    lib/example.js:5 someFunction hello
  */
  /*
    equivalent to require('debug')('lib/example.js')(':5 someFunction hello')
  */
};
```

### debug.trace()
```js
// lib/example2.js
var debug = require('auto-debug')();
process.env.DEBUG_TRACE = 'true'; // since debug trace can be noisey it only prints when DEBUG_TRACE is not set
function add (a, b, c) {
  debug.trace(); // this line 5
  /*
    prints:
    lib/example2.js:5 add hello { a:10, b:20, c:30} from main lib/example2.js:16
  */
  /*
    equivalent to require('debug')('lib/example2.js')(':5 add hello { a:10, b:20, c:30} from main lib/example2.js:16')
  */
};

(function main () {
  add(10, 20, 30) // line 16
})()
```

## License
MIT
