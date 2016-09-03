'use strict'

var mongo = require('mongodb').MongoClient
var generateRandomUserName = require('uuid').v4
var superagent = require('superagent')

function generateUser (update, connection) {
  var username = generateRandomUserName()
  var password = 'password'
  var email = username + '@example.com'

  return superagent.post(`localhost:${process.env.PORT}/api/v3/user/auth/local/register`)
    .accept('application/json')
    .send({
      username,
      email,
      password,
      confirmPassword: password
    }).then((res) => {
      var user = res.body.data
      var userCreds = {
        uuid: user.id,
        token: user.apiToken
      }

      if (connection) {
        connection.setCredentials(userCreds)
      }

      return updateDocument('users', user.id, update)
    })
}

function updateDocument (collectionName, uuid, update) {
  if (!update) { return }

  if (!process.env.NODE_DB_URI) {
    throw new Error('No process.env.NODE_DB_URI specified. Type `export NODE_DB_URI=\'mongodb://localhost/habitica-node-test\'` on the command line')
  }

  return new Promise((resolve, reject) => {
    mongo.connect(process.env.NODE_DB_URI, (connectionError, db) => {
      if (connectionError) {
        reject(new Error(`Error connecting to database when updating ${collectionName} collection: ${connectionError}`))
      }

      var collection = db.collection(collectionName)

      collection.update({ _id: uuid }, { $set: update }, (updateError, result) => {
        if (updateError) {
          reject(new Error(`Error updating ${collectionName}: ${updateError}`))
        }
        resolve()
      })
    })
  })
}

module.exports = {
  generateUser: generateUser,
  updateDocument: updateDocument
}
