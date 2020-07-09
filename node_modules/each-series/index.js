var isError = function(e) {
  return Object.prototype.toString.call(e) === '[object Error]' || e instanceof Error;
};

module.exports = function(arr, iterator, cb) {
  var i = 0;
  if (!cb) cb = function() {};

  var loop = function() {
    if (i >= arr.length) return cb();
    iterator(arr[i], i, function(err) {
      if (isError(err)) return cb(err);
      process.nextTick(loop);
    });
    i++;
  };

  loop();
};
