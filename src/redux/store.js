import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import mqttReducer from './mqttSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    mqtt: mqttReducer,
  },
})

export default store