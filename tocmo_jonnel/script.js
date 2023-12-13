const comments = JSON.parse(localStorage.getItem('comments')) || [];

function buttonToggle() {
    const nameInput = document.querySelector("#name").value.trim();
    const commentBox = document.querySelector("#comment").value.trim();
    const commentButton = document.querySelector("#comment_button");

    if (nameInput.length && commentBox.length) {
        commentButton.disabled = false;
    } else {
        commentButton.disabled = true;
    }
}

function addComment() {
    const onInputName = document.querySelector('#name').value;
    const onInputMessage = document.querySelector('#comment').value;

    const newComment = {
        name: onInputName,
        message: onInputMessage,
        date: new Date()
    };

    comments.push(newComment);

    localStorage.setItem('comments', JSON.stringify(comments));

    comments.sort((a, b) => b.date - a.date);

    renderComments();

    document.querySelector('#name').value = '';
    document.querySelector('#comment').value = '';
}

function sortComments(order) {
    if (order === 'asc') {
        comments.sort((a, b) => a.date - b.date);
    } else if (order === 'desc') {
        comments.sort((a, b) => b.date - a.date);
    }
    renderComments();
}

function renderComments() {
    const commentSection = document.querySelector('#comment_list');

    commentSection.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = `${comment.name}: ${comment.message}`;
        commentSection.appendChild(commentElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const teamsContainer = document.getElementById('teams-container');
    const teamForm = document.getElementById('team-form');

    teamForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const teamName = document.getElementById('teamName').value;
        const coach = document.getElementById('coach').value;
        const country = document.getElementById('country').value;

        addTeam({ teamName, coach, country });

        teamForm.reset();
    });

    teamsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('update-button')) {
            const teamId = event.target.dataset.teamId;
            const newWins = prompt('Enter new number of wins:');

            updateTeam(teamId, newWins);
        } else if (event.target.classList.contains('delete-button')) {
            const teamId = event.target.dataset.teamId;
            deleteTeam(teamId);
        }
    });

    function fetchTeams() {
        fetch('https://thefusionseller.online/restapi/tocmo_backend.php')
            .then(response => response.json())
            .then(teams => displayTeams(teams))
            .catch(error => console.error('Error fetching teams:', error));
    }

    function displayTeams(teams) {
        teamsContainer.innerHTML = '';
        teams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.classList.add('team-card');
            teamCard.innerHTML = `
                <h2>${team.teamName}</h2>
                <p>Coach: ${team.coach}</p>
                <p>Country: ${team.country}</p>
                <p>Wins: ${team.wins}</p>
                <button class="update-button" data-team-id="${team.id}">
                Update Wins
                </button>
                <button class="delete-button" data-team-id="${team.id}">
                Delete
                </button>
            `;
            teamsContainer.appendChild(teamCard);
        });
    }

    function addTeam({ teamName, coach, country }) {
        fetch('https://thefusionseller.online/restapi/tocmo_backend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teamName, coach, country }),
        })
        .then(response => {
            if (response.ok) {
                fetchTeams();
            } else {
                console.error('Error adding team:', response.status);
            }
        })
        .catch(error => console.error('Error adding team:', error));
    }

    function updateTeam(teamId, newWins) {
        fetch(`https://thefusionseller.online/restapi/tocmo_backend.php?id=
        ${teamId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${teamId}&wins=${newWins}`,
        })
        .then(response => {
            if (response.ok) {
                fetchTeams();
            } else {
                console.error('Error updating team:', response.status);
            }
        })
        .catch(error => console.error('Error updating team:', error));
    }    

    function deleteTeam(teamId) {
        fetch(`https://thefusionseller.online/restapi/tocmo_backend.php?id=
        ${teamId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchTeams();
            } else {
                console.error('Error deleting team:', response.status);
            }
        })
        .catch(error => console.error('Error deleting team:', error));
    }
    fetchTeams();
});