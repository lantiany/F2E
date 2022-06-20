
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
