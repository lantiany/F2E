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

