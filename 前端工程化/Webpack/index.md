# 构建流程优化


## loader

loader 本质上是导出为函数的 JavaScript 模块。在合适的时间，loader runner 会调用这个函数，将上一个 loader 返回的资源传递给这个函数。


### thread-loader

打包比较费时间的文件可以添加 thread-loader 开启多进程打包，如 js。

背后是不同的 worker 在运行打包逻辑。每一个 worker 是独立的 nodejs 进程，这些 worker 运行在 worker 池中。
创建 worker 会有 600ms 左右的时间开销。

worker 有如下限制：

- 不能生成新的文件
- 不能使用自定义的 loader API
- 无法获取 webpack 的配置

[webpack - thread-loader](https://webpack.docschina.org/loaders/thread-loader/)

```typescript
rules = [
  {
    test: /\.js$/,
    use: ['thread-loader', 'babel-loader']
  }
]
```


### cache-loader

将构建过的资源缓存起来，提高二次构建的速度。
```typescript
rules = [
  {
    test: /\.js$/,
    use: ['cache-loader', 'thread-loader', 'babel-loader']
  }
]
```

正常的 loader 的执行顺序是从右向左的，但是 thread-loader 和 cache-loader 会有一个 pitch 方法，
这个方法会在 loader 函数执行前执行，如果存在多个 loader 串行的情况，这些 loader 的 pitch 函数会从左到右依次执行



### 热更新

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220630110340.png)
