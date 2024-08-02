const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:443');

socket.onopen = () => {
  console.log('Connected to server');
  setInterval(() => {
    socket.send('Hello from client');
  }, 800)
};

socket.onmessage = (event) => {
  console.log('Message from server', event.data);
};
