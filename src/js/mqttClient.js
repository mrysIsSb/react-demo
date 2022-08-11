import store from '@/redux/store';
import { changeMsg,changeConnect } from '../redux/mqttSlice';
import mqtt from './mqtt.min.js';

let client = null;

export const connect = (url, options) => {
  if (!client) {
    try {
      client = mqtt.connect(url, options);
      changeConnect(true);
    } catch (e) {
      changeConnect(false);
    }
    client.on('message', (topic, message) => {
      store.dispatch(changeMsg({
        dateTime: new Date().toLocaleString(),
        topic, message: message.toString(),
      }));
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
      changeConnect(false);
    });
  }
}

export default {
  connect,
  subscribe,
  unsubscribe,
  publish,
  end
}