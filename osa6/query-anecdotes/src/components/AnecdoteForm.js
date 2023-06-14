import React, { useContext } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import anecdoteService from '../services/anecdotes'
import { NotificationContext } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useContext(NotificationContext)

  const mutation = useMutation(anecdoteService.create, {
    onSuccess: () => {
      dispatch({ type: 'SET_NOTIFICATION', notification: 'A new anecdote created!' })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
      queryClient.invalidateQueries('anecdotes')  
    },
    onError: () => {
      dispatch({ type: 'SET_NOTIFICATION', notification: 'too short anecdote, must have length 5 or more' })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    mutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
