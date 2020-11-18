// Packages and models required
const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const { Op } = require('../models').Sequelize;

// Async handler
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}

// Pagination function
const pagination = (query, { page, totalBooks }) => {
  const limit = totalBooks;
  const offset = page * totalBooks;
  return { ...query, offset, limit };
};

// Gets book listing and paginates results, if any
router.get('/books', asyncHandler(async(req, res) => {
  let query = !req.query.query ? "" : req.query.query;
  let currentPage = (!req.query.page) ? 0 : req.query.page;
  let books;
  if (!query) {
    books = await Book.findAndCountAll(
      pagination(
        {
          order: [["title", "ASC"]], // order
        },
        { page: currentPage, totalBooks: 10 }
      )
    );
  } else {
    books = await Book.findAndCountAll(
      pagination(
        {
          where: {
            [Op.or]: [
              { title: { [Op.substring] : query } },
              { author: { [Op.substring] : query } },
              { genre: { [Op.substring] : query } },
              { year: { [Op.substring] : query } }
            ]
          },
          order: [[ "title", "ASC" ]]
        },
        { page: currentPage, totalBooks: 10 },
      )
    );
  }
  let totalPages = (books.count <= 10) ? 0 : Math.ceil(books.count / 10);
  res.render("index", { query, totalPages, books: books.rows, title: 'Books' });
}));

// Gets new book page
router.get('/books/new', asyncHandler(async(req, res) => {
  res.render("new-book", { book: {title: "", author: "", genre: "", year: ""}, title: 'New Book' });
}));

// Posts new book if requirements are met 
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: err.errors, title: "New Book" })
    } else {
      next(err); 
    }  
  }
}));

// Gets book edit page
router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    res.render("update-book", { book, title: "Update Book" });
  } else if (!book) {
    const err = new Error();
    err.status = 404;
    err.message = "Seems like the book you requested doesn't exist.";
    next(err);
  }
}));

// Posts updated book if requirements are met
router.post('/books/:id', asyncHandler(async(req, res, next) => {
  let book = await Book.findByPk(req.params.id);
  try {
    if (book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: err.errors, title: "Update Book" })
    } else {
      next(err);
    }
  }
}));

// Updates book listing about the deleted book
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
  let book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;