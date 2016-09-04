'use strict'

var ghpages = require('gh-pages')
var path = require('path')

ghpages.publish(path.join(__dirname, 'docs'), (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.info('Docs published!')
})
