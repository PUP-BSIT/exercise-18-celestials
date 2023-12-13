const baseUrl = 'https://thefusionseller.online/restapi/calderon_backend.php';

function fetchCharacters() {
    return fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Characters:', data);
            return data;
        })
        .catch(error => console.error('Error fetching characters:', error));
}

function addCharacter(characterData) {
    return fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(characterData),
    })
        .then(response => response.text())
        .then(responseText => console.log(responseText))
        .catch(error => console.error('Error adding character:', error));
}

function updateCharacter(characterId, characterData) {
    return fetch(`${baseUrl}?id=${characterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ...characterData, id: characterId }),
    })
        .then(response => response.text())
        .then(responseText => console.log(responseText))
        .catch(error => console.error('Error updating character:', error));
}

function deleteCharacter(characterId) {
    return fetch(`${baseUrl}?id=${characterId}`, {
        method: 'DELETE',
    })
        .then(response => response.text())
        .then(responseText => console.log(responseText))
        .catch(error => console.error('Error deleting character:', error));
}

function updateCharacterList(characters) {
    const characterTable = document.getElementById('characterTable');
    characterTable.innerHTML = '';

    const headerRow = document.createElement('tr');
    const headerNames = ['Name', 'Anime Show', 'Genre', 'Japanese Voice Actor',
         'Life Status', 'Actions'];

    headerNames.forEach(headerName => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerName;
        headerRow.appendChild(headerCell);
    });

    characterTable.appendChild(headerRow);

    characters.forEach(character => {
        const row = document.createElement('tr');

        ['name', 'anime_show', 'genre', 'japanese_voice_actor', 'life_status'].
            forEach(property => {
            const cell = document.createElement('td');
            cell.textContent = character[property];
            row.appendChild(cell);
        });

        const editButton = 
            createButton('Edit', () => handleEdit(character.id));
        const deleteButton = createButton('Delete', async () => {
            await deleteCharacter(character.id);
            const updatedCharacters = await fetchCharacters();
            updateCharacterList(updatedCharacters);
        });

        const actionsCell = document.createElement('td');
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        characterTable.appendChild(row);
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function handleEdit(characterId) {
    console.log('Edit button clicked for character ID:', characterId);

    fetch(`${baseUrl}?id=${characterId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(characterDetailsArray => {
            const characterDetails = characterDetailsArray[0];

            console.log('Character details:', characterDetails);

            if (characterDetails && characterDetails.name) {
                const editForm = document.createElement('form');
                editForm.innerHTML = `
                    <label for="editName">Name:</label>
                    <input type="text" 
                        id="editName" 
                        name="name" 
                        value="${characterDetails.name}" required>
                    <label for="editAnimeShow">Anime Show:</label>
                    <input type="text" 
                        id="editAnimeShow" 
                        name="anime_show" 
                        value="${characterDetails.anime_show || ''}" required>
                    <label for="editGenre">Genre:</label>
                    <input type="text" 
                        id="editGenre" 
                        name="genre" 
                        value="${characterDetails.genre || ''}" required>
                    <label for="editJapaneseVoiceActor">
                        Japanese Voice Actor:</label>
                    <input type="text" 
                        id="editJapaneseVoiceActor" 
                        name="japanese_voice_actor" 
                        value="${characterDetails.japanese_voice_actor || ''}"
                             required>
                    <label for="editLifeStatus">Life Status:</label>
                    <input type="text" 
                        id="editLifeStatus" 
                        name="life_status" 
                        value="${characterDetails.life_status || ''}" required>
                    <button type="submit">Save Changes</button>
                `;

                editForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const updatedCharacterData = {
                        name: editForm.elements.editName.value,
                        anime_show: editForm.elements.editAnimeShow.value,
                        genre: editForm.elements.editGenre.value,
                        japanese_voice_actor: editForm.elements.
                            editJapaneseVoiceActor.value,
                        life_status: editForm.elements.editLifeStatus.value,
                    };

                    await updateCharacter(characterId, updatedCharacterData);

                    const updatedCharacters = await fetchCharacters();

                    updateCharacterList(updatedCharacters);

                    editForm.remove();
                });

                document.body.appendChild(editForm);
            } else {
                console.error
                    ('Error: Character details not available or incomplete');
            }
        })
        .catch(error => console.error
                ('Error fetching character details for editing:', error));
}

document.addEventListener('DOMContentLoaded', async () => {
    const addCharacterForm = document.getElementById('addCharacterForm');
    const response = await fetchCharacters();

    if (response) {
        updateCharacterList(response);
    }

    addCharacterForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addCharacterForm);
        const characterData = Object.fromEntries(formData.entries());

        await addCharacter(characterData);
        addCharacterForm.reset();

        const updatedCharacters = await fetchCharacters();
        updateCharacterList(updatedCharacters);
    });
});