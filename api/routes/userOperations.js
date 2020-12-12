const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const TodoList = require("../models/todolist");
const passport = require('passport')

genToken = user => {
  return jwt.sign({
    iss: 'Joan_Louji',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, 'joanlouji');
}

router.post("/add-user", (req, res, next) => {
  TodoList.find({emailId: req.body.emailId}).then(response => {
    if (response && Array.isArray(response) && response.length !== 0) {
      res.status(403).json({message: 'Existing Email ID', email: response.emailId});
    } else {
      const todolist = new TodoList({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        emailId: req.body.emailId,
        password: req.body.password.toString(),
        todoItem: []
      });
      todolist
        .save()
        .then(result => {
          console.log(result);
          const token = genToken(result)
          res.status(200).json({token, message: 'Your are now registered.'})
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      
    }
  });
});


router.use("/auth-login", (req, res, next) => {
  TodoList.find({emailId: req.body.emailId}).then(response => {
    if (response && Array.isArray(response) && response.length !== 0) {
      console.log("Resp", response[0].password, req.body.password);
      if (response[0].password == req.body.password) {
        res.status(200).json({message: 'Authorized'});
      } else {
        res.status(401).json({message: 'Please check your password.'});
      }
      
    } else {
      res.status(401).json({message: 'Please check the email address you entered.'});
    }
  });
});

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

router.put("/update-todos", (req, res) => {
  TodoList.find({emailId: req.body.emailId}).then(response => {
    if (response && Array.isArray(response) && response.length !== 0) {
      const oldQuery = {todoItem: response[0].todoItem};
      const updateQuery = {$set: {emailId: req.body.emailId, todoItem: req.body.todoItem}}
      TodoList.updateOne(oldQuery, updateQuery).then(response => {
        res.status(200).json({message: 'Your Todo List just got updated'});
      }).catch(e => {
        res.status(400).json({message: 'Something went wrong. Action could not be performed'});
      })
      
    } else {
      res.status(400).json({message: 'Bad Request! User does not exist.'});
    }
  });
})

module.exports = router;

