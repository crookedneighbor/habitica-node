import {MongoClient as mongo} from 'mongodb'
import {v4 as generateRandomUserName} from 'uuid'
import superagent from 'superagent'

async function generateUser (update = {}, connection) {
  let username = generateRandomUserName()
  let password = 'password'
  let email = username + '@example.com'

  let res = await superagent.post(`localhost:${process.env.PORT}/api/v3/user/auth/local/register`)
    .accept('application/json')
    .send({
      username,
      email,
      password,
      confirmPassword: password
    })

  let {data: user} = res.body
  let userCreds = {
    uuid: user.id,
    token: user.apiToken
  }

  if (connection) {
    connection.setCredentials(userCreds)
  }

  await updateDocument('users', user.id, update)

  return userCreds
}

async function updateDocument (collectionName, uuid, update) {
  if (!update) { return }

  if (!process.env.NODE_DB_URI) {
    throw new Error('No process.env.NODE_DB_URI specified. Type `export NODE_DB_URI=\'mongodb://localhost/habitica-node-test\'` on the command line')
  }

  return new Promise((resolve, reject) => {
    mongo.connect(process.env.NODE_DB_URI, (connectionError, db) => {
      if (connectionError) {
        reject(new Error(`Error connecting to database when updating ${collectionName} collection: ${connectionError}`))
      }

      let collection = db.collection(collectionName)

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
