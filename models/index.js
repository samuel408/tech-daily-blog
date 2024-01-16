const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment")

// create associations
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  post_url: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const commentSchema = new mongoose.Schema({
  comment_text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema);

module.exports = { User, Post, Comment };
