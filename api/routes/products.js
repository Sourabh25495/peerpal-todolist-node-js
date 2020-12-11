const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const TodoList = require("../models/todolist");

router.get("/todos", (req, res, next) => {
  TodoList.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const todolist = new TodoList({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    password: req.body.password,
    todoItem: req.body.todoItem
  });
  todolist
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
