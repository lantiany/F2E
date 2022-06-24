
### Vue 模板到渲染过程

首先将Vue的模板进行解析，主要是通过正则表达式做匹配，匹配出指令、事件、插值语法等，生成抽象语法树AST（compileToFunctions）。
进一步将AST生成render函数，这个过程会依次处理模板、数据（data）、各种指令。下一步是通过render函数生成VNode，
进而生成整个虚拟DOM树，然后判断是否是第一次渲染，如果是第一次渲染，将会生成dom，将真实DOM渲染到页面上；
如果不是第一次渲染，就会使用基于同层比较的diff算法，判断vNode是否变化，将变化的内容通过打补丁更新到真实的dom上。


### Vue diff

当数据改变时，会触发setter，并且通过Dep.notify去通知所有订阅者Watcher，订阅者们就会调用patch方法，给真实DOM打补丁，更新相应的视图。

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220620174340.png)


patch 方法判断两个新旧节点是否是同一类型的节点，如果不是，使用新的 vNode 节点直接更新DOM；如果是 调用 patchVNode 继续深层比较节点是否相同。

#### sameVNode
sameVNode对比两个节点是否相等，会判断节点的 key、tag、isComment、isDef（data）以及是否是同一个 input。

#### patchVNode 

- 找到对应的真实DOM，称为el
- 判断newVNode和oldVNode是否指向同一个对象，如果是，那么直接return
- 如果他们都有文本节点并且不相等，那么将el的文本节点设置为newVNode的文本节点。
- 如果oldVNode有子节点而newVNode没有，则删除el的子节点
- 如果oldVNode没有子节点而newVNode有，则将newVNode的子节点真实化之后添加到el
- 如果两者都有子节点，则执行updateChildren函数比较子节点，这一步很重要

#### updateChildren diff 核心
四指针首尾比较。
![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220620175124.png)

#### 使用 index 作为 key

使用了 index 作为 key 之后，如果列表的发生了插入或者删除，会导致 新旧节点的 key 的映射部分甚至完全错乱，无法在旧的节点中找到不变的进行复用，增加节点的更新成本。


### nextTick

调用 nextTick 传入的回调函数会被放入 nextTick 自己内部的 callbacks 数组。
这个callbacks数组是根据浏览器的api支持情况通过事件循环异步执行 flushCallbacks，此时DOM已经更新完毕，可以拿到更新后的DOM.
```typescript
export function  nextTick(cb, ctx){
  callbacks.push(() => cb.call(ctx))
  if (!pending) flushCallbacks()
}

function flushCallbacks () {
  callbacks.forEach(cb => cb())
}

if (support(Promise)){
  timerFunc = () => {
    Promise.then(flushCallbacks)
  }
} else if (support(MutationObserver)) {
  new MutationObserver(flushCallbacks)
} else if (setImmediate){
  setImmediate(flushCallbacks)
} else  {
  setTimeout(flushCallbacks)
}
```

- 优先使用 Promise 添加微任务
- 降级为 MutationObserver
- 再降级为 setImmediate
- 最后降级为 setTimeout

### Vue.use 做了什么

- 判断传入的插件是否已经被安装，如果已经安装，直接返回
- 读取插件和传入的参数
- 判断 plugin.install 或者 plugin 是否是函数
- 调用这个函数，传入参数，记录 plugin 已经安装
- plugin 会被挂载到全局，通过 this.xxx 可以访问的 如 this.$store, this.$router

### Vue 依赖收集的过程
![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220624115319.png)
在Vue初始化的过程中，首先会执行 initData，在这个时候劫持 对象属性的 getter 和 setter。

然后会调用 生命周期函数，在 beforeMount 这个钩子中，会实例化一个渲染 watcher， 
watcher 调用 get 方法在vm上去访问相应的值，就触发了这个值的getter，Dep 就在这个时候完成依赖收集。

当数据发生改变的时候，在 setter 中会调用 Dep 的 notify 方法，告知 watcher 数据更新了，然后 watcher 执行自己的 update 方法，将变更的数据反映到真实的DOM上
