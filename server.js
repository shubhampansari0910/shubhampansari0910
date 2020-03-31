var express = require('Express');
var app = express();

var gmail = require('./gmail.js');

//both index.js and things.js should be in same directory
app.use('/', gmail);
app.use('/emailaddress',gmail)

app.listen(3000);
console.log("Server listing on localhost:3000");
