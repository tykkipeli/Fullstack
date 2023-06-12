import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    returnedBlog.user = {
      name: user.name,
      username: user.username,
      id: user.id
    }
    setBlogs(blogs.concat(returnedBlog))
    setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const updateBlog = async (id, updatedBlog) => {
    const returnedBlog = await blogService.update(id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)

    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      setNotification(`Deleted ${blog.title} by ${blog.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`Welcome ${user.name}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('wrong username/password')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    // Clear user data from local storage
    window.localStorage.removeItem('loggedBlogAppUser')

    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      )}
    </div>
  )
}

export default App
