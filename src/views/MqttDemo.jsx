import { Button, Checkbox, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

import { useDispatch, useSelector } from 'react-redux';
import { counterSelector, decrement, increment, incrementByAmount } from '../redux/counterSlice';

import { clearMsg, mqttSelector } from '../redux/mqttSlice';


const MsgBox = ({ msgs, autoScroll, style }) => {
  useEffect(() => {
    if (autoScroll) {
      let dom = document.getElementById('msgBox');
      dom.scrollTop = dom.scrollHeight;
    }
  })
  return (
    <div id='msgBox' style={{
      ...style,
      width: "100%",
      overflow: "auto",
      border: "1px solid #cc1",
      backgroundColor: "darkgrey",
    }}>
      {
        msgs.map((msg, index) => {
          return (
            <span key={index}>
              <br />
              {msg}
            </span>
          )
        })
      }
    </div>
  )
}

const MqttChart = ({ fromTopic, msgs, style }) => {
  const [chart, setChart] = useState(null);
  useEffect(() => {
    if (!chart) {
      let myChart = echarts.init(document.getElementById('main'));
      setChart(myChart);
    } else {
      const data = [
        {
          // fixed: true,
          x: chart.getWidth() / 2,
          y: chart.getHeight() / 2,
          symbolSize: 80,
          id: 'MqttClient',
          name: 'MqttClient',
          category: 0
        }
      ];
      const legendData = ['client', 'topic', 'msg'];
      const edges = [];
      if (fromTopic) {
        fromTopic.forEach(e => {
          data.push({
            symbolSize: 40,
            id: e,
            name: e,
            category: 1
          });
          edges.push({
            source: e,
            target: 'MqttClient'
          });
        });
      }
      /*       if (msgs) {
              msgs.forEach(e => {
                data.push({
                  symbolSize: 40,
                  id: e,
                  name: e,
                  category: 2
                });
                msgs.push({
                  source: e,
                  target: 'MqttClient'
                });
              });
            } */
      let option = {
        title: {
          show: true,
          text: 'mqtt关系图',
        },
        legend: {
          show: true,
          data: legendData,
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            label: {
              show: true,
              // position: 'right',
              formatter: '{b}'
            },
            edgeLabel: {
              fontSize: 12
            },
            roam: true,
            animation: false,
            draggable: true,
            data: data,
            categories: legendData.map(e => ({ name: e })),
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 6],
            force: {
              initLayout: 'circular',
              // gravity: 0,
              repulsion: 8,
              edgeLength: 500
            },
            edges: edges
          }
        ]
      };
      console.log(option);
      option && chart.setOption(option);

      return () => {
        if (!chart.isDisposed()) {
          chart.dispose();
        }
        setChart(null);
      };
    }
  }, [chart]);

  return (
    <span style={{
      ...style,
    }}>
      <div id='main' style={{ width: "100%", height: "100%", }}></div>
    </span>
  )
}

const MqttDemo = (props) => {
  const [client, setClient] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [menu, setMenu] = useState('msgBox');
  // const [msgs, setMsgs] = useState([]);
  //redux

  /*   function handleChange() {
      console.log("handleChange", store.getState())
    }
  
    const unsubscribe = store.subscribe(handleChange) */


  // const count = useSelector((state) => {
  //   console.log(state);
  //   return state.counter.value
  // })

  const count = useSelector(counterSelector)
  // const count = useSelector((state) => state, (a, b) => {
  //   console.log(a, b);
  //   return true;
  // })

  const mqttState = useSelector(mqttSelector);
  const msgs = mqttState.msgs
  const fromTopic = mqttState.fromTopic


  const dispatch = useDispatch()
  // dispatch(onChange(e => console.log(e)))
  return (
    <span style={{
      flex: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Radio.Group value={menu}>
        <Radio.Button value="msgBox" onClick={(e) => { setMenu(e.target.value) }}>消息</Radio.Button>
        <Radio.Button value="chart" onClick={(e) => { setMenu(e.target.value) }}>chart</Radio.Button>
      </Radio.Group>
      {
        (() => {
          if (menu === 'msgBox') {
            return (
              <span style={{
                flex: 'auto',
                display: 'flex',
                flexDirection: 'column',
                overflow: "auto",
              }}>
                <span style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Button onClick={() => dispatch(clearMsg())}> 清空 </Button>
                  <Checkbox checked={autoScroll} onChange={(e) => {
                    setAutoScroll(e.target.checked);
                  }} style={{
                  }}>自动滚动</Checkbox>
                </span>
                <MsgBox msgs={msgs.map((e, i) => {
                  let { dateTime, topic, message } = e;
                  return ['[' + dateTime + '] ' + topic, message].join(": ")
                })} autoScroll={autoScroll} style={{
                  flex: 'auto',
                }} />
              </span>
            )
          } else if (menu === 'chart') {
            return (
              <MqttChart fromTopic={fromTopic} msgs={msgs.map((e, i) => e.message)} style={{
                flex: 'auto',
              }} />
            )
          }
          return (<span>未知</span>)
        })()
      }
      {/* </div> */}


    </span >
  );
}

export default MqttDemo;