var tap = require('tap');
var test = tap.test;
var each = require('./index');

test('Should iterate the array in a serial manner', function(t) {
	var xs = [];
	var end = function() {
		t.deepEqual(xs, [1,2,3,4,5,6,7]);
		t.end();
	};
	each([1,2,3,4,5,6,7], function(el, i, done) {
		setTimeout(function() {
			xs.push(el);
			done();
		}, 100 - (el * 10));
	}, end);
});

test('Should stop iterating when catching an error', function(t) {
	var xs = [];
	var end = function(err) {
		t.equal(err.message, "Oh noes! it's a 4!");
		t.deepEqual(xs, [1,2,3]);
		t.end();
	};
	each([1,2,3,4,5,6,7], function(el, i, done) {
		if (el == 4) return done(new Error("Oh noes! it's a 4!"));
		setTimeout(function() {
			xs.push(el);
			done();
		}, 100 - (el * 10));
	}, end);
});
