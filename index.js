const express = require('express');
const app = express();
const request = require('request');
const port = 3000;
const path = require('path');
const fs = require('fs');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/main.js', function(req, res) {
    res.sendFile(path.join(__dirname+'/main.js'));
});

app.get('/request', function(req, res) {
    const filePath = path.join(__dirname+'/json-response.ndjson');
   
    fs.createReadStream(filePath).pipe(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));