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


const _ = require('lodash');
// _.curry(fun)
function getSum(a, b, c) {
  return a + b + c;
}
const curriedGetSum = _.curry(getSum);
// console.log(curriedGetSum(1)(2)(3));



let matchStr = (reg, str) => {
  return str.match(reg);
}
matchStr = Curry(matchStr)

const hasSpace = matchStr(/\s+/g);

console.log(hasSpace('a pp le'));



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


const testSum = Curry(getSum)
console.log(testSum(1)(2)(3));