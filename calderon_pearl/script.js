function onTextChange() {
    let name = document.querySelector("#name").value;
    let comments = document.querySelector("#comments").value;
    let commentButton = document.querySelector("#comment_button");

    if (comments.length && name.length) {
        commentButton.disabled = false;
    } else {
        commentButton.disabled = true;
    }
}

function addComment(event) {
    event.preventDefault();
    let onAddName = document.querySelector('#name').value;
    let onAddMessage = document.querySelector('#comments').value;
    let tbody = document.querySelector('#comments_list');
    let newRow = tbody.insertRow();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    newRow.insertCell(0).textContent = onAddName;
    newRow.insertCell(1).textContent = onAddMessage;
    newRow.insertCell(2).textContent = formattedDate;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        const index = newRow.rowIndex - 1; 
        tbody.deleteRow(index);
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
    };

    newRow.insertCell(3).appendChild(deleteButton);

    document.querySelector('#name').value = '';
    document.querySelector('#comments').value = '';
    document.querySelector('#comment_button').disabled = true;

    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push
        ({ name: onAddName, message: onAddMessage, date: formattedDate });
    localStorage.setItem('comments', JSON.stringify(comments));
}

document.querySelector('#comment_form').addEventListener('submit', addComment);

window.onload = function () {
    const tbody = document.querySelector('#comments_list');
    const comments = JSON.parse(localStorage.getItem('comments')) || [];

    comments.forEach(comment => {
        const newRow = tbody.insertRow();

        newRow.insertCell(0).textContent = comment.name;
        newRow.insertCell(1).textContent = comment.message;
        newRow.insertCell(2).textContent = comment.date;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            const index = newRow.rowIndex - 1; 
            tbody.deleteRow(index);
            const comments = JSON.parse
                (localStorage.getItem('comments')) || [];
            comments.splice(index, 1);
            localStorage.setItem('comments', JSON.stringify(comments));
        };

        newRow.insertCell(3).appendChild(deleteButton);
    });
}

function parseCustomDate(dateString) {
    const [datePart, timePart] = dateString.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
}

function compareDates(a, b) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA < dateB) {
        return -1;
    } else if (dateA > dateB) {
        return 1;
    } else {
        return 0;
    }
}

function sortTable(ascending) {
    const tbody = document.querySelector('#comments_list');
    const rows = Array.from(tbody.rows);

    const comments = rows.map(row => ({
        name: row.cells[0].textContent,
        message: row.cells[1].textContent,
        date: row.cells[2].textContent,
    }));

    comments.sort(compareDates);

    if (!ascending) {
        comments.reverse();
    }

    while (tbody.rows.length > 0) {
        tbody.deleteRow(0);
    }

    comments.forEach(comment => {
        const newRow = tbody.insertRow();
        newRow.insertCell(0).textContent = comment.name;
        newRow.insertCell(1).textContent = comment.message;
        newRow.insertCell(2).textContent = comment.date;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            const index = newRow.rowIndex;
            tbody.deleteRow(index);
            comments.splice(index, 1);
            localStorage.setItem('comments', JSON.stringify(comments));
        };
        newRow.insertCell(3).appendChild(deleteButton);
    });
}

document.querySelector('#sort-ascending').
    addEventListener('click', function () {
sortTable(true);
});

document.querySelector('#sort-descending').
    addEventListener('click', function () {
sortTable(false);
});