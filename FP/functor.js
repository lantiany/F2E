
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