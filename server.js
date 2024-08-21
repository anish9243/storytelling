const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/tts', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.get('https://api.voicerss.org/', {
            params: {
                key: process.env.VOICERSS_API_KEY,
                src: text,
                hl: 'en-us',
                r: '0',
                c: 'mp3',
                f: '44khz_16bit_stereo'
            },
            responseType: 'arraybuffer'
        });
        fs.writeFileSync('public/output.mp3', response.data);
        res.send('/output.mp3');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating speech');
    }
});

app.get('/background-music', async (req, res) => {
    const token = process.env.SPOTIFY_ACCESS_TOKEN;
    try {
        const playlists = {
            rain: '5OtpsXqFNJSausCnNrYCdo',
            jungle: '50SfD4w7i6S8jh0OPBvMfi',
            birds: '3jGF7twHNBhXv3gGYzK4cr'
        };
        const type = req.query.type || 'rain'; // Default to rain sounds
        const playlistId = playlists[type];

        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const tracks = response.data.items;
        const track = tracks.find(t => t.track.preview_url);
        if (track) {
            res.send({ track: track.track.preview_url });
        } else {
            res.status(404).send('No preview available');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching background music');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
