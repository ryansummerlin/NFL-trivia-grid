// server

const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/nfl-athletes/:athleteId', async (req, res) => {
    try {
        const { athleteId } = req.params;

        // const apiURL = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes?limit=1000&active=true';
        const apiUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${athleteId}?lang=en&region=us`;

        const response = await axios.get(apiUrl);
        const athleteInfo = response.data;

        const athleteData = {
            id: athleteInfo.id,
            name: athleteInfo.fullName,
            team: athleteInfo.team
        }

        res.json(athleteInfo);
    } catch (error) {
        console.error('Error fetching NFL teams', error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
