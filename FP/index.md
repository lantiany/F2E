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


## 纯函数
对于纯函数来说，就以为这 f(x) = y, 函数对于确定的输入有确定的输出，没有可观察的副作用。

```js
// splice 即非纯函数
let arr = [1,2,3,4,5];
console.log(arr.splice(0, 3)); // [1,2,3]
console.log(arr.splice(0, 3)); // [4, 5]
console.log(arr.splice(0, 3)); // []

// slice 即纯函数
// 不改变原数组，
console.log(arr.slice(0, 1)); // [1]
console.log(arr.slice(0, 1)); // [1]
console.log(arr.slice(0, 1)); // [1]
```
### 纯函数示例

```js
const _ = require('lodash');

function getArea(r){
  console.log(r);
  return Math.PI * r * r;
}

// const getAreaWithMemory = _.memoize(getArea);

// 相同入参直接返回，不执行函数
// console.log(getAreaWithMemory(4));
// console.log(getAreaWithMemory(5));
// console.log(getAreaWithMemory(4));

// 模拟实现 memoize

function memoize(fn){
  let cache = {}
  return function(){
    let key = JSON.stringify(arguments);
    cache[key] = cache[key] ? cache[key] : fn.apply(fn, arguments)
    return cache[key]
  }
}

const myArea = memoize(getArea);
console.log(myArea(3));
console.log(myArea(4));
console.log(myArea(3));

```
### 好处？
 - 对测试友好
 - 对并行处理友好，纯函数不存在副作用，不存在共享内存数据的情况，所以在并行时也可以任意执行纯函数。


## 副作用
如果一个函数依赖外部变量，随着外部变量改变就不能保证相同的输入返回相同的输出，这个函数就是非纯函数，即有**副作用**。

副作用的来源主要是数据库、配置文件、用户输入等，它会使函数的通用型、复用性、扩展性下降。但是副作用是不可以完全禁止的，应控制齐在一个可控范围内。

## 柯里化

当一个函数有多个参数的时候，先传递一部分参数，以后这部分参数不变，返回一个函数，这个函数接收剩余部分参数，这样可以一直迭代下去，即科里化。

- 拆解函数的参数，每次可以传入任意个数的参数
- 每次传参后，如果参数个数没有满足要求，返回一个函数，接收剩余参数
- 参数数量够了之后，返回函数结果

### 柯里化的本质

 利用闭包，缓存函数参数。

```js

// 闭包缓存示例

// function checkAge(age){
//   let min = 18;
//   return age <= min;
// }

// function checkAge(age, min){
//   return age <= min;
// }


function checkAge(min){
  return function(age){
    return age <= min
  }
}

const checkAge18 = checkAge(18);
const checkAge20 = checkAge(20);


console.log(checkAge18(18));
console.log(checkAge18(19));
console.log(checkAge20(22));

```
lodash中科里化的使用

```js
const _ = require('lodash');
// _.curry(fun)
function getSum(a, b, c) {
  return a + b + c;
}
const curriedGetSum = _.curry(getSum);
console.log(curriedGetSum(1)(2)(3));
```

### 科里化模拟实现

```js
function Curry(fun){
  return function Curried(...args){
    /**
     * 判断实参 args 的个数和形参的个数关系
     * - 如果实参不够，返回一个函数接收剩余参数
     * - 如果实参足够，返回原函数的执行结果
     * - FunctionName.length 可以获取函数形参的个数
     * - ...args 收集参数成为一个数组
     */
    if(fun.length > args.length){
      // 实参个数不足，返回此函数继续接收参数
      return function(){
        // 递归调用 Curried
        // 递归的出口为此函数的参数足够
        return Curried(...args.concat(Array.from(arguments)))
      }
    }
    return fun(...args)
  }
}
```

### 柯里化总结
 > 柯里化可以使多参函数传递部分参数时，记住之前的传参. 这是一种对参数的缓存，对于某些大部分参数相同，少部分参数变化的函数比较有用。它可以让函数变得更灵活，简化开发中的一些重复工作。还可以配合函数组合变成一些更有力的工具。


 ## 函数组合

 当一个函数比较复杂，代码量比较大的时候，比较常见的做法是将其拆分为一个个比较小的函数，每个函数独立地去完成一部分功能，于是很容易写出如下代码：

```js
res = h(g(f(x)))
```
这样写没什么大问题，就是可读性不好。但是如果有一种方式可以让各个函数之间的组合看起来更优雅，你学还是不学？

```js
res = compose(f, g, h)
```


