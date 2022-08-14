import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import mqttReducer,{mqttMsgReducer} from './mqttSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    mqtt: mqttReducer,
    mqttMsg: mqttMsgReducer,
  },
})

export default store