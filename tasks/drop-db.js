var mongo = require('mongodb').MongoClient;
var dbUri = process.env.HABITICA_DB_URI || 'mongodb://localhost/habitica-node-test';

mongo.connect(dbUri, function (err, db) {
  if (err) throw err;

  db.dropDatabase(function() {
    db.close();
  });
});

