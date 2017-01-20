'use strict'

var ghpages = require('gh-pages')
var path = require('path')
var version = require('../package.json').version

ghpages.publish(path.join(__dirname, '../docs/habitica/' + version), (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.info('Docs published!')
})
