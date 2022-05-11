// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    // Add Book to List
    addBookToList(book) {
        const bookList = document.querySelector("#book-list");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><i class="delete fa-solid fa-circle-xmark"></i></td>
        `;

        // Append row to bookList
        bookList.appendChild(row);
    }

    // Delete Bookfrom List
    deleteBook(elem) {
        if (elem.classList.contains("delete")) {
            elem.parentElement.parentElement.remove();
        }    
    }

    // Clear input
    clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = ""
    document.querySelector("#isbn").value = "";
    }

    // Show alert
    showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        // Clear fields after 3 secs
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }
}

// Local storage class
class Store {
    static getBookFromLs() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static addBookToLs(book) {
        const books = Store.getBookFromLs();
        
        books.push(book);
  
        localStorage.setItem("books", JSON.stringify(books));
    }

    static displayBook() {
        const books = Store.getBookFromLs();
        
        // Instantiate ui object
        const ui = new UI();

        books.forEach(book => {
            ui.addBookToList(book);
        });
    }

    static removeBookFromLs(isbn) {
        const books = Store.getBookFromLs();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayBook);

// Event listeners
const form = document.querySelector("#book-form");
const bookList = document.querySelector("#book-list");

// Add book to list
form.addEventListener("submit", (e) => {
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Instantiate book object
    const book = new Book(title, author, isbn);

    // Instantiate ui object
    const ui = new UI();

    if (title === "" || author === "" || isbn === "") {
        // Show error message
        ui.showAlert("Please fill in all fields!", "error");
    } else {
        // Add book
        ui.addBookToList(book);

        // Add book to LS
        Store.addBookToLs(book);

        // Clear Fields
        ui.clearFields();

        // Show success message
        ui.showAlert("Book Added!", "success");
    }

    e.preventDefault();
});

// Remove book from list
bookList.addEventListener("click", (e) => {
    const ui = new UI();
    
    // Delete book from List
    ui.deleteBook(e.target);

    // Delete book from LS
    Store.removeBookFromLs(e.target.parentElement.previousElementSibling.textContent);

    // Show message
    ui.showAlert("Book Remove!", "success");
});