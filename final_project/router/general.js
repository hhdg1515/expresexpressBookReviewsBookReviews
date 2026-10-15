
const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered",
  });
});

// Retrieve all books
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// Search by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  return res.status(200).json(book);
});

// Search by author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();

  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) =>
      book.author.toLowerCase().includes(author)
    )
  );

  return res.status(200).json(matches);
});

// Search by title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) =>
      book.title.toLowerCase().includes(title)
    )
  );

  return res.status(200).json(matches);
});

// Get reviews for a book
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  return res.status(200).json(book.reviews);
});

// Four Axios asynchronous methods
const BASE_URL = "http://localhost:5000";

// 1. Async/Await: Get all books
async function getAllBooks() {
  const response = await axios.get(BASE_URL + "/");
  return response.data;
}

// 2. Promise: Get book by ISBN
function getBookByISBN(isbn) {
  return axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => response.data);
}

// 3. Async/Await: Get books by author
async function getBooksByAuthor(author) {
  const response = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );
  return response.data;
}

// 4. Promise: Get books by title
function getBooksByTitle(title) {
  return axios
    .get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then((response) => response.data);
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
