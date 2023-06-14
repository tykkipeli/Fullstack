import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

export const initializeAnecdotes = createAsyncThunk(
  'anecdotes/initializeAnecdotes',
  async () => {
    const anecdotes = await anecdoteService.getAll()
    return anecdotes
  }
)

export const addAnecdote = createAsyncThunk(
  'anecdotes/addAnecdote',
  async (content) => {
    const newAnecdote = { content, votes: 0 }
    const addedAnecdote = await anecdoteService.create(newAnecdote)
    return addedAnecdote
  }
)

export const voteAnecdote = createAsyncThunk(
  'anecdotes/voteAnecdote',
  async (id) => {
    let anecdote = await anecdoteService.get(id)
    anecdote = {...anecdote, votes: anecdote.votes + 1}
    const updatedAnecdote = await anecdoteService.update(id, anecdote)
    return updatedAnecdote.id
  }
)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeAnecdotes.fulfilled, (state, action) => {
      return action.payload
    })
    builder.addCase(addAnecdote.fulfilled, (state, action) => {
      state.push(action.payload)
    })
    builder.addCase(voteAnecdote.fulfilled, (state, action) => {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes++
      }
    })
  }
})

export default anecdoteSlice.reducer