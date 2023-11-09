const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Middleware to parse request body
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define Schemas
const UserSchema = new mongoose.Schema({
  name: String,
});

const PostSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

// Define Models
const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// Routes
app.post('/api/posts', async (req, res) => {
  try {
    // Here we would normally look up the user, but since this is a dummy app,
    // we'll create a new user every time a post is made.
    const user = new User({ name: req.body.name });
    await user.save();

    const post = new Post({
      text: req.body.text,
      userId: user._id
    });
    await post.save();

    res.status(201).json({
      id: post._id,
      text: post.text,
      createdAt: post.createdAt,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name').exec();
    const response = posts.map(post => ({
      post: {
        id: post._id,
        text: post.text,
        createdAt: post.createdAt,
        userId: post.userId._id
      },
      user: {
        id: post.userId._id,
        name: post.userId.name
      }
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app; // for testing
