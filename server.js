const path = require('path');
const express = require('express');
const routes = require('./controllers');
const app = express();
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { MongoClient, ServerApiVersion } = require('mongodb');
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'Toras408!', // Replace with your secret key
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 3001;
const hbs = exphbs.create({});
// handle bars engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));
// turn on routes
app.use(routes);
// route for mongoose user model
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// route using the Mongoose Post model
app.post('/api/posts', async (req, res) => {
  try {
    const { title, post_url, user_id } = req.body;

    // Check if the user_id exists
    const userExists = await User.exists({ _id: user_id });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPost = new Post({
      title,
      post_url,
      user_id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//  route using the Mongoose Comment model
app.post('/api/comments', async (req, res) => {
  try {
    const { comment_text, user_id } = req.body;

    // Check if the user_id exists
    const userExists = await User.exists({ _id: user_id });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newComment = new Comment({
      comment_text,
      user: user_id,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Sample route to retrieve a post with associated user and comments
app.get('/api/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID and populate user and comments
    const post = await Post.findById(postId)
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
      });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// turn on connection to db and server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});