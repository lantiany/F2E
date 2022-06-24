

### link 和 @import 的区别是什么？

1. link 是 html 标签， @import 是 css 提供的语法。 
2. link 会在页面加载的时候同时加载，@import 引入的样式需要等页面加载完成之后加载。 
3. link 可以通过 script 加载替换样式文件（DOM操作），@import 不行。 
4. link 除了能引入 css（stylesheet） 之外，rel 属性支持另外十多个（但是很少见）

### 简述你对BFC规范的理解。

> BFC: Block Formatting Context 块级格式化上下文。
页面上与其他上下文隔离的一个盒子区域，容器内部的元素不会影响外部的元素。

创建一个 BFC 的方式有很多种

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220530162110.png)


特征：
- 内部的块级元素会在垂直方向上逐个排列；
- 同一个 BFC 中的元素，外边距会发生重叠；
- 每个元素默认都是靠左排列；
- BFC 的高度会计算内部浮动子元素的高度（清除浮动）；

作用：
- 解决父元素高度塌陷
- 解决外边距重叠


### animation transform transition 的区别

