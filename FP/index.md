## 函数式编程
- 函数是一等公民
- 函数可以保存在变量中
- 函数可以作为参数返回
- 函数可以作为返回值

## 高阶函数
 - 函数作为参数

```js
// 实现 forEach
function forEach(arr, fn){
  for(var i = 0; i < arr.length; i++){
    fn(arr[i])
  }
}

let arr = [1,2,3]

// console.log(forEach(arr, (item) => console.log(item)));


// 实现 filter
function filter(arr, fn){
  let res = [];
  for(var i = 0; i < arr.length; i++){
    if(fn(arr[i])){
      res.push(arr[i])
    }
  }
  return res;
}

// console.log(filter(arr, (item) => item % 2 === 0));

// 模拟 map
const map = (arr, fn) => {
  let res = []
  for(var i = 0; i < arr.length; i++){
    res.push(fn(arr[i]))
  }
  return res;
}

// console.log(map(arr, v => v * v));

// 模拟 every
function every(arr, fn){
  let res = true;
  for(var i = 0; i < arr.length; i++){
    if(!fn(arr[i])){
      res = false;
      break;
    }
  }
  return res
}

// console.log(every(arr, v => v <= 5));

// 模拟 some

function some(arr, fn){
  let res = false;
  for(var i = 0; i < arr.length; i++){
    if(fn(arr[i])){
      res = true;
      break;
    }
  }
  return res
}

// console.log(some(arr, v => v >= 2 ));

```

 - 函数作为返回值

 ```js

function makeFn(){
  let msg = "hello"
  return function (){
    console.log(msg);
  }
}


function once(fn){
  let done = false;
  return function(){
    if(!done){
      done = true;
      fn.apply(this, arguments)
    }
  }
}

const pay = once(amount => {
  console.log(amount);
})

pay(100);
pay(120); // 不执行
pay(10);  // 不执行
 ```

## 闭包 closure

高阶函数的返回值（一个函数）引用了这个函数内部的变量，形成闭包。

### 闭包的本质
> 函数在执行前会被放入栈中，执行结束之后从栈中移除，但是存储在堆中的作用域中成员不能被释放，因此，内部函数依然可以访问外部函数的成员变量。