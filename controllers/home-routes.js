const router = require('express').Router();
const mongoose = require('mongoose');
const { Post, User, Comment } = require('../models');


router.get('/', async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');


    const dbPostData = await Post.find()
      .select('id post_url title created_at')
      .populate({
        path: 'comments',
        select: 'id comment_text post_id user_id created_at',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .populate('user', 'username');

    const posts = dbPostData.map(post => post.toObject());

    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    } else {
      res.render('login');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findById(req.params.id)
      .select('id post_url title created_at')
      .populate({
        path: 'comments',
        select: 'id comment_text post_id user_id created_at',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .populate('user', 'username');

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const post = dbPostData.toObject();

    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;