import React, { useContext } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdoteService from './services/anecdotes'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { NotificationContext } from './contexts/NotificationContext'

const App = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useContext(NotificationContext)

  const { status, data: anecdotes, error } = useQuery('anecdotes', anecdoteService.getAll, {
    retry: false
  })

  const mutation = useMutation(anecdoteService.vote, {
    onSuccess: () => {
      dispatch({ type: 'SET_NOTIFICATION', notification: 'Anecdote voted!' })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
      queryClient.invalidateQueries('anecdotes') 
    },
  })

  const handleVote = (anecdote) => {
    mutation.mutate(anecdote)
    console.log('vote', anecdote)
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
    return <div>Error fetching data: {error.message}</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
