const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(users);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  let listOfBooks = Object.values(books);
  let bookDetail = listOfBooks.find(book => book.isbn === isbn)
  return res.status(200).send(bookDetail);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const {author} = req.params;
  let listOfBooks = Object.values(books);
  let bookDetail = listOfBooks.find(book => book.author === author)
  return res.status(200).json(bookDetail);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  let listOfBooks = Object.values(books);
  let bookDetail = listOfBooks.find(book => book.title === title)
  return res.status(200).json(bookDetail);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  let listOfBooks = Object.values(books);
  let bookDetail = listOfBooks.find(book => book.isbn === isbn)
  return res.status(200).json(bookDetail);
});

public_users.get('/allBooks', async (req, res) => {
  try {
    return res.status(200).send(books);
  } catch (e) {
    console.error(e, 'error while fetching books');
    return res.status(500).json({ message: "Error while fetching books" });
  }
});

public_users.get('/books', async (req, res) =>{
  try{
    let books = await axios.get('http://localhost:4000/allBooks')
    return res.status(200).send(books.data);
  }catch (e) {
    console.error(e, 'error while fetching books')
  }
})

public_users.get('/book/:isbn', async function (req, res) {
  try {
    const { isbn } = req.params;
    let response = await axios.get(`http://localhost:4000/isbn/${isbn}`);
    let bookDetail = response.data;

    if (bookDetail) {
      return res.status(200).json(bookDetail);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (e) {
    console.error('error while fetching books', e);
    return res.status(500).json({ message: "Error while fetching book details" });
  }
});

public_users.get('/book/author/:author', async function (req, res) {
  try {
    const { author } = req.params;
    console.log('-----', author)
    let response = await axios.get(`http://localhost:4000/author/${author}`);
    let bookDetail = response.data;

    if (bookDetail) {
      return res.status(200).json(bookDetail);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (e) {
    console.error('error while fetching books', e);
    return res.status(500).json({ message: "Error while fetching book details" });
  }
});

public_users.get('/book/detail/title/:title', async function (req, res) {
  try {
    const { title } = req.params;
    let response = await axios.get(`http://localhost:4000/title/${title}`);
    let bookDetail = response.data;

    if (bookDetail) {
      return res.status(200).json(bookDetail);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (e) {
    console.error('error while fetching books', e);
    return res.status(500).json({ message: "Error while fetching book details" });
  }
});

module.exports.general = public_users;
