var test = require('tape');
var MongoClient = require('mongodb').MongoClient;
var mongodbCore = require('mongodb-core');
var mongojs = require('mongojs');
var toMongodbCore = require('./index');

test('mongojs', function(t) {
  var db = mongojs('test');

  toMongodbCore(db, function(err, srv) {
    t.notOk(err);
    srv.command('test.$cmd', {ping: 1}, function(err, ok) {
      t.notOk(err);
      t.equal(ok.result.ok, 1);
      t.end();
    });
  });
});

test('end', function(t) {
  t.end();
  process.exit();
});
