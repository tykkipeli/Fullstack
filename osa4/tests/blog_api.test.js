const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog');
const User = require('../models/user');


describe('when there are initially some blogs saved', () => {
  let token = null;

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
  
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User'
    };
  
    await api.post('/api/users').send(newUser);
    
    const loggedInUser = await api.post('/api/login').send(newUser);
    token = loggedInUser.body.token;

    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.id;

    const user = await User.findById(userId);

    const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }));
    const promiseArray = blogObjects.map(blog => blog.save());
    const blogs = await Promise.all(promiseArray);
  
    user.blogs = blogs.map(blog => blog._id);
    await user.save();
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs have id field defined', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`);
    const blogs = response.body;
  
    for (let blog of blogs) {
      expect(blog.id).toBeDefined();
    }
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 0
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`);
    const titles = response.body.map(r => r.title);
  
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain('New Blog');
  });

  test('a blog cannot be added without a token', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 0
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });

  test('likes property defaults to zero if missing', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'http://test.com',
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body.likes).toBe(0);
  });
  
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
  
  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Test Title',
      author: 'Test Author',
      likes: 5,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  
    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    let blogToUpdate = blogsAtStart[0];
    blogToUpdate.likes = blogToUpdate.likes + 1;
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .set('Authorization', `bearer ${token}`)
      .expect(200);
  
    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id);
  
    expect(updatedBlog.likes).toBe(blogToUpdate.likes);
  });

})
