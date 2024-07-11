const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "Customer successfully registred. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.json(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Simulate async callback to get book details based on Author using Promise
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  new Promise((resolve, reject) => {
       
      setTimeout(() => {
          const booksByAuthor = Object.values(books).filter(book => book.author === author);
          if (booksByAuthor.length > 0) {
              resolve(booksByAuthor);
          } else {
              reject("Books by this author not found");
          }
      }, 1000);
  })
  .then((booksByAuthor) => {
      res.json(booksByAuthor);
  })
  .catch((error) => {
      res.status(404).json({ message: error });
  });
});

// Simulate async callback to get book details based on Title using Promise
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  new Promise((resolve, reject) => {
       
      setTimeout(() => {
          const booksByTitle = Object.values(books).filter(book => book.title === title);
          if (booksByTitle.length > 0) {
              resolve(booksByTitle);
          } else {
              reject("Books with this title not found");
          }
      }, 1000);
  })
  .then((booksByTitle) => {
      res.json(booksByTitle);
  })
  .catch((error) => {
      res.status(404).json({ message: error });
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Simulate async callback to get all books using a Promise
public_users.get('/books', (req, res) => {
  new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(books);
      }, 1000);
  })
  .then((booksData) => {
      res.json(booksData);
  })
  .catch((error) => {
      res.status(500).json({ message: "Error fetching books data" });
  });
});

module.exports.general = public_users;
