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

  if (i < 5) {
    randomArr()
  }
}

const arr = new Array(5);
let i = 0;
let num = randomNumber();
```

### 2、洗牌算法（数组乱序）

这是一个广为流传的有问题的版本：

```typescript
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5)
}
```

通过随机数，每次排序有50%可能是升序有可能是降序, 而这两个元素的大小顺序也是50%。也就是说每一次的两个元素有 `50% * 50% = 25%`  的概率不会交换位置。各个元素随机的位置就会【不均匀】。

使用 Fisher–Yates 算法进行打乱会得到更为可靠的结果。 

其运行原理是：

> 从所有位置中随机选取一个位置，与数组倒数第一个元素交换位置。然后除了最后一个位置外的所有位置随机选取一个与倒数第二个元素交换，以此类推。

```typescript
function shuffle(arr) {
  let index = arr.length;
  while (index > 1) {
    const random = Math.floor(Math.random() * index--);
    [arr[random], arr[index]] = [arr[index], arr[random]];
  }
  return arr;
}
```


### 3、柯里化

1、允许初始传入任意数量的参数

2、当传入的参数个数为0的时候认为需要最终执行，执行传入的func并返回结果

3、每次传入参数通过参数数组收集起来，返回内部函数用来继续接收参数

```typescript
function Curry(func, ...args){
  const params = [...args];
  return function temp(...rest){
    if (args.length === 0){
      return func(...params);
    }else {
      params.push(...rest);
      return temp
    }
  }
}
```

