import store from '@/redux/store';
import { changeMsg, changeConnect,receivedMsg } from '../redux/mqttSlice';
import mqtt from './mqtt.min.js';

let client = null;

export const connect = (url, options) => {
  if (!client) {
    client = mqtt.connect(url, options);

    client.on('message', (topic, message) => {
      let msg={
        dateTime: new Date().toLocaleString(),
        topic, message: message.toString(),
      }
      store.dispatch(changeMsg(msg));
      // store.dispatch(receivedMsg(msg));
    });
    client.on('connect', () => {
      dispatchChangeConnect(true);
    });
    client.on('close', () => {
      dispatchChangeConnect(false);
    });
  }
  return client;
};

export const subscribe = (topic, options) => {
  if (client) {
    client.subscribe(topic, options);
  }
}

export const unsubscribe = (topic, options) => {
  if (client) {
    client.unsubscribe(topic, options);
  }
}

export const publish = (topic, message, options) => {
  if (client) {
    client.publish(topic, message, options);
  }
}

export const end = () => {
  if (client) {
    client.end(() => {
      client = null;
      dispatchChangeConnect(false);
    });
  }
}

const dispatchChangeConnect = (connected) => {
  store.dispatch(changeConnect(connected));
}

export default {
  connect,
  subscribe,
  unsubscribe,
  publish,
  end
}