const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Post, User, Comment } = require('../models');

router.get('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.find({
      user_id: req.session.user_id,
    })
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

    res.render('dashboard', { posts, loggedIn: true });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/edit/:id', withAuth, async (req, res) => {
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

    if (dbPostData) {
      const post = dbPostData.toObject();

      res.render('edit-post', {
        post,
        loggedIn: true,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



module.exports = router;