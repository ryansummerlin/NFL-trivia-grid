// searchComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchPlayerNames = async () => {
            try {
                const response = await axios.get(`/api/nfl-players?name=${searchTerm}`);
                setSearchResults(response.data.players);
            } catch (error) {
                console.error('Error fetching player names: ', error);
            }
        };

        if (searchTerm) {
            fetchPlayerNames();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSelectPlayer = async (selectedPlayerId) => {
        // Make a request to fetch detailed information about the selected player
        try {
            const response = await axios.get(`/api/nfl-athlets/${selectedPlayerId}`);
            // I think you'll have to adjust these two lines below to pull something like name/teams
            const selectedPlayerInfo = response.data.athlete;
            console.log('Selected Player Information: ', selectedPlayerInfo);
        } catch (error) {
            console.error('Error fetching detailed player information', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeHolder="Search for a player"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {searchResults.map((player) => {
                    <li key={player.id} onClick={() => handleSelectPlayer(player.id)}>
                        {player.name}
                    </li>
                })}
            </ul>
        </div>
    );

}

export default SearchComponent;
