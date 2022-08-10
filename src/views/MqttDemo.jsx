import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import mqtt from '../js/mqtt.min.js';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from '../redux/counterSlice'
import store from '@/redux/store';
let ms = [];

const MsgBox = ({ msgs }) => {
  return msgs.map((msg, index) => {
    return (
      <div key={index}>
        {msg}
      </div>
    )
  });
}

const MqttDemo = (props) => {
  const [client, setClient] = useState(null);
  const [msgs, setMsgs] = useState([]);

  //redux

  function handleChange() {
    console.log("handleChange", store.getState())
  }

  const unsubscribe = store.subscribe(handleChange)


  const count = useSelector((state) => {
    console.log(state);
    return state.counter.value
  })
  const dispatch = useDispatch()
  // dispatch(onChange(e => console.log(e)))


  useEffect(() => () => unsubscribe())
  // console.log('MqttDemo');
  useEffect(() => {
    return () => {
      ms = msgs;
    }
  }, [msgs]);
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
        setMsgs(msgs => [...msgs, [topic, message].join(": ")]);
        // msgs = [...msgs, [topic, message].join(": ")];
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
    // setClient(mqtt.connect('ws://localhost:8883/mqtt', options));
  }
  return (
    <span>
      <h1>
        hello mqtt
      </h1>
      <h1>{count}</h1>
      <Button onClick={() => dispatch(increment())}>+1</Button>
      <Button onClick={() => dispatch(incrementByAmount(100))}>+100</Button>
      <Button onClick={() => dispatch(decrement())}>-1</Button>
      <Button onClick={() => setMsgs(e => [...e, "hello"])} > 消息 </Button>
      <MsgBox msgs={msgs} />
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