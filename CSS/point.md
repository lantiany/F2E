1. 如何让滚动条不占位。

```css
.el{
    overflow: overlay;
}
```

2. fixed 一定是相对于浏览器窗口定位的吗？

不是，当祖先元素的 `transform,perspective,filter` 属性非 none 的时候，相对于祖先元素进行定位。

3. 
