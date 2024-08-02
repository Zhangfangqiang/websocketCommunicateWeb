const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 443 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received message:', message);
    // 发送消息给所有连接的客户端
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('客户端关闭');
  });
});
