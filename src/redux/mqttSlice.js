import { createSlice, createSelector } from '@reduxjs/toolkit'

export const mqttSlice = createSlice({
  name: 'mqtt',
  initialState: {
    latestMsg: '',
    msgs: [],
    toTopic: [],
    fromTopic: [],
    connected: false,
  },
  reducers: {
    changeMsg: (state, action) => {
      let { dateTime, topic, message } = action.payload
      state.latestMsg = action.payload;
      state.msgs.push(action.payload);
      state.fromTopic = state.fromTopic.indexOf(topic) === -1 ? [...state.fromTopic, topic] : state.fromTopic;
    },
    clearMsg: (state) => {
      state.msgs = [];
      state.toTopic = [];
    },
    changeConnect: (state, action) => {
      console.log('changeConnect', action.payload);
      state.connected = action.payload;
    }
  },
})

export const mqttSelector = createSelector((state) => state['mqtt'], (state) => state)

export const { changeMsg, clearMsg, changeConnect } = mqttSlice.actions

export default mqttSlice.reducer