const mongoose = require('mongoose');

const todoListSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    emailId: String,
    password: Number,
    todoItem: []
});

module.exports = mongoose.model('todolist', todoListSchema);