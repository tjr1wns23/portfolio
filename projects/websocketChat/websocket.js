const express = require("express")
const app = express()
const { WebSocketServer } = require("ws")

app.use(express.static("public"))

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})

// 웹소켓 서버 생성
const wss = new WebSocketServer({ port: 8001, clientTracking: true })

// 웹소켓 서버 연결 이벤트 바인드
wss.on("connection", (ws, request) => {

  wss.clients.forEach(client => {
    const msg = JSON.stringify({ type: "notice", content: "새로운 유저가 접속했습니다. 현재 유저 " + wss.clients.size + "명" });
    client.send(msg);
  })

  ws.on("close", () => {
    wss.clients.forEach((client) => {
      const msg = JSON.stringify({ type: "notice", content: `유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명` });
      client.send(msg);
    });
  })

  ws.on("message", data => {
    wss.clients.forEach(client => {
      const msg = JSON.stringify({ type: "msg", content: data.toString() });
      client.send(msg);
    })
  })
})

app.get('/', function (req, res) {
  res.send("Hello World...!");
})