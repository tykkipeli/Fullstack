const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  const user = request.user

  if (!title || !url) {
    return response.status(400).send({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id).populate('user');
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!blog.user || blog.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'only the creator of the blog can delete it' });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});



blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updatedBlog = {
    title,
    author,
    url,
    likes
  }

  const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true });
  response.json(blog.toJSON());
});

module.exports = blogsRouter;
