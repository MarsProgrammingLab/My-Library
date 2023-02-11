// Book Class: To represent a book
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

// UI class: Handle UI Tasks
class UI {
  // This class will not be instantiated
  // Methods will be static
  // So it belongs only to the class and can only be accessed by UI class instead of its instance
  static displayBooks() {
    const books = Store.getBooks();

    // Loop thru array

    books.forEach((book) => UI.addBookToLibrary(book));
  }
  // Add book to static method
  static addBookToLibrary(book) {
    const libraryList = document.querySelector("#libraryList");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.pages}</td>
    <td>${book.read}</td>
    <td><a href="#" class="delete-btn">X</a></td>
    `;

    libraryList.appendChild(row);
  }

  static deleteBook(element) {
    if (element.classList.contains("delete-btn")) {
      // Use parent element twice to access and delete <tr> and not just <td>
      element.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#pages").value = "";
    document.querySelector("#haveRead").value = "";
  }
}

// Store Class: Handle Storage
class Store {
  // methods are declared with static so they can be declared directly
  // without having to instantiate its class
  static getBooks() {
    let books;

    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      // use JSON.parse to use String as an array of objects
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    // JSON.stringify to add books as array of objects
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(title) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add Books
document.querySelector("#form").addEventListener("submit", (e) => {
  // Prevent form submission
  e.preventDefault();
  // get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const read = document.querySelector("#haveRead").value;

  // Validate
  if (title === "" || author === "" || pages === "") {
    alert("Please try again.");
  } else {
    // instantiate book
    const book = new Book(title, author, pages, read);

    // Add book to UI class
    UI.addBookToLibrary(book);

    // Add book to store
    Store.addBook(book);

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove Books
document.querySelector("#libraryList").addEventListener("click", (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);
  // Remove book from Store
  Store.removeBook(
    // get title query, first child of table row in libraryList
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.previousElementSibling.textContent
  );
});
