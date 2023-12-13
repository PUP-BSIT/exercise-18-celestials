let comments = [];

function onTextChange() {
    let commentButton = document.querySelector("#comment_button");
    let name = document.querySelector("#name").value.trim();
    let message = document.querySelector("#message").value.trim();

    if (message.length && name.length) {
        commentButton.disabled = false;
    } else {
        commentButton.disabled = true;
    }
}

function addComment() {
    let onInputName = document.querySelector('#name').value;
    let onInputMessage = document.querySelector('#message').value;

    const timestamp = new Date().toISOString();
    comments.push({ name: onInputName, message: onInputMessage, timestamp });

    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    displayComments();

    document.querySelector('#name').value = ''; 
    document.querySelector('#message').value = '';
    document.querySelector("#comment_button").disabled = true;
}

function sortComments(order) {
    if (order === 'asc') {
        comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else {
        comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    displayComments();
}

function displayComments() {
    let commentSection = document.querySelector('.comments');
    commentSection.innerHTML = '';

    comments.forEach(commentData => {
        const commentElement = document.createElement('p');
        commentElement.textContent = 
            `${commentData.name}: ${commentData.message}`;
        commentSection.appendChild(commentElement);
    });
}