const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res, next) => {
  // console.log(req);
  const result = await mongodb.getDb().db().collection("books").find();
  // console.log(result);
  result.toArray().then((err, lists) => {
    if (err) {
      res.status(400).json({ message: err });
    }
    console.log(lists);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("books")
    .find({ _id: userId });
  result.toArray().then((err, lists) => {
    if (err) {
      res.status(400).json({ message: err });
    }
    console.log(lists);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const createBook = async (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages,
    dateFinished: req.body.dateFinished,
    read: req.body.read,
    datePublished: req.body.datePublished,
    genre: req.body.genre,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .insertOne(book);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while creating the contact."
      );
  }
};

const updateBook = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const book = {
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages,
    dateFinished: req.body.dateFinished,
    read: req.body.true,
    datePublished: req.body.datePublished,
    genre: req.body.genre,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .replaceOne({ _id: userId }, book);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while updating the contact."
      );
  }
};

const deleteBook = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .deleteOne({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while deleting the contact."
      );
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook,
};
