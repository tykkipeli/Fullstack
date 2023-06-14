import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import anecdoteReducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterReducer from './reducers/filterReducer'

const reducer = {
  anecdotes: anecdoteReducer,
  notification: notificationReducer,
  filter: filterReducer,
}

const store = configureStore({
  reducer,
  middleware: [thunk]
})

export default store
