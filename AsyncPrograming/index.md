# JavaScript 异步编程

JS 是单线程执行的。
JS 代码的执行分为同步模式和异步模式。

## Primise 基本使用

```js
// promise 封装 ajax
function ajax(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error("err: " + this.statusText));
      }
    };
    xhr.send();
  });
}

ajax("./user.json").then(
  function onFullfilled(data) {
    console.log(data);
  },
  function onRejected(err) {
    console.log(err);
  }
);
```

### 误区

如果请求过多，且请求之间有数据依赖（后一个请求依赖前一个请求的返回结果），仍旧避免不了回调地狱。

```js
ajax(url).then((resolve, reject) => {
  ajax(url).then((resolve, reject) => {
    ajax(url).then((resolve, reject) => {
      ajax(url).then((resolve, reject) => {
        ajax(url).then((resolve, reject) => {
          ajax(url).then((resolve, reject) => {

          });
        });
      });
    });
  });
});
```

### 链式调用

```js
ajax('./user.json').then(res => {
  console.log(res);
  return res
}).then(res => {
  console.log(res);
  return res.name
}).then(res => {
  return res.toUpperCase()
}).then(res => {
  return res.split('').reverse().join('')
}).then(res => {
  console.log(res); // EMAN
})
``` 
promise 每一次 then 之后，返回的都是一个新的 promise，上一个 then 中 return 的结果将作为新的 promise 的值。

设置 onRejected 还可以通过 promise 的 catch 方法。

```js
promise.then(res => {

}).catch(err => {
  console.log(err)
})

// 这种写法等价于

promise.then(res => {}, undefined)
    .then(undefined, err => {
      console.log(err)
    })
// 第一个 then 没有 reject 回调
// 第二个 then 没有 resolve 回调
```

promise 链中所有的异常都会向后传递，直至被捕获。最好的做法是明确的捕获每一个可能的异常。

也可以全局统一处理。

```js
window.addEventListener('unhandledrejection', (event) => {
  const {reason, promise} = event;
  // reason 异常原因错误对象
  // promise 出现异常的 promise
  event.preventDefault()
}, false)
```

### 静态方法

`Promise.resolve({data})`

`Promise.reject({data})`

快速的将一个值作为 promise 对象的返回结果 resolve/reject 回去。

如果这个值本身是一个 promise 对象, 那这个 promise 对象会被**原封不动**返回。

```js
let p = Promise.resolve(new Promise((resolve, reject) => {
  reject(1)
}))

console.log(p); // Promise {<rejected>: 1}
```
即使 resolve 了，p 还是一个 rejected 状态的 promise。

如果 promise resolve/reject 了一个对象，这个对象内部有 then 方法，那这个对象被认为是实现了 thenable 接口的对象，也可以按照 promise 的 then 方法一样执行。

```js
p = Promise.resolve({
  then: function(onFullfilled, onRejected){
    onFullfilled('foo')
  }
})

p.then(res => {
  console.log(res); // foo
})
```

### 并行执行的 promise

// 所有的 promise 结束之后触发 then/catch
```js
Promise.all([
  new Promise((resolve, reject) => {resolve(1)}),
  new Promise((resolve, reject) => {resolve(2)}),
  new Promise((resolve, reject) => {reject(3)})
]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err);
})
// 当有 promise rejected 的时候，直接触发 catch
// 必须所有的 promise fullfilled 之后才会触发 then
```

某一个 promise 结束之后触发 then/catch
```js
Promise.race([
  new Promise((resolve, reject) => {resolve(1)}),
  new Promise((resolve, reject) => {resolve(2)}),
  new Promise((resolve, reject) => {reject(3)})
]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err);
})

```

### 执行时序

```js
console.log('global start');
Promise.resolve().then(() => {
  console.log('promise');
})
console.log('global end');

// global start
// global end
// promise
```

```js
console.log('global start');
setTimeout(() => {
  console.log('time out');
}, 0)
Promise.resolve().then(() => {
  console.log('promise1');
}).then(() => {
  console.log('promise2');
})
console.log('global end');
// global start
// global end
// promise1
// promise2
// time out
```
JS 代码的执行就相当于银行排队办理业务，
- 首先JS代码按照顺序解析执行，按照到银行的顺序拿号，挨个排队办理业务；
- 有的客户在办理完主要业务还在窗口没有离开，突然想起自己需要办张卡，然后柜员就直接给办了，这就是 `promise.then` 相关的（业界称之为微任务）；
- 有的客户不熟悉流程，排了队却被柜员告知这个业务办理需要填 n 张表，为了不影响后面的人办理业务，于是柜员让这个人先去填表，这个人就得重新排队（进入一个新的队列 - 回调队列）。`setTimeout` 就是属于这种情况（业界称之为宏任务）

`mutationObserver` 以及 `process.nextTick`都是属于微任务。




