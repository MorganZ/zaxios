

var express = require('express')
var app = express()

app.get('/api/one', function (req, res) {
  res.json({'Hello World':4});
})

app.listen(4000)