const baseUrl = 'https://thefusionseller.online/restapi/basketball.php';

async function fetchPlayers() {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        console.log('Players:', data);
        return data;
    } catch (error) {
        console.error('Error fetching players:', error);
        throw error;
    }
}

async function addPlayer(playerData) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(playerData),
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error adding player:', error);
        throw error;
    }
}

async function updatePlayer(playerId, playerData) {
    try {
        const response = await fetch(`${baseUrl}?id=${playerId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ ...playerData, id: playerId }),
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
}

async function deletePlayer(playerId) {
    try {
        const response = await fetch(`${baseUrl}?id=${playerId}`, {
            method: 'DELETE',
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error deleting player:', error);
        throw error;
    }
}

function updatePlayerList(players) {
    const playerList = document.getElementById('player_list');
    playerList.innerHTML = '';

    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = 
        `Name: ${player.player_name}, Team: ${player.team_name},
         Position: ${player.player_position}, Age: ${player.player_age}`;

        const editButton = createButton('Edit', () => handleEdit(player.id));
        const deleteButton = createButton('Delete', async () => {
            await deletePlayer(player.id);
            const updatedPlayers = await fetchPlayers();
            updatePlayerList(updatedPlayers);
        });

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        playerList.appendChild(listItem);
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

async function handleEdit(playerId) {
    console.log('Edit button clicked for player ID:', playerId);

    try {
        const response = await fetch(`${baseUrl}?id=${playerId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const playerDetailsArray = await response.json();
        const playerDetails = playerDetailsArray[0];

        console.log('Player details:', playerDetails);

        if (playerDetails && playerDetails.player_name) {
            const editForm = document.createElement('form');
            editForm.innerHTML = `
                <label for="edit_name">Name: </label>
                <input type="text" id="edit_name" name="player_name" 
                value="${playerDetails.player_name}" required>
                <label for="edit_team">Team: </label>
                <input type="text" id="edit_team" name="team_name" 
                value="${playerDetails.team_name || ''}" required>
                <label for="edit_position">Position:</label>
                <input type="text" id="edit_position" name="player_position" 
                value="${playerDetails.player_position || ''}" required>
                <label for="edit_age">Age: </label>
                <input type="number" id="edit_age" name="player_age" 
                value="${playerDetails.player_age || ''}" required>
                <button type="submit">Save Changes</button>
            `;

            editForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const updatedPlayerData = {
                    player_name: editForm.elements.edit_name.value,
                    team_name: editForm.elements.edit_team.value,
                    player_position: editForm.elements.edit_position.value,
                    player_age: editForm.elements.edit_age.value,
                };

                await updatePlayer(playerId, updatedPlayerData);

                const updatedPlayers = await fetchPlayers();

                updatePlayerList(updatedPlayers);

                editForm.remove();
            });

            document.body.appendChild(editForm);
        } else {
            console.error('Error: Player details not available or incomplete');
        }
    } catch (error) {
        console.error('Error fetching player details for editing:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const addPlayerForm = document.getElementById('player_form');
    const response = await fetchPlayers();

    if (response) {
        updatePlayerList(response);
    }

    addPlayerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addPlayerForm);
        const playerData = Object.fromEntries(formData.entries());

        await addPlayer(playerData);
        addPlayerForm.reset();

        const updatedPlayers = await fetchPlayers();
        updatePlayerList(updatedPlayers);
    });
});