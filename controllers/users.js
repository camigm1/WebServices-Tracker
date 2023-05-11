const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection("users").find();
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
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use valid contact id to find contact.");
  }
  const result = await mongodb
    .getDb()
    .db()
    .collection("users")
    .find({ _id: userId });
  result.toArray((err, lists) => {
    if (err) {
      res.status(400).json({ message: err });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const createUser = async (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    birthday: req.body.birthday,
    email: req.body.email,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
    .insertOne(user);
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

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use valid contact id to find contact.");
  }
  // be aware of updateOne if you only want to update specific fields
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    birthday: req.body.birthday,
    email: req.body.email,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
    .replaceOne({ _id: userId }, user);
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

const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use valid contact id to delete contact.");
  }
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
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
  createUser,
  updateUser,
  deleteUser,
};
