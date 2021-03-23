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

## generator

generator 是 Async/Await 的原型。这是js中标准的异步解决方案，其执行原理如下所示：

```js
function * fun (){
  yield 'foo';
}

// 得到生成器对象 状态为 suspended  暂停
const generator = fun()

// 调用 next 方法，执行至函数体中第一个 yeild 位置，停下
// 向外返回 yeild 语句执行的结果
const res = generator.next()
// 再次调用 next， 执行至下一个 yeild 处停下，如果没有 yeild，执行完函数
console.log(generator); // fun {<suspended>}
console.log(res); // {value: "foo", done: false}
```


```js
function * main(){
  const users = yield ajax('./user.json');
  console.log(users);
}
const g = main();
const result = g.next();

// g.next() 返回 是一个对象
// 对象的 value 是 ajax 函数的执行结果 -- promise
// 对象的 done 属性标记这个函数是否执行完毕
console.log(result);

result.value.then(data => {
  console.log(data);
  // 将 data 传递给 main 函数继续执行
  // 函数内部的 users 即此处的 data
  g.next(data)
}
```

```js
function * main(){
  const users = yield ajax('./user.json');
  const datas = yield ajax('./data.json');
  const config = yield ajax('./config.json');
}

// 通过 handleResult 来控制 生成器函数的执行
function handleResult(result){
  // 如果生成器执行完毕，则 return
  if(result.done) return;
  // 否则继续通过 result.value.then 执行
  result.value.then(data => {
    // 每次传入上一次 yeild 的返回的数据
    handleResult(g.next(data))
  }, error => {
    // 如果出现异常，调用生成器函数的 throw 方法捕获异常
    g.throw(error)
  })
}
```

```js
// 生成器执行函数 升级版
function co(generator){
  const g = generator()
  function handleResult(result){
    if(result.done) return;
    result.value.then(data => {
      handleResult(g.next(data))
    }, error => {
      g.throw(error)
    })
  }
  handleResult(g.next())
}
```

## Promise 实现

```js
new Promise((resolve, reject) => {});
```
### 分析 new Promise()
- Promise 通过 new 出来的, 所以 Promise 应该是一个类
- 这个类的 constructor 应该接收一个函数作为参数
- 这个函数也接收外部两个函数作为参数，分别是 resolve, reject
- Promise 初始状态为 pending 等待状态
- resolve 改变 Promise 的状态为 fulfilled
- reject  改变 Promise 的状态为 rejected
- Promise 的状态一旦从 pending 改变为另外两个状态之后不再可改变
- 所以内部应该有一个常量 status

```js
const PENDING =  'pending';
const FULFILLED =  'fulfilled';
const REJECTED =  'rejected';
class MyPromise {
  constructor(executor){
    executor(this.resolve, this.reject)
  }
  // 默认值是 pending
  status = PENDING;

  resolve = () => {
    // 非 pending 状态不能执行 resolve
    if(this.status !== PENDING){
      return
    }
    this.status = FULFILLED;
  }

  reject = () => {
    // 非 pending 状态不能执行 reject
    if(this.status !== PENDING){
      return
    }
    this.status = REJECTED;
  }
}
```
### then 方法实现

Promise 中还有一个 then 方法

```js
Promise.then(()=> {}, ()=> {})
```
- 可见 then 就是判断 promise 的状态
- 如果是成功，执行成功回调
- 如果是失败，执行失败回调

```js
// 实现 then 方法
then(successCb, failCb){
  if(this.status === FULFILLED){
    // 成功执行成功回调
    successCb(this.value)
  }else if (this.status === REJECTED){
    // 失败执行失败回调
    failCb(this.reason)
  }
} 


let p = new MyPromise((res, rej) => {
  res(1)
})

p.then(res => {
  console.log(res) // 1
})

console.log(p);
// MyPromise {
//   status: 'fulfilled',
//   value: 1,
//   reason: undefined,
//   resolve: [Function: resolve],
//   reject: [Function: reject]
// }
```
这样就实现了 then。
一个基础版本的 promise 框架就有了。

### 增加异步处理功能

上面的 promise 框架是没有处理异步回调的能力的。

```js
class MyPromise {
  constructor(executor){
    executor(this.resolve, this.reject)
  }

  // 默认值是 pending
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCb = undefined;
  failCb = undefined
  

  resolve = (value) => {
    // 非 pending 状态不能执行 resolve
    if(this.status !== PENDING){
      return
    }
    this.status = FULFILLED;
    this.value = value;
    this.successCb && this.successCb(this.value)
  }

  reject = (reason) =>  {
    if(this.status !== PENDING){
      return
    }
    this.status = REJECTED;
    this.reason = reason;
    this.failCb && this.failCb(this.reason)
  }

  then(successCb, failCb){
    if(this.status === FULFILLED){
      successCb(this.value)
    }else if (this.status === REJECTED){
      failCb(this.reason)
    } else {
      // 等待状态
      this.successCb = successCb;
      this.failCb = failCb;
    }
  } 
}
```
这样就拥有了处理异步代码的能力。

