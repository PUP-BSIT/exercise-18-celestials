function onTextChange() {
    let message = document.querySelector("#message").value.trim();
    let name = document.querySelector("#name").value.trim();
    let commentButton = document.querySelector("#comment_button");

    if (message.length && name.length) {
        commentButton.disabled = false;
    }
    else {
        commentButton.disabled = true;
    }
}

function addComment() {
    let onInputName = document.querySelector('#name').value;
    let onInputMessage = document.querySelector('#message').value;
    let commentSection = document.querySelector('.comment-section');
    let sortOrder = document.querySelector('#sort_order').value;

    const existingComments = JSON.parse(localStorage.getItem('comments'))
                                 || [];

    const newComment = {
        name: onInputName,
        message: onInputMessage,
        timestamp: new Date().getTime()
    };

    existingComments.push(newComment);

    localStorage.setItem('comments', JSON.stringify(existingComments));

    displayComments(commentSection, sortOrder);

    document.querySelector('#name').value = '';
    document.querySelector('#message').value = '';
}

function displayComments(commentSection, sortOrder = 'asc') {

    commentSection.innerHTML = '';

    const existingComments = JSON.parse(localStorage.getItem('comments'))
                                 || [];

    document.querySelector('#sort_order').value = sortOrder;

    const sortedComments = existingComments.sort((a, b) => {
        return sortOrder === 'asc' ? a.timestamp - b.timestamp
                                 : b.timestamp - a.timestamp;
    });    

    sortedComments.forEach(comment => {
        const commentBox = document.createElement('span');
        const commentElement = document.createElement('p');
        commentElement.textContent = `${comment.name}: ${comment.message}`;
        commentBox.appendChild(commentElement);
        commentSection.appendChild(commentBox);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let commentSection = document.querySelector('.comment-section');
    displayComments(commentSection);

    document.querySelector('#sort_order')
        .addEventListener('change', function() {
        const sortOrder = this.value;
        displayComments(commentSection, sortOrder); 
    });
});