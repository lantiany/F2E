
const PENDING =  'pending';
const FULFILLED =  'fulfilled';
const REJECTED =  'rejected';
class MyPromise {
  constructor(executor){
    try {
      executor(this.resolve, this.reject)
    } catch(err) {
      this.reject(err)
    }
  }

  // 默认值是 pending
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCb = [];
  failCb = []

  resolve = (value) => {
    // 非 pending 状态不能执行 resolve
    if(this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    // this.successCb && this.successCb(this.value)
    while(this.successCb.length) this.successCb.shift()();
  }

  reject = (reason) =>  {
    if(this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    // this.failCb && this.failCb(this.reason)
    while(this.failCb.length) this.failCb.shift()();
  }

  then(successCb, failCb){
    successCb = successCb ? successCb : val => val;
    failCb = failCb ? failCb : err => {throw err};
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

  // 不管 promise 的状态是啥，执行结束之后 finally 都会执行一次
  // finally 方法之后，还可以继续调用 then 方法, 所以需要返回一个 Promise 对象
  // 调用方式应该与 then 一样，所以不应该是一个静态方法，应该被定义在 MyPromise 原型对象上
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

  // then 方法的失败回调是可选的，如果在一个链式调用中一直没有异常捕获，可以在最后使用 catch 方法进行异常处理
  // catch 之后仍然可以链式调用 then
  catch(failCallback){
    // catch 用于捕获异常，不用传递成功回调
    return this.then(undefined, failCallback);
  }

  static all(taskArr) {
    let result = [], currentIndex = 0;
    return new MyPromise((resolve, reject) => {
      // 无论普通值还是 promise， 都调用此函数将执行结果添加进返回结果数组中
      function addData (index, value){
        result[index] = value;
        // 每次调用的时候，让索引 currentIndex + 1
        currentIndex ++;
        // 当 currentIndex === taskArr.length 的时候，表明任务已经执行完毕，可以返回结果了
        if(currentIndex === taskArr.length){
          resolve(result)
        }
      }
      for(let i = 0; i < taskArr.length; i++){
        const current = taskArr[i];
        if(current instanceof MyPromise){
          // promise 对象，将任务放进 then 中执行，确保异步任务能够被执行
          // 执行完毕 调用 addData
          current.then(val => addData(i, val), err => reject(err))
        } else {
          // 普通值，直接调用 addData
          addData(i, taskArr[i])
        }
      }
    })
  }

  // resolve 方法的作用是将给定的值转换成 promise 对象返回
  static resolve(value){
    // 如果传入的是一个 promise 对象，直接返回
    if(value instanceof MyPromise) return value;
    // 如果是普通值，通过 resovle 返回
    return new MyPromise(resolve => resolve(value) )
  }

  
}

function resolvePromise(promise, result, resolve, reject){
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

// let p = new MyPromise((res, rej) => {
//   throw new Error("err")
//   res(true)
// }).then((val => {
//   console.log(1);
//   console.log(val);
// }), err => {
//   console.log(2);
//   console.log(err);
// })

// let p1 = p.then(res => {
//   console.log(res);
//   return p1
// })

// p1.then(val => {
//   console.log(val);
// }, (err) => {
//   console.log(err);
// })

// module.exports = MyPromise;