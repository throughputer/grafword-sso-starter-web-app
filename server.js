const express = require('express');
const app = express();
const port = 8000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/public/profile.html');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
