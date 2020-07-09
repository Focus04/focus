# each-series

Asynchronously iterate an array as a series. Similar to  [async.eachSeries](https://github.com/caolan/async#eachseriesarr-iterator-callback), but as a small module.

## Installation

Install through npm

```
npm install each-series
```

## Example

```js
var each = require('each-series');

each([1,2,3,4,5,6,7], function(el, i, done) {
	setTimeout(function() {
		console.log(el);
		done();
	}, 100 - (el * 10));
}, function(err) {
	console.log('Done!');
});
```
The module is only one function

```
each(array, iterator, [callback])
```

The callback is optional.

## Error handling

If an error is passed to the `done` function passed to the iterator, iteration will be stopped and the callback
will be invoked with the error.

## License

MIT License
