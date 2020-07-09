var isMongojsDb = function(db) {
  if (typeof db.close !== 'function') return false;
  if (typeof db.collection !== 'function') return false;
  if (typeof db.getCollectionNames !== 'function') return false;
  if (typeof db._getServer !== 'function') return false;

  return true;
};

module.exports = function(db, cb) {
  if (isMongojsDb(db)) {
    db._getServer(function(err, srv) {
      if (err) return cb(err);
      cb(null, srv);
    });
    return;
  }

  cb(new Error('Unrecognized mongojs instance. Only mongojs +1 supported.'));
};
