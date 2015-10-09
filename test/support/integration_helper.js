import {isEmpty} from 'lodash';
import {MongoClient as mongo} from 'mongodb';
import {v4 as generateRandomUserName} from 'uuid';
import superagent from 'superagent';

export function generateUser(update={}, connection) {
  let username = generateRandomUserName();
  let password = 'password'
  let email = username + '@example.com';

  return new Promise((resolve, reject) => {
    superagent.post(`localhost:${process.env.PORT}/api/v2/register`)
      .accept('application/json')
      .send({
        username: username,
        email: email,
        password: password,
        confirmPassword: password,
      })
      .end((err, res) => {
        if (err) throw `Error generating user: ${err}`;

        let user = res.body;
        let userCreds = {
          uuid: user._id,
          token: user.apiToken,
        };

        if (connection) {
          connection.setCredentials(userCreds);
        }

        updateDocument('users', user._id, update, () => {
          resolve(userCreds);
        });
      });
  });
};

function updateDocument(collectionName, uuid, update, cb) {
  if (isEmpty(update)) { return cb(); }

  if (!process.env.NODE_DB_URI) {
    throw 'No process.env.NODE_DB_URI specified. Type `export NODE_DB_URI=\'mongodb://localhost/habitica-node-test\'` on the command line';
  }

  mongo.connect(process.env.NODE_DB_URI, (err, db) => {
    if (err) throw `Error connecting to database when updating ${collectionName} collection: ${err}`;

    let collection = db.collection(collectionName);

    collection.update({ _id: uuid }, { $set: update }, (err, result) => {
      if (err) throw `Error updating ${collectionName}: ${err}`;
      cb();
    });
  });
}
