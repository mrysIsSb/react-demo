import * as echarts from 'echarts';
import React, { useEffect, useState } from 'react';
import mqtt from '../js/mqtt.min.js';

const ms = [];
const MqttDemo = (props) => {
  const [client, setClient] = useState(null);
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    // var myChart = echarts.init(document.getElementById('main'));

    window.onresize = function () {
      myChart.resize();
    };

    console.log('mqtt', client);
    if (client) {
      client.subscribe("mqtt.hello");
      var i = 100;
      client.on('message', function (topic, message) {
        setMsgs([...msgs, [topic, message].join(": ")]);
        console.log('msgs', msgs);
        i--
        if (i < 0) {
          client.unsubscribe("mqtt.hello");
        }
      });
      client.publish("mqtt/demo", "hello world!")

    }
  }, [client]);//client 更新调用
  if (!client) {
    const options = {
      // Clean session
      clean: true,
      connectTimeout: 4000,
      // Auth
      clientId: 'access-token',
      username: 'emqx_test',
      password: 'emqx_test',
      accessToken: 'access-token12341234123412334312',
    }
    setClient(mqtt.connect('ws://localhost:8883/mqtt', options));
  }
  return (
    <span>
      <h1>
        hello mqtt
      </h1>
      {
        msgs.map((msg, index) => {
          return (
            <p key={index}>
              {msg}
            </p>
          )
        })
      }
      <div id='main' style={
        {
          width: "50vw",
          height: "80vh",
        }
      }>
      </div>
    </span>
  );
}

export default MqttDemo;