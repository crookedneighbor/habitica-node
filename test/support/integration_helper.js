import {isEmpty} from 'lodash'
import {MongoClient as mongo} from 'mongodb'
import {v4 as generateRandomUserName} from 'uuid'
import superagent from 'superagent'

export function generateUser (update = {}, connection) {
  let username = generateRandomUserName()
  let password = 'password'
  let email = username + '@example.com'

  return new Promise((resolve, reject) => {
    superagent.post(`localhost:${process.env.PORT}/api/v3/user/auth/local/register`)
      .accept('application/json')
      .send({
        username,
        email,
        password,
        confirmPassword: password
      })
      .end((err, res) => {
        if (err) throw new Error(`Error generating user: ${err}`)

        let {data: user} = res.body
        let userCreds = {
          uuid: user.id,
          token: user.apiToken
        }

        if (connection) {
          connection.setCredentials(userCreds)
        }

        updateDocument('users', user.id, update, () => {
          resolve(userCreds)
        })
      })
  })
}

function updateDocument (collectionName, uuid, update, cb) {
  if (isEmpty(update)) { return cb() }

  if (!process.env.NODE_DB_URI) {
    throw new Error('No process.env.NODE_DB_URI specified. Type `export NODE_DB_URI=\'mongodb://localhost/habitica-node-test\'` on the command line')
  }

  mongo.connect(process.env.NODE_DB_URI, (err, db) => {
    if (err) throw new Error(`Error connecting to database when updating ${collectionName} collection: ${err}`)

    let collection = db.collection(collectionName)

    collection.update({ _id: uuid }, { $set: update }, (err, result) => {
      if (err) throw new Error(`Error updating ${collectionName}: ${err}`)
      cb()
    })
  })
}
