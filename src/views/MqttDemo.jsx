import { Button, Checkbox, Radio } from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import * as echarts from 'echarts';

import { useDispatch, useSelector } from 'react-redux';
import { counterSelector, decrement, increment, incrementByAmount } from '../redux/counterSlice';

import { clearMsg, mqttSelector } from '../redux/mqttSlice';
import store from '../redux/store';

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
      scrollBehavior: "smooth",
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

let onMsg = ({ zr, from, to }) => {
  console.log("onMsg", from, to)
  let circle = new echarts.graphic.Circle({
    position: [from[0], from[1]],
    scale: [1, 1],
    shape: {
      cx: 0,
      cy: 0,
      r: 2
    },
    style: {
      fill: '#00ff00'
    },
    zlevel: 3
  });
  let circle2 = new echarts.graphic.Circle({
    position: [to[0], to[1]],
    scale: [1, 1],
    shape: {
      cx: 0,
      cy: 0,
      r: 0
    },
    style: {
      fill: 'none',
      stroke: '#00ff00',
      opacity: 1,
    },
    zlevel: 3
  });
  circle.animate('', false)
    .when(1000, {
      position: [to[0], to[1]],
    })
    .start()
    .done(function () {
      zr.remove(circle);
      circle2.animateTo({
        shape: {
          cx: 0,
          cy: 0,
          r: 50
        },
        style: {
          fill: 'none',
          stroke: '#00ff00',
          opacity: 0,
        },
      }, 1000, 'cubicOut')
    })
  zr.add(circle2);
  zr.add(circle);
}

const MqttChart = ({ fromTopic, msgs, style }) => {
  const [chart, setChart] = useState(null);
const [xys, setXys] = useState([]);
  console.log("MqttChart", fromTopic, msgs)
  if(xys.length>0){
    let zr = chart.getZr();
    console.log(xys)
    onMsg({ zr, from: xys[1], to: xys[0] })
  }


  useEffect(() => {
    if (!chart) {
      let myChart = echarts.init(document.getElementById('main'));
      setChart(myChart);
    } else {
      let zr = chart.getZr();
      // zr.configLayer(3, {
      //   motionBlur: true,
      //   lastFrameAlpha: 0.9,
      // });
      const r = (e) => {
        chart.setOption({
          graphic: echarts.util.map(Object.values(chart._chartsMap)[0].group._children[0]._children, function (dataItem, dataIndex) {
            console.log(dataItem)
            let xy = chart.convertToPixel({ seriesId: 0 }, [dataItem.x, dataItem.y]);
            return {
              // 'circle' 表示这个 graphic element 的类型是圆点。
              type: 'circle',

              shape: {
                // 圆点的半径。
                r: dataItem.transform[0] * dataItem._sizeX * 2
              },
              // 用 transform 的方式对圆点进行定位。position: [x, y] 表示将圆点平移到 [x, y] 位置。
              // 这里使用了 convertToPixel 这个 API 来得到每个圆点的位置，下面介绍。
              // position: chart.convertToPixel({ seriesId: dataItem.id }, [dataItem.x, dataItem.y]),
              // position: chart.convertToPixel('grid', dataItem),
              // position: [dataItem.x, dataItem.y],
              x: xy[0],
              y: xy[1],

              // 这个属性让圆点不可见（但是不影响他响应鼠标事件）。
              invisible: false,
              // 这个属性让圆点可以被拖拽。
              draggable: false,
              // 把 z 值设得比较大，表示这个圆点在最上方，能覆盖住已有的折线图的圆点。
              z: -100,
              // 此圆点的拖拽的响应事件，在拖拽过程中会不断被触发。下面介绍详情。
              // 这里使用了 echarts.util.curry 这个帮助方法，意思是生成一个与 onPointDragging
              // 功能一样的新的函数，只不过第一个参数永远为此时传入的 dataIndex 的值。
              // ondrag: echarts.util.curry(onPointDragging, dataIndex)
            };
          }),
        });
      }
      // chart.on('datazoom', r);
      // chart.on('graphroam', r);
      // chart.on('finished', r);
      // chart.on('legendscroll', r);



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
            id: 0,
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
            draggable: false,
            data: data.map((e, i) => {
              e.select = {
                label: {
                  show: true
                }
              }
              return e;
            }),
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
      option && chart.setOption(option);

      let a = () => {
        setXys(echarts.util.map(Object.values(chart._chartsMap)[0].group._children[0]._children, function (dataItem, dataIndex) {
          let xy = chart.convertToPixel({ seriesId: 0 }, [dataItem.x, dataItem.y]);
          return xy;
        }))
      }
      chart.on('graphroam', a);
      a()
      // onMsg({
      //   zr,
      //   from:xys[1],
      //   to:xys[0],
      // })
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

  // useEffect(() => {
  //   let un = store.subscribe(() => {
  //     console.log("store.subscribe", store.getState())
  //   })
  //   return () => {
  //     un()
  //   }
  // });

  const mqttState = useSelector(mqttSelector, (a, b) => {
    return a.msgs.length === b.msgs.length;
  });
  const msgs = mqttState.msgs
  const fromTopic = mqttState.fromTopic


  const dispatch = useDispatch()
  return (
    <span style={{
      flex: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <span style={{
        alignSelf: 'flex-start',
      }}>
        <Radio.Group value={menu}>
          <Radio.Button value="msgBox" onClick={(e) => { setMenu(e.target.value) }}>消息</Radio.Button>
          <Radio.Button value="chart" onClick={(e) => { setMenu(e.target.value) }}>chart</Radio.Button>
        </Radio.Group>
      </span>
      {
        (() => {
          if (menu === 'msgBox') {
            return (
              <Fragment>
                <span style={{
                  display: 'inline-flex',
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
                <span style={{
                  flex: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: "auto",
                }}>
                  <MsgBox msgs={msgs.map((e, i) => {
                    let { dateTime, topic, message } = e;
                    return ['[' + dateTime + '] ' + topic, message].join(": ")
                  })} autoScroll={autoScroll} style={{
                    flex: 'auto',
                  }} />
                </span>
              </Fragment>
            )
          } else if (menu === 'chart') {
            return (
              <MqttChart fromTopic={fromTopic} msgs={mqttState.latestMsg} style={{
                flex: 'auto',
              }} />
            )
          }
          return (<span>未知</span>)
        })()
      }
    </span >
  );
}

export default MqttDemo;