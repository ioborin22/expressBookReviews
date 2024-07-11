const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  console.log("Request received at /register");
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body); // Отладочный вывод
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
  } else {
      users.push({ username, password });
      return res.status(201).json({ message: "User registered successfully" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = Object.values(books).filter(book => book.author === author);
    if (result.length > 0) {
        return res.json(result);
    } else {
        return res.status(404).json({ message: "Books not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = Object.values(books).filter(book => book.title === title);
    if (result.length > 0) {
        return res.json(result);
    } else {
        return res.status(404).json({ message: "Books not found" });
    }
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

module.exports.general = public_users;