```js
let p = new MyPromise((res, rej) => {
  setTimeout(()=>{
    res(true)
  }, 3000)
})
p.then(res => {
  console.log(res) // 3s 后： true
})
```
执行 then 时，如果遇到状态为 pending 的时候，就将这个处理函数存储起来，等到 resolve 执行的时候，再把这个函数执行。

但是目前还不能处理一堆then的调用。

### 多 then 任务处理

```js
const PENDING =  'pending';
const FULFILLED =  'fulfilled';
const REJECTED =  'rejected';
class MyPromise {
  constructor(executor){
    executor(this.resolve, this.reject)
  }
  // 默认值是 pending
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCb = [];
  failCb = []

  resolve = (value) => {
    // 非 pending 状态不能执行 resolve
    if(this.status !== PENDING){
      return
    }
    this.status = FULFILLED;
    this.value = value;
    // this.successCb && this.successCb(this.value)
    while(this.successCb.length) this.successCb.shift()(this.value);
  }

  reject = (reason) =>  {
    if(this.status !== PENDING){
      return
    }
    this.status = REJECTED;
    this.reason = reason;
    // this.failCb && this.failCb(this.reason)
    while(this.failCb.length) this.failCb.shift()(this.reason);
  }

  then(successCb, failCb){
    if(this.status === FULFILLED){
      successCb(this.value)
    }else if (this.status === REJECTED){
      failCb(this.reason)
    } else {
      // 等待状态
      this.successCb.push(successCb);
      this.failCb.push(failCb)
    }
  } 
}

let p = new MyPromise((res, rej) => {
  setTimeout(()=>{
    res(true)
  }, 3000)
})

console.log(p);
p.then(res => {
  console.log(1);
  console.log(res);
})
p.then(res => {
  console.log(2);
  console.log(res);
})
p.then(res => {
  console.log(3);
  console.log(res);
})
// 3s 后
// 1
// true
// 2
// true
// 3
// true
```

### then 链式调用

- then 方法存在于 MyPromise 中，如果 then 需要链式调用，那么 then 方法必然需要返回一个 MyPromise

```js
 // 先支持同步
then(successCb, failCb){
  // 既然要返回一个 MyPromise，那就 new 一个新的 MyPromise 
  // 为什么是一个新的 promise 对象？ 如果返回的是之前那个 promise，不就循环调用了吗。。。
  
  // MyPromise 的 constructor 传入的函数是立即执行的，所以原有的逻辑可以放入这个函数中
  let promise = new MyPromise((resolve, reject) => {
    if(this.status === FULFILLED){
      // 在当前 MyPromise 的 FULFILLED 状态下，将执行结果 通过新的 MyPromise resolve 回去
      resolve(successCb(this.value))
    }else if (this.status === REJECTED){
       // 在当前 MyPromise 的 REJECTED 状态下，将执行结果 通过新的 MyPromise reject 回去
      reject(failCb(this.reason))
    } else {
      // 等待状态 存储对应的处理函数
      // 在当前 MyPromise 的 PENDING 状态下，再像这样做肯定是不行了
      this.successCb.push(successCb);
      this.failCb.push(failCb)
    }
  })
  return promise;
} 
```

支持异步的链式调用

```js
 // 先支持同步
then(successCb, failCb){
  let promise = new MyPromise((resolve, reject) => {
    if(this.status === FULFILLED){
      // resolve(successCb(this.value))

      // 因为同步代码拿不到 promise
      // 通过 setTimeout 将内部代码转变为异步代码
      // 等同步代码执行完毕，promise 才能在此处拿到
      setTimeout(() => {
        resolvePromise(promise, successCb(this.value), resolve, reject)
      }, 0)
    }else if (this.status === REJECTED){
      // reject(failCb(this.reason))
      setTimeout(() => {  
        // 失败调用失败回调函数，传递失败原因 reason
        resolvePromise(promise, failCb(this.reason), resolve, reject)
      }, 0)
    } else {
      // 等待状态 存储对应的处理函数
      this.successCb.push(() => {
        setTimeout(() => {
          resolvePromise(promise, successCb(this.value), resolve, reject)
        }, 0)
      });
      this.failCb.push(() => {
        setTimeout(() => {  
          // 失败调用失败回调函数，传递失败原因 reason
          resolvePromise(promise, failCb(this.reason), resolve, reject)
        }, 0)
      })
    }
  })
  return promise;
}

// 通过这个函数去处理不同条件分支下的相同的处理逻辑
function resolvePromise(promise, result, resolve, reject){
  // 让 primise 链式调用的时候识别在 then 中返回了自己。防止循环引用
  if(promise === result){
    return reject(new TypeError("Chaining cycle detected for promise #<MyPromise>"))
  }
  // 如果 上一个 promise 的执行结果是返回一个新的 promise 对象
  // 那么 查看这个 promise 对象的返回结果，决定是 resolve 还是 reject
  if(result instanceof MyPromise){
    // result.then(value => resolve(value), reason => reject(reason))
    result.then(resolve, reject)
  } else {
    // 如果上一个 promise 的执行结果是返回一个普通值，直接调用 resolve 即可
    resolve(result)
  }
}
```


