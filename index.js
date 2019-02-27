const express = require('express');
const app = express();
const request = require('request');
const port = 3000;
const path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/request', function(req, res) {
    const url = 'https://raw.githubusercontent.com/deanhume/streams/master/json-response.json';

    request.get(url).pipe(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));