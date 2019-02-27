const express = require('express');
const app = express();
const request = require('request');
const port = 3000;

app.get('/', function(req, res) {
    const url = 'https://raw.githubusercontent.com/deanhume/streams/master/json-response.json';

    request.get(url).pipe(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));