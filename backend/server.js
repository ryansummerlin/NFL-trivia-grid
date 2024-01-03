// server

const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

async function fetchStatsLogInfo(statsLogUrl) {
    try {
        const response = await axios.get(statsLogUrl);
        const statsLogInfo = response.data;

        return statsLogInfo;
    } catch (error) {
        console.error('Error fetching stats log information', error);
        throw new Error('Error fetching stats log information');
    }
}

async function fetchTeamInfo(teamUrl) {
    try {
        const response = await axios.get(teamUrl);
        const teamInfo = response.data;

        const teamData = {
            id: teamInfo.id,
            name: teamInfo.name
        }

        return teamData;
    } catch (error) {
        console.error('Error fetching team information', error);
        throw new Error('Error fetching team information');
    }
}

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
            currentTeam: [],
            statsLog: athleteInfo.statisticslog,
            teamsPlayedFor: []
        }

        const athleteResponseAttributes = {
            id: athleteData.id,
            name: athleteData.name,
            currentTeam: athleteData.currentTeam,
            teamsPlayedFor: athleteData.teamsPlayedFor
        }

        if (athleteInfo.statisticslog && athleteInfo.statisticslog.$ref) {
            const statsLogUrl = athleteInfo.statisticslog.$ref;
            const statsLogData = await fetchStatsLogInfo(statsLogUrl);
            athleteData.statsLog = statsLogData;
        }

        for (let i = 0; i < athleteData.statsLog.entries.length; i++) {
            let season = athleteData.statsLog.entries[i];
            for (let j = 0; j < season.statistics.length; j++) {
                let statsObj = season.statistics[j];
                if (statsObj.type === 'team') {
                    const teamUrl = statsObj.team.$ref;
                    const teamData = await fetchTeamInfo(teamUrl);
                    if (athleteData.teamsPlayedFor.indexOf(teamData.name) === -1) athleteData.teamsPlayedFor.push(teamData.name);
                }
            }
        }

        if (athleteInfo.team && athleteInfo.team.$ref) {
            const teamUrl = athleteInfo.team.$ref;
            const teamData = await fetchTeamInfo(teamUrl);
            athleteData.currentTeam.push(teamData.name);
        }

        res.json(athleteResponseAttributes);
    } catch (error) {
        console.error('Error fetching NFL teams', error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }

});

app.get('api/nfl/players', async (req, res) => {
    try {
        const {name} = req.query;

        const players = [
            {id: 1, name: 'Aaron Rodgers'},
            {id: 2, name: 'Aaron Donald'}
        ];

        const matchingPlayers = players.filter((player) => {
            player.name.toLowerCase().includes(name.toLowerCase());
        });

        res.json({ success: true, players: matchingPlayers });
    } catch (error) {
        console.error('Error searching for NFL players by name', error);
        res.status(500).json({ success: false, error: 'Internal Server Error'});
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
