const express = require('express');
const app = express();
const request = require('request');
const port = 3000;

app.get('/', function(req, res) {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/e/e8/View_from_eiffel_tower_2nd_level.jpg';

    request.get(url).pipe(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));