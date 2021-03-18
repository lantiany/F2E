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
// 函数组合 low 版
// 这并没有解决 h(f(g(x))) 的问题
function compose(f, g){
  return function(value){
    return f(g(value))
  }
}

function reverse(arr){
  return arr.reverse()
}

function first(arr){
  return arr[0];
}

const lastChar = compose(first, reverse);
console.log(lastChar(['a', 'b', 'c']));
```
这样写没什么大问题，就是可读性不好。但是如果有一种方式可以让各个函数之间的组合看起来更优雅，你学还是不学？

```js
res = compose(f, g, h)


// 函数组合 low 版
// 这并没有解决 h(f(g(x))) 的问题
function compose(f, g){
  return function(value){
    return f(g(value))
  }
}

const reverse = arr => arr.reverse();
const first = arr => arr[0];
const toUpper = str => str.toString().toUpperCase();

// const lastChar = compose(first, reverse);
// console.log(lastChar(['a', 'b', 'c']));


const _ = require("lodash");



const lastChar = _.flowRight(toUpper, first, reverse)

// console.log(lastChar(['a', 'b', 'c'])); 

// 函数接收多个参数，每个参数都是纯函数
// 先执行函数的返回结果作为后执行函数的参数
//
/**
 * @description 函数接收多个参数，每个参数都是纯函数
 *    先执行函数的返回结果作为后执行函数的参数
 * @param  {Array:<Function>} args 
 * @returns value
 * reverse 函数接收两个参数
 *  - 迭代函数(累计值，执行函数，执行reduce的数组)
 *  - 累计值的初始值
 */
function Compose(...args) {
  return function(value) {
    // 初始值即value
    return args.reverse().reduce((acc, fun, args) => {
      return fun(acc)
    }, value)
  }
}

const ComposeES6 = (...args) => value => args.reverse().reduce((acc, fun)=> fun(acc), value)

const ComposeES6 = (...args) => value => args.reverse().reduce((acc, fun)=> fun(acc), value)

const test1 = Compose(toUpper, first, reverse)
const test2 = ComposeES6(toUpper, first, reverse)
const test3 = ComposeES6(Compose(toUpper, first), reverse)
const test4 = ComposeES6(toUpper, Compose(first, reverse));

console.log(test1(['a', 'b', 'c'])); // C
console.log(test2(['a', 'b', 'c'])); // C
console.log(test3(['a', 'b', 'c'])); // C
console.log(test4(['a', 'b', 'c'])); // C
```
- Compose函数可以自由组合，根据组合的不同，会得到不同的结果。
- 如果组合的顺序没有改变，那结果也不会改变，即满足结合律。

```js
Compose(f, g, h) = Compose(Compose(f, g), h) = Compose(f, Compose(g, h))
```

### 函数组合如何调试
```js
// 调试
const str = "never say die" // => "NEVER-SAY-DIE"

const split = _.curry((sep, str) => _.split(str, sep));
const join = _.curry((sep, arr) => _.join(arr, sep))
const log = _.curry((tag, v) => {console.log(tag+v); return v})

const test5 = Compose(join('-'), log('split: '), split(' '), log('upper: '), _.toUpper)

console.log(test5(str));


/**
 * 上面用到的 split 和 join 都是封装过的，因为在 lodash 的 _ 模块下，这些函* 数都是数据优先的，即数据在前，如果直接使用 split('-')，该函数会将 ‘-’ 当作* 数据处理，会导致意外的错误
 * 所以要通过封装将参数顺序反转过来
 * 在 lodash 模块中也有数据置后的函数，在 fp 模块中
 */


const fp = require('lodash/fp');
const test6 = fp.flowRight(fp.join('-'), fp.split(' '), fp.toUpper)
console.log(test6(str));
```


## point free

[什么是Point Free](https://www.ruanyifeng.com/blog/2017/03/pointfree.html)

**不使用所要处理的值，只合成运算过程**

通过函数组合，合成数据处理的基本运算。组合过程中无关数据，只需定义一些相关基本运算函数。


## 函子
- 函数式编程的运算不直接操作值，都通过函子来完成。
- 函子是一个实现了 map 契约的对象。
- 函子可以理解为一个盒子，盒子中封装了一个值。
- 想要处理这个值，传递一个 map 方法，map 方法接收一个纯函数去处理这个值。
- map 方法返回一个新的盒子。（所以可以无限地 map 下去, 形成链式调用）


### 基础值函子
```js
class Container {
  static of (value){
    return new Container(value)
  }
  constructor(value){
    this._value = value
  }
  map(fun){
    // 静态方法通过 类名.类方法 调用
    return Container.of(fun(this._value))
  }
  // 如果需要获取值，调用 val 方法
  val(){
    return this._value
  }
}

const a = Container.of(5)
  .map(value => value + 1)
  .map(value => value * 3)
  .map(value => value % 4)

console.log(a); // Container { _value: 2 }
```
### 基础函子存在的问题

```js
const test = Container.of(null)
  .map(value => value.toUpperCase())

// TypeError: Cannot read property 'toUpperCase' of null
```
对于纯函数，相同的输入要有相同的输出，这里传入 null 没有输出，而是抛出异常。

### 解决空值问题 MayBe 函子

编程中数据来源有多种方式，无法保证数据合法，不为空。这就是副作用。
MayBe函子用于解决空值带来的副作用问题。

```js

class MayBe {
  static of(value){
    return new MayBe(value)
  }
  constructor(value){
    this._value = value
  }
  map(fun){
    return this.isEmptyValue() ?  MayBe.of(this._value) : MayBe.of(fun(this._value))
  }
  isEmptyValue(){
    return this._value === null || this._value === undefined
  }
}

const test1 = MayBe.of(undefined)
  .map(val => val.toUpperCase())

console.log(test1); // MayBe { _value: undefined }
```
### MayBe 函子 存在的问题

如果某个环节的 map 没有返回正确的值，而是返回了 undefined 或者 null, 这也不符合期望。

```js
const test2 = MayBe.of(10)
  .map(val => val * val)
  .map(val => undefined)
  .map(val => val.toString())

console.log(test2); //  MayBe { _value: undefined }
```
上述代码这样写当然一眼看出问题，如果map 函数稍微复杂一点，不慎返回了意外的 null，得不到期望的值，MayBe 函子也没有办法解决。

### Either 函子

```js
class Left {
  static of(value){
    return new Left(value)
  }
  constructor(value){
    this._value = value
  }
  map(){
    return this
  }
}

class Right {
  static of(value){
    return new Right(value)
  }
  constructor(value){
    this._value = value
  }
  map(fun){
    return Right.of(fun(this._value))
  }
}

function parseJSON(params) {
  try{
    return Right.of(JSON.parse(params))
  }catch(e){
    return Left.of({err: e.message})
  }
}

console.log(parseJSON('{name: zs}').map(obj => obj.name.toUpperCase()));
// Left { _value: { err: 'Unexpected token n in JSON at position 1' } }
console.log(parseJSON('{"name": "zs"}').map(obj => obj.name.toUpperCase()))
// Right { _value: 'ZS' }
```
这样就可以知道在执行过程中出现了错误。Either 函子处理了相当于 if else 的处理逻辑，出现异常 返回 Left 函子，正常返回 Right 函子。

### IO函子



















