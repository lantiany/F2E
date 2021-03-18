# 从 Doctype 说起
放在 html 文件的第一行

`<!DOCTYPE html>` 目前能见到的一般都是这个样子的。这行代码告诉浏览器以何种模式解析 html 文档。

可以使用 `document.compatMode` 查看当前渲染模式。

  - CSS1Compat `<!DOCTYPE html>` 标准模式渲染页面
  - BackCompat 浏览器使用自己的怪异模式渲染页面

渲染模式有：标准模式、怪异模式、近乎标准模式。

近乎标准模式存在于 IE8 中，它介于两者之间，更不好操控。所以加上 `<!DOCTYPE html>` 是最正确的选择。

# HTML、XHTML、XML 都是什么？

HTML: Hyper Text Markup Language, 就是我们天天打交道的html。

XHTML: eXtensible Hyper Text Markup Language, 可扩展的超文本标记语言，表现于 HTML 类似，语法更为严格。为解决 html 混乱而生，html5 就是在此基础上诞生。

XML: 是一种数据存储格式，但是现在已经被 json 取代。因为 json 更轻量更高效。

# 对 HTML 语义化的理解？

语义化指的是恰当的使用 html 标签。让 html 页面具有良好的结构和含义。p 里面就是段落，button 就是一个按钮。

语义化的好处：
   - 对开发友好：代码结构清晰，语义化标签具有高度的可读性，便于开发维护
   - 对SEO友好：便于搜索引擎获取有效的信息。

# 有哪些常用的行内元素，块级元素？
- 行内元素：a、span、input、img、sup、sub、textarea、i、u、del、em、strong、section、select
- 块级元素：div、p、h1-6、ul、ol、dl、form、hr、center、address

# meta 标签的作用 ？

meta 标签用来描述网页的一些属性。字符集、网页描述、关键字、页面刷新等。开发者也可以自定义一些属性。

`<meta charset="UTF-8" />`

`＜meta http-equiv="expires" content="Fir, 16 Sep 2019 14:13:00 GMT" /＞`

`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">`

`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`

# HTML Tag 上的 data-xxx 有什么作用 ？

在动态渲染的时候，通过 `data-xxx` 可以让 html 标签携带更多的信息。不管是自定义的还是后端获取的。可以通过 `dom.getAttribute('data-xxx')` 来获取这些信息。

但是需要注意的是，`data-xxx-yyy` 的读取方式是： `dom.xxxYyy`。这个属性在微信小程序里面也是适用的，且用的比较多。反观 PC 端，由于各大框架的流行，这个属性基本上已经不使用了。

# html5 有哪些新特性 ？

   这里只简单介绍，不做细致说明。

1. 语义化标签

   header、aside、article、audio、canvas、footer、nav、vedio等。这里只列举了一些常用的。
   详情可以查看[w3c-school](https://www.w3school.com.cn/tags/index.asp)。html5的标签都有特殊标记。

2. 表单类型增强
 
   `<input type="xxx"/>`
   |类型|描述|
   |:-:|:-:|
   |color|颜色选择器|
   |date|日期选择器|
   |email|输入电子邮件|
   |number|输入只能是数字（e）|
   |search|搜索|
   |url|一个资源定位地址|
   |...|...|
   虽然提供了这么多类型，但是遗憾的是，兼容性并不好。

3. 音视频
  ```html
    <audio controls>
      <source src="horse.ogg" type="audio/ogg">
      <source src="horse.mp3" type="audio/mpeg">
      您的浏览器不支持音频元素。
    </audio>
  ```
  ```html
    <video width="320" height="240" controls>
      <source src="movie.mp4" type="video/mp4">
      <source src="movie.ogg" type="video/ogg">
      您的浏览器不支持Video标签。
  </video>
  ```

  controls 可以通过音视频相关的 API 自定义。因为原生的真的很丑。
    type 属性可以指定文件的类型，浏览器会使用第一个可识别的属性

4. canvas & svg

   这两者都可以画出一些绚丽多彩的图形。区别是 canvas 是一块画布，所有的操作都是在这块画布之中进行。而 svg 是基于 XML 的，通过在标签中设置属性，绘制出对应的图像。

5. 地理位置

   Geolocation 用户获取用户定位。Geolocation 存在于 navigator 下，提供了若干 API。

6. 编辑、拖拽属性

   在 HTML5 中，编辑和拖拽也是标准的一部分。
  当设置某个元素 dragable 和 editable 之后，这个元素就可以进行拖拽和编辑了。

7. web Worker
   
   这是让 javascript 摆脱单线程的方法，可以创建多个 web worker 来执行一些复杂的尤其是计算任务等。每一个 worker 都是一个新的线程，且这样线程无法操作 dom， 在其执行环境中，也没有window(浏览器)、global(node)等全局环境，它就是一个单纯的 js 执行环境，worker 线程与 js 主线程之间只能通过其对应的事件机制传递消息。

8. web 存储

   localStorage: 本地存储，会永久存储进计算机磁盘里面。

   sessionStorage: 会话存储，针对一个浏览器窗口的存储机制，当用户关闭这个 tab 之后，存储就丢失。
9. web Socket

   WebSocket 是HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。在 WebSocket API中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。当你获取 Web Socket 连接后，你可以通过 send 方法来向服务器发送数据，并通过 onmessage 事件来接收服务器返回的数据。
