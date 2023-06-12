import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog} data-testid="form">
        <div>
          <label htmlFor="title">
            title:
            <input
              id="title"
              type="text"
              value={newTitle}
              name="Title"
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="author">
            author:
            <input
              id="author"
              type="text"
              value={newAuthor}
              name="Author"
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="url">
            url:
            <input
              id="url"
              type="text"
              value={newUrl}
              name="Url"
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </label>
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
