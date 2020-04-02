var express = require('Express');
var app = express();

var index = require('./index.js');

app.get('/', index);
app.post('/create',index);
app.put('/update',index);
app.delete('/delete',index);

app.listen(3010);
console.log("Server listing on localhost:3010");
