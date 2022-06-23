### 1、如何实现浏览器多 tab 通信

#### sharedWorker

sharedWorker就是webWorker中的一种，它可以由所有同源页面共享，利用这个特性，我们就可以使用它来进行多标签页之前的通信。


```typescript
// worker.js
const set = new Set()
onconnect = event => {
  const port = event.ports[0]
  set.add(port)

  // 接收信息
  port.onmessage = e => {
    // 广播信息
    set.forEach(p => {
      p.postMessage(e.data)
    })
  }

  // 发送信息
  port.postMessage("worker广播信息")
}
```

```typescript
  const worker = new SharedWorker('./worker.js')
  worker.port.onmessage = e => {
    console.info("pageA收到消息: ", e.data)
  }
```

```typescript
  const worker = new SharedWorker('./worker.js')
  let btnB = document.getElementById("btnB");
  btnB.addEventListener("click", () => {
    worker.port.postMessage(`客户端B发送的消息`)
  })
```

#### localStorage

localStorage 特点

- 同域下共享存储空间
- 存储是持久化的
- 提供事件监听内容变化

```html
// pageA.html
<body>
<h1>pageA</h1>
</body>
<script>
    window.addEventListener("storage", (e) => {
        console.info("localStorage发生变化：", e)
    })
</script>
```

```html
// pageB.html
<body>
<h1>pageB</h1>
<button id="btn">添加数据到localStorage</button>
</body>
<script>
    let btnB = document.getElementById("btnB");
    btnB.addEventListener("click", () => {
        localStorage.setItem("num", 'test')
    })
</script>

```

同域的两个页面，如果共享的 localStorage 发生变化，将通过事件监听接收到变化。

#### websocket

特点： 1、保持连接。（websocket 是建立在 tcp 之上的升级版通信协议） 2、全双工通信。 3、没有同源策略限制。

```typescript
// server.js
const WebSocketServer = require('ws').Server;
const ws = new WebSocketServer({port: 8000});

const clients = [];

ws.on('connection', function (client) {
  if (clients.indexOf(client) === -1) {
    clients.push(client);
    client.on('message', function (msg) {
      for (const c of clients) {
        if (c !== client) {
          client.send(msg.toString());
        }
      }
    })
  }
})
```

```typescript
// pageA.html
const ws = new WebSocket('ws://localhost:8000');
ws.onopen = function () {
};
ws.onmessage = function (e) {
  console.log(e.data)
}
```

```typescript
// pageB.html
const ws = new WebSocket('ws://localhost:8000');
ws.onopen = function () {
};
ws.onmessage = function (e) {
  console.log(e.data);
}
ws.send('pageb send a message');
```

要在服务端开启一个 ws 服务。


#### cookie + setInterval

> 原理：cookie 同域共享，我们可以在一个页面设置cookie，另一个页面通过定时器不断获取 cookie，来刷新b页面的信息。（性能不好，不建议使用）

```html
// A
<script>
    setInterval(() => {
        //加入定时器，让函数每一秒就调用一次，实现页面刷新
        console.log("cookie", document.cookie)
    }, 1000);
</script>
```

```html
// B
<script>
    let btnB = document.getElementById("btnB");
    let num = 0;
    btnB.addEventListener("click", () => {
        document.cookie = `客户端B发送的消息:${num++}`
    })
</script>

```

### defer 和 async 
![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220623154901.png)


- defer 和 async 都是 相较于HTML解析 异步加载的
- defer 按照脚本加载顺序在 HTML 解析完成之后 执行
- async 异步加载完成之后就执行，不考虑顺序，所以对于有依赖的脚本要注意不能使用 async 
