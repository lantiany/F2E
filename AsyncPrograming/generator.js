function * fun (){
  yield 'foo';
}

// 得到生成器对象 状态为 suspended  暂停
const generator = fun()

// 调用 next 方法，执行至函数体中第一个 yeild 位置，停下
// 向外返回 yeild 语句执行的结果
const res = generator.next()
// 再次调用 next， 执行至下一个 yeild 处停下，如果没有 yeild，执行完函数
console.log(generator);
console.log(res);


function ajax(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error("err: " + this.statusText));
      }
    };
    xhr.send();
  });
}

function * main(){
  const users = yield ajax('./user.json');
  console.log(users);
}
const g = main();
const result = g.next();

// g.next() 返回 是一个对象
// 对象的 value 是 ajax 函数的执行结果 -- promise
// 对象的 done 属性标记这个函数是否执行完毕
console.log(result);

result.value.then(data => {
  console.log(data);
  // 将 data 传递给 main 函数继续执行
  // 函数内部的 users 即此处的 data
  g.next(data)

})

function handleResult(result){
  if(result.done) return;
  result.value.then(data => {
    handleResult(g.next(data))
  }, error => {
    g.throw(error)
  })
}


function co(generator){
  const g = generator()
  function handleResult(result){
    if(result.done) return;
    result.value.then(data => {
      handleResult(g.next(data))
    }, error => {
      g.throw(error)
    })
  }
  handleResult(g.next())
}