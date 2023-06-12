import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog.id)
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blogDefaultView">
        {blog.title} {blog.author} <button id="view-button" onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blogDetailedView">
          <div>{blog.url}</div>
          <br />
          likes {blog.likes} <button id="like-button" onClick={likeBlog}>like</button>
          <br />
          <div>{blog.user.name}</div>
          {blog.user.username === user.username &&
            <button id="delete-button" onClick={handleDelete}>delete</button>
          }
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
