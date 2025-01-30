let express = require("express");
let app = express();
let cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.json());

const { getAllBooks, getBookById } = require("./controllers");

// Exercise 1: Retrieve All Books
app.get("/books", async (req, res) => {
  let books = getAllBooks();
  res.json({ books });
});

// Exercise 2: Retrieve Book by ID
app.get("/books/details/:id", async (req, res) => {
  let book = getBookById(parseInt(req.params.id));
  res.json({ book });
});

module.exports = {
  app,
};
