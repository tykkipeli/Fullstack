import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'


describe('<Blog />', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'https://testurl.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  const updateHandler = jest.fn()
  const deleteHandler = jest.fn()

  beforeEach(() => {
    render(
      <Blog blog={blog} updateBlog={updateHandler} deleteBlog={deleteHandler} user={blog.user} />
    )
  })

  test('renders content', () => {
    // component renders title and author, but not url and likes by default
    expect(screen.getByText(/test title/i)).toHaveTextContent('Test title')
    expect(screen.getByText(/test author/i)).toHaveTextContent('Test author')
    expect(screen.queryByText('https://testurl.com')).not.toBeInTheDocument()
    expect(screen.queryByText('likes 5')).not.toBeInTheDocument()
  })

  test('renders url, likes, and user details when view button is clicked', async () => {
    const viewButton = screen.getByText('view')
    await userEvent.click(viewButton)

    // Now, url, likes and user details are visible
    expect(screen.getByText('https://testurl.com')).toBeInTheDocument()
    expect(screen.getByText('likes 5')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const viewButton = screen.getByText('view')
    await userEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(updateHandler.mock.calls).toHaveLength(2)
  })
})

test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = jest.fn()

  render(
    <BlogForm createBlog={createBlog} />
  )

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')

  await userEvent.type(title, 'Test title')
  await userEvent.type(author, 'Test author')
  await userEvent.type(url, 'https://testurl.com')
  
  const submitButton = screen.getByRole('button', { name: /create/i });
  await userEvent.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test title',
    author: 'Test author',
    url: 'https://testurl.com',
  })
})

