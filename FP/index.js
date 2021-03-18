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


// 函数作为返回值

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

// pay(100);
// pay(120);
// pay(10);

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

console.log(some(arr, v => v >= 2 ));

