## 前端代码题

### 1、用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值

```typescript

function randomNumber() {
  return Math.floor(Math.random() * 31 + 2);
}

function randomArr() {
  if (arr.indexOf(num) === -1) {
    arr[i] = num;
    i++;
  } else {
    num = randomNumber()
  }
  
  if (i < 5){
    randomArr()
  }
}
const arr = new Array(5);
let i = 0;
let num = randomNumber();
```
