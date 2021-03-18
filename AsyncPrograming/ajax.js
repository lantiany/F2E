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

// ajax('./user.json').then(res => {
//   console.log(res);
//   return res
// }).then(res => {
//   console.log(res);
//   return res.name
// }).then(res => {
//   return res.toUpperCase()
// }).then(res => {
//   return res.split('').reverse().join('')
// }).then(res => {
//   console.log(res);
// })

// let p = Promise.resolve(new Promise((resolve, reject) => {
//   reject({
//     then: function(onFullfilled, onRejected){
//       onFullfilled('foo')
//     }
//   })
// }))

p = Promise.resolve({
  then: function(onFullfilled, onRejected){
    onFullfilled('foo')
  }
})

p.then(res => {
  console.log(res);
})

// p.catch(e => {
//   console.log(e);
// })



Promise.race([
  new Promise((resolve, reject) => {resolve(1)}),
  new Promise((resolve, reject) => {resolve(2)}),
  new Promise((resolve, reject) => {reject(3)})
]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err);
})






