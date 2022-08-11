import { createSlice, createSelector } from '@reduxjs/toolkit'

export const mqttSlice = createSlice({
  name: 'mqtt',
  initialState: {
    latestMsg: '',
    msgs: [],
    toEvent: [],
    fromEvent: [],
    connected: false,
  },
  reducers: {
    changeMsg: (state, action) => {
      let { dateTime, topic, message } = action.payload
      state.latestMsg = action.payload;
      state.msgs.push(action.payload);
      state.fromEvent = state.fromEvent.indexOf(topic) === -1 ? [...state.fromEvent, topic] : state.fromEvent;
    },
    clearMsg: (state) => {
      state.msgs = [];
      state.toEvent = [];
    },
    changeConnect: (state, action) => {
      state.connected = action.payload;
    }
  },
})

export const mqttSelector = createSelector((state) => state['mqtt'], (state) => state)

export const { changeMsg, clearMsg, changeConnect } = mqttSlice.actions

export default mqttSlice.reducer