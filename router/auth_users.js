const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" }
];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });
        req.session.authorization = { accessToken };
        console.log("User logged in. Token set in session:", req.session.authorization);
        return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.data;
  console.log("Add/Update review request by user:", username);
  console.log("Current book data before adding review:", books[isbn]);
  if (books[isbn]) {
      if (!books[isbn].reviews) {
          books[isbn].reviews = {};
      }
      if (review) {  // Ensure that the review is not undefined or empty
          books[isbn].reviews[username] = review;
          console.log("Review added/updated for ISBN:", isbn, "by user:", username);
          console.log("Updated book data after adding review:", books[isbn]);
          return res.status(200).json({ message: "Review added/updated successfully" });
      } else {
          console.log("Review content is empty or undefined");
          return res.status(400).json({ message: "Review content is required" });
      }
  } else {
      console.log("Book not found for ISBN:", isbn);
      return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;
  console.log("Delete review request by user:", username);
  console.log("Current book data before deleting review:", books[isbn]);
  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      console.log("Review deleted for ISBN:", isbn, "by user:", username);
      console.log("Updated book data after deleting review:", books[isbn]);
      return res.status(200).json({ message: `Review for ISBN ${isbn} posted by user ${username} deleted.` });
  } else {
      console.log("Book or review not found for ISBN:", isbn, "by user:", username);
      return res.status(404).json({ message: "Book or review not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
