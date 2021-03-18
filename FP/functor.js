
// 函子
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
  val(){}
}

const a = Container.of(5)
  .map(value => value + 1)
  .map(value => value * 3)
  .map(value => value % 4)


// console.log(a);

// const test = Container.of(null)
//   .map(value => value.toUpperCase())

// TypeError: Cannot read property 'toUpperCase' of null


// MayBe 函子

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

  console.log(test1);

const test2 = MayBe.of(10)
  .map(val => val * val)
  .map(val => undefined)
  .map(val => val.toString())

console.log(test2);


// Either 函子

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
console.log(parseJSON('{"name": "zs"}').map(obj => obj.name.toUpperCase()));

// IO 函子

function Curry (fun){
  return function Curried(...args){
    if(args.length < fun.length){
      return function(){
        return Curried(...args.concat(Array.from(arguments)))
      }
    }
    return fun(...args)
  }
}

function Compose(...args){
  return function(value){
    return args.reverse().reduce((acc, fun) => {
      return fun(acc)
    }, value)
  }
}
class IO {
  static of(value){
    return new IO(function(){
      return value
    })
  }
  constructor(fun){
    this._value = fun
  }
  map(fun){
    // this._value 是一个函数
    // map 传入的 fn 也是一个函数
    // 先经过 this._value 处理（此处处理就是直接 return）后的返回结果给 fun 再处理
    // 最终的返回结果是一个 新的 IO
    return new IO(Compose(fun, this._value))
  }
}

const io = IO.of(process).map(process => process.execPath)

console.log(io._value()); // /usr/local/bin/node
const fs = require("fs");

// const readFile = function(fileName){
//   return new IO(function(){
//     return fs.readFileSync(fileName, 'utf-8')
//   })
// }

// const print = function(file){
//   return new IO(function(){
//     console.log(file._value());
//     return file
//   })
// }

// const readAndPrint = Compose(print, readFile);

// console.log(readAndPrint('package.json')._value()._value());


class Monad{
  static of(value){
    return new Monad(function(){
      return value
    })
  }
  constructor(fun){
    this._value = fun
  }
  map(fun){
    return new Monad(Compose(fun, this._value))
  }
  // join 函数 返回函子 value 的执行结果
  join(){
    return this._value()
  }
  // 区别于 map, flatMap 执行 map 中的 fun 之后获取执行结果返回
  flatMap(fun){
    return this.map(fun).join()
  }
}

const readFile = function(fileName){
  return new Monad(function(){
    return fs.readFileSync(fileName, 'utf-8')
  })
}

const print = function(file){
  return new Monad(function(){
    console.log(file);
    return file
  })
}

console.log(readFile('package.json').flatMap(print).join());
