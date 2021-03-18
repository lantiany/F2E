
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

const test1 = Compose(toUpper, first, reverse)
const test2 = ComposeES6(toUpper, first, reverse)
const test3 = ComposeES6(Compose(toUpper, first), reverse)
const test4 = ComposeES6(toUpper, Compose(first, reverse));

// console.log(test1(['a', 'b', 'c'])); 
// console.log(test2(['a', 'b', 'c'])); 
// console.log(test3(['a', 'b', 'c'])); 
// console.log(test4(['a', 'b', 'c'])); 


// 调试
const str = "never say die" // => "NEVER-SAY-DIE"
const split = _.curry((sep, str) => _.split(str, sep));
const join = _.curry((sep, arr) => _.join(arr, sep))
const log = _.curry((tag, v) => {console.log(tag+v); return v})
const test5 = Compose(join('-'), log('split: '), split(' '), log('upper: '), _.toUpper)
console.log(test5(str));


const fp = require('lodash/fp');

const test6 = fp.flowRight(fp.join('-'), fp.split(' '), fp.toUpper)
console.log(test6(str));