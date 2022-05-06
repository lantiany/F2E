
# CSS 加载会导致阻塞吗？

## CSS 加载会阻塞 DOM 解析吗？

CSS 加载不会阻塞 DOM 解析，但是会阻塞 DOM 渲染。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>css阻塞DOM</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      h1 {
        color: red !important
      }
    </style>
    <script>
      function h () {
        console.log(document.querySelectorAll('h1'))
      }
      setTimeout(h, 0)
    </script>
    <link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
  </head>
  <body>
    <h1>这是红色的</h1>
  </body>
</html>
```

在这段代码示例中，当 CSS 文件加载完成之后，h1 才显示出来；但是 js 同步执行，输出了 h1 节点（js没有被阻塞，因为代码位置在加载 css 之前）。


> 在渲染过程中，DOM 的解析会生成 DOM 树，解析 CSS 文件生成 CSS 规则树，然后将这两棵树合成渲染树进行渲染。
>
> 如果不阻塞 DOM 渲染，会导致页面渲染完成之后，加载过来的 CSS 样式又去修改 DOM 节点，造成浏览器重绘和回流。导致性能浪费。



## css加载会阻塞js运行吗？

会。位于 CSS 加载语句后面的 js 代码，会等待 CSS 加载完成后才执行。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>css阻塞js</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
      console.log('before css')
      var startDate = new Date()
    </script>
      
    <link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
  </head>
  <body>
    <h1>这是红色的</h1>
    <script>
      var endDate = new Date()
      console.log('after css')
      console.log('经过了' + (endDate -startDate) + 'ms')
    </script>
  </body>
</html>
```

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220506105224.png)
从图中可以看到，加载 CSS 文件花费 150ms，加载完毕之后，立即执行 JS 代码。css 的解析不会阻塞 JS 运行。
这里的时间有比较细微的误差，但是与整个css的加载时间相近。


## 浏览器渲染过程

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220506105138.png)


浏览器渲染的流程如下：

1. HTML解析文件，生成DOM Tree，解析CSS文件生成CSSOM Tree
2. 将DOM Tree和CSSOM Tree结合，生成Render Tree(渲染树)
3. 根据 Render Tree 渲染绘制，将像素渲染到屏幕上。

更深入一点：

1. DOM解析和CSS解析是两个并行的进程，所以这也解释了为什么CSS加载不会阻塞DOM的解析。
2. 然而，由于Render Tree是依赖于DOM Tree和CSSOM Tree的，所以必须等待CSSOM Tree构建完成，也就是CSS资源加载完成(或者CSS资源加载失败)后，才能开始渲染。因此，CSS加载是会阻塞DOM的渲染的。
3. 由于js可能会操作之前的DOM节点和css样式，因此浏览器会**维持html中css和js的顺序**。因此，样式表会在后面的js执行前先加载执行完毕。所以css会阻塞后面js的执行。


以上。


[原文地址：css加载会造成阻塞吗](https://segmentfault.com/a/1190000018130499)

这里对原文后文 DOMContentLoaded 用例实测之后发现，与文中描述不符。
DOMContentLoaded 会等到 css 加载完毕之后触发，具体原因不明。


这个坑后面来填。
