const myRestApi = 'https://thefusionseller.online/restapi/lopez_backend.php';

function addBook() {
    let bookTitle = document.querySelector('#book_title').value.trim();
    let bookAuthor = document.querySelector('#book_author').value.trim();
    let bookGenre = document.querySelector('#book_genre').value.trim();
    let bookYear = document.querySelector('#book_year').value.trim();
    let bookSynopsis = document.querySelector('#book_synopsis').value.trim();

    fetch(myRestApi, {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        body: `title=${bookTitle}&author=${bookAuthor}&genre=${bookGenre}
                &year=${bookYear}&synopsis=${bookSynopsis}`
    })
        .then((response) => response.text())
        .then((responseText) => {
            alert(responseText);
        });
}

function displayBook() {
    const table = document.querySelector("#book_list");
    table.innerHTML = '';
    
    // Add the header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>BookID</th>
        <th>Title</th>
        <th>Author</th>
        <th>Genre</th>
        <th>Year</th>
        <th>Synopsis</th>
        <th>Action</th>`;
    table.appendChild(headerRow);
    
    fetch(myRestApi)
        .then((response) => response.json())
        .then((bookList) => {
            for (const book of bookList) {
                addRowToTable(book);
            }
        });
}

function addRowToTable(book) {
    const table = document.querySelector("#book_list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.year}</td>
        <td>${book.synopsis}</td>
        <td>
            <button onclick="editBook('${book.title}',
                '${book.author}', '${book.genre.trim()}',
                '${book.year}', '${book.synopsis}')">
                Edit
            </button>
            <button onclick="updateBook(${book.id})">Update</button>
            <button onclick="deleteBook(${book.id})">Delete</button>
        </td>`;
    table.appendChild(row);
}

function editBook(title, author, genre, year, synopsis) {
    let bookTitle = document.querySelector('#book_title');
    let bookAuthor = document.querySelector('#book_author');
    let bookGenre = document.querySelector('#book_genre');
    let bookYear = document.querySelector('#book_year');
    let bookSynopsis = document.querySelector('#book_synopsis');

    bookTitle.value = title;
    bookAuthor.value = author;
    bookGenre.value = genre;
    bookYear.value = year;
    bookSynopsis.value = synopsis;


}

function updateBook(id) {
    let bookTitle = document.querySelector('#book_title').value.trim();
    let bookAuthor = document.querySelector('#book_author').value.trim();
    let bookGenre = document.querySelector('#book_genre').value.trim();
    let bookYear = document.querySelector('#book_year').value.trim();
    let bookSynopsis = document.querySelector('#book_synopsis').value.trim();

    fetch(myRestApi, {
        method: 'PATCH',
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        body: `id=${id}&title=${bookTitle}&author=${bookAuthor}&` + 
        `genre=${bookGenre}&year=${bookYear}&synopsis=${bookSynopsis}`
    })
    .then((response) => response.text())
    .then((responseText) => {
        alert(responseText);
        displayBook();
    });
}

function deleteBook(bookId) {
    fetch(myRestApi, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: `id=${bookId}`
    })
    .then((response) => response.text())
    .then((responseText) => {
        alert(responseText);
        displayBook();
    })
}