### 异常捕获
在 promise 的执行过程中，出现错误是常见的。因此需要捕获异常并抛出提示。


- 执行器中的异常
```js
constructor(executor){
  try {
    executor(this.resolve, this.reject)
  } catch(err) {
    this.reject(err)
  }
}
```
因为执行器出错了，肯定是无法运行下去了，所以调用 this.reject 将 promise 的状态更改为失败。

- then 方法中的异常
```js
then(successCb, failCb){
  let promise = new MyPromise((resolve, reject) => {
    if(this.status === FULFILLED){
      // resolve(successCb(this.value))

      // 因为同步代码拿不到 promise
      // 通过 setTimeout 将内部代码转变为异步代码
      // 等同步代码执行完毕，promise 才能在此处拿到
      setTimeout(() => {
        try {
          resolvePromise(promise, successCb(this.value), resolve, reject)
        } catch (err) {
          promise.reject(err)
        }
      }, 0)
    }else if (this.status === REJECTED){
      // reject(failCb(this.reason))
      setTimeout(() => {  
        // 失败调用失败回调函数，传递失败原因 reason
        try{
          resolvePromise(promise, failCb(this.reason), resolve, reject)
        }catch(err){
          promise.reject(err)
        }
      }, 0)
    } else {
      // 等待状态 存储对应的处理函数
      this.successCb.push(() => {
        setTimeout(() => {
          try {
            resolvePromise(promise, successCb(this.value), resolve, reject)
          } catch (err) {
            promise.reject(err)
          }
        }, 0)
      });
      this.failCb.push(() => {
        setTimeout(() => {  
          // 失败调用失败回调函数，传递失败原因 reason
          try{
            resolvePromise(promise, failCb(this.reason), resolve, reject)
          }catch(err){
            promise.reject(err)
          }
        }, 0)
      })
    }
  })
  return promise;
} 
```

then 中的每一个分支都可能出错，因此都需要去捕获异常。
then 方法会新建一个 promise 对象进行返回，如果这个过程中执行代码出错，就直接调用当前 promise 对象的 reject 方法，将状态修改为失败。

### then 方法 成功/失败 回调可选

可选参数的实现是非常简单的。

```js
  then(successCb, failCb){
    successCb = successCb ? successCb : val => val;
    failCb = failCb ? failCb : err => {throw err};
    // other logic ...
  }
```
- 在 then 方法中，如果没有传递回调参数，默认行为是将上一个 promise 的值返回，在后续的 then 中能够拿到这个执行结果
- 所以在没有传递成功回调的情况下，就将执行结果直接返回
- 在没有传递失败回调的情况下，将错误信息以 throw 出去，在后面的 then 中，会被 try-catch 代码块捕获这个异常
- 如果直接传递错误信息（不使用 throw），在后续的 then 中，会以一个正常值返回，这不符合预期。


### all 方法实现

观察 all 方法的调用方式，是通过 Promise.all([p1, p2, p3]) 的形式去调用的。
这说明 all 是 Promise 上的一个静态方法。
- 这个方法接收一个数组，数组中的元素可以是普通值，也可以是 promise 对象
- 按照数组元素的顺序返回对应的结果
- 如果是普通值，将其直接放入对应序号返回结果中
- 如果是 promise 对象，将promise 的执行结果放入对应序号的返回结果中
- 是 promise 就可能有异步代码，需要有一个机制去等待异步代码执行完成再返回结果

```js

  static all(taskArr) {
    let result = [], currentIndex = 0;
    return new MyPromise((resolve, reject) => {
      function addData (index, value){
        result[index] = value;
        currentIndex ++;
        if(currentIndex === taskArr.length){
          resolve(result)
        }
      }
      // 遍历传递进来的任务数组
      for(let i = 0; i < taskArr.length; i++){
        const current = taskArr[i];
        // 判断每一个任务的类型
        if(current instanceof MyPromise){
          // promise 对象
          current.then(val => addData(i, val), err => reject(err))
        } else {
          // 普通值
          addData(i, taskArr[i])
        }
      }
    })
  }
```


## finally 方法
- 不管 promise 的状态是啥，执行结束之后 finally 都会执行一次
- finally 方法之后，还可以继续调用 then 方法, 所以需要返回一个 Promise 对象
- 调用方式应该与 then 一样，所以不应该是一个静态方法，应该被定义在 MyPromise 原型对象上

```js
  finally(callback){
    // 通过 then 方法，得到当前 MyPromise 对象的状态
    // then 方法能够返回一个 Promise， 故直接返回 this.then
    return this.then(val => {
      // 考虑到 then 方法之后还需要链式调用 then， 于是在 then 中，需要返回当前的执行结果
      return MyPromise.resolve(callback()).then(() => val)
    }, err => {
      return MyPromise.resolve(callback()).then(() => { throw err})
    })
  }
```

### catch 方法

- then 方法的失败回调是可选的，如果在一个链式调用中一直没有异常捕获，可以在最后使用 catch 方法进行异常处理
- catch 之后仍然可以链式调用 then

```js
catch(failCallback){
  // catch 用于捕获异常，不用传递成功回调
  return this.then(undefined, failCallback);
}
```
