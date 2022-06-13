## HTML

### 打包 HTML 要解决一下几个基本问题

- 个性化内容填充（例如页面标题，描述，关键词）
- 多余空格删除（连续多个空白字符的合并）
- 代码压缩（多余空白字符的合并）
- 去除注释

### 入口文件处理

#### 单页应用的 HTML

单页应用的处理很简单，使用 `html-webpack-plugin` 做好相关配置即可。
详细内容参见：[https://github.com/jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
```typescript
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Further Webpack',
      template: 'index.html',
      // 这里的参数可以通过模板引擎渲染到 html 中
      templateParameters: {
        item: '',
        description: 'Know about underlying principles',
      },
      // 对 html 做优化，minify: true 会默认开启一下配置。
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      // 这里写入的meta配置会被注入 html 模板中
      meta: {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#4285f4'
      }
    })
  ]
}
```
#### 多页应用的 HTML 处理

多页应用打包在 html 层面，主要考虑两个基本问题：
- 如何自动生成多个页面？
- 如果引用中存在公共的模块，怎样才能提取公共模块？

```typescript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'main',
      template: 'public/main.html',
      templateParameters: {},
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: 'about',
      template: 'public/about.html',
      templateParameters: {},
      chunks: ['about']
    }),
    new HtmlWebpackPlugin({
      title: 'list',
      template: 'public/list.html',
      templateParameters: {},
      chunks: ['list']
    })
  ]
}
```

如果嫌麻烦，也可以让代码帮忙：

```typescript
function genPagesPlugin(pages) {
    return pages.map(page => {
        return new HtmlWebpackPlugin({
            chunks: [page],
            template: `public/${page}.html`,
            ...{}
        })
    })
}

module.exports = {
  plugins: [
    ...genPagesPlugin(pages)
  ]
}
```

对于这类模块的打包，会存在一个比较明显的问题，重复的模块打包。
如果重复的模块比较大，那么用户加载的成本就变高了，这显然是不可接受的。
在 webpack4 之前使用 commonChunkPlugin， 升级 4 之后使用 optimization.splitChunks 和 optimization.runtimeChunk
来解决 chunk 拆分的问题。

commonChunkPlugin 存在的问题：

```text
entryA: Vue Vuex Components
entryB: Vue Axios Components
entryC: Vue Axios Vuex Components

vendor: Vue Vuex Axios
```

- 产出的 chunk 中，有重复的模块。
- 无法优化处理异步 chunk
- 高优的chunk产出需要的 minChunks 配置比较复杂。


optimization 是如何解决的：

```text
example：
entryA:  vue  vuex  someComponents
entryB：vue axios someComponents
entryC: vue vux axios someComponents

vendor-chunkA-C：vuex 
vendor-chunkB-C：axios
vendor-chunkA-B-C：vue
chunkA: only the components
chunkB: only the components
chunkC: only the components
```

在入口 chunk 和 异步chunk中发现了重复的模块，将这个模块抽离出来，打入 vendor-chunk 中。于是可能有多个 vendor-chunk。
在打包生成chunk的时候，对于这些模块也会有一定的限制：

- 新产出的vendor-chunk是要被共享的，或者模块来自npm包；
- 新产出的vendor-chunk的大小得大于30kb；
- 并行请求vendor-chunk的数量不能超出5个；
- 对于entry-chunk而言，并行加载的vendor-chunk不能超出3个。

[更多配置详见：https://webpack.docschina.org/plugins/split-chunks-plugin/](https://webpack.docschina.org/plugins/split-chunks-plugin/)
```typescript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "async",  // 也可指定为 all initial, all 支持模块在同步和异步模块之间共享。
      minSize: 30000,   // 生成chunk的最小体积（太小了没必要）
      minChunks: 1,     // 模块拆分的最小共享模块数
      maxAsyncRequests: 5,  // 按需加载时最大并行加载数
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
}
```


runtimeChunk： 

将 optimization.runtimeChunk 设置为 true 或 'multiple'，会为每个入口添加一个只含有 runtime 的额外 chunk。
打包完成之后会有 index.bundle.js a.[hash].js b.[hash].js runtime.[hash].js
runtime 就是用来管理除了主 chunk 之外的其他模块之间的映射关系的。
- 当其他被分出来的包修改，对应的 hash 会重新生成，其他则不影响。
- 当修改主chunk的时候，runtime 和其他包的 hash 却不会变。

总结来说就是优化浏览器缓存，更改的模块，改变了 hash，尽管 runtime 会重新加载，但是没有被修改过的模块还是使用浏览器缓存。

