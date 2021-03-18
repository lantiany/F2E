
console.log('global start');
setTimeout(() => {
  console.log('time out');
}, 0)
Promise.resolve().then(() => {
  console.log('promise1');
}).then(() => {
  console.log('promise2');
})
console.log('global end');

// global start
// global end
// promise