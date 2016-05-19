/* eslint-disable no-console */
var exec = require('child_process').exec

var PATH_TO_HABITICA = process.env.PATH_TO_HABITICA || '../../habitrpg'

var args = process.argv
var command

if (args.length > 2) {
  command = args.splice(2).join(' ')
}

process.env.PORT = process.env.HABITICA_PORT || 3321
process.env.NODE_DB_URI = process.env.HABITICA_DB_URI || 'mongodb://localhost/habitica-node-test'

var server = require(`${PATH_TO_HABITICA}/website/server/`)

server.listen(process.env.PORT, function () {
  if (command) {
    exec(command, function (error, stdout, stderr) {
      if (error) throw error
      if (stdout) console.log(stdout)
      if (stderr) {
        console.error(stderr)
        process.exit(1)
      }

      process.exit()
    })
  }
})

