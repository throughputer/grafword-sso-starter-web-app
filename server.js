import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));

// Endpoint to send configuration to client-side
app.get('/config', (req, res) => {
    res.json({
        clientId: process.env.CLIENT_ID,
        grafwordDomain: process.env.GRAFWORD_DOMAIN,
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/public/profile.html');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
