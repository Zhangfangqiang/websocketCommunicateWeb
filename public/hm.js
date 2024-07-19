window.hmSend

window.addEventListener('message', function (event) {
  if (event.data === '__init_port__') {
    if (event.ports[0] !== null) {
      /*保存从应用侧发送过来的端口*/
      window.hmSend = event.ports[0];

      /*这里可以调整一下*/
      window.hmSend.onmessage = function (event) {
        // 2. 接收ets侧发送过来的消息。
        var msg = 'Got message from ets:';
        var result = event.data;
        msg = msg + result;
        output.innerHTML = msg;
      }
    }
  }
})

// 3. 使用h5Port向应用侧发送消息。
function PostMsgToEts(data) {
  if (h5Port) {
    h5Port.postMessage(data);
  } else {
    console.error('h5Port is null, Please initialize first');
  }
}
