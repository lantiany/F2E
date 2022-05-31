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

### 2、洗牌算法

这是一个广为流传的有问题的版本：

```typescript
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5)
}
```

通过随机数，每次排序有可能是升序有可能是降序。也就是说每一次的两个元素有50%的概率不会交换位置。各个元素随机的位置就会【不均匀】。

使用 Fisher–Yates 算法进行打乱会得到更为可靠的结果。 

其运行原理是：

> 从所有位置中随机选取一个位置，与数组倒数第一个元素交换位置。然后除了最后一个位置外的所有位置随机选取一个与倒数第二个元素交换，以此类推。

```typescript
function shuffle(arr) {
  let index = arr.length;
  while (index > 1) {
    const random = Math.floor(Math.random() * index--);
    [arr[random], arr[index]] = [arr[index], arr[random]]
  }
  return arr
}
```


### 0.1 + 0.2 = 0.30000000000000004 ?

JavaScript 中的数字遵循 IEEE 754 标准，使用 64 位表示数字。

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/20220531103325.png)

最高位为符号位，接下来的 11 位是 指数位，剩下 52 位是尾数。

在进行运算的过程之前需要进行 两步 操作：转换 & 对阶，首先需要将数字转换为二进制。

```html
0.1 -> 0.0001100110011001...(无限循环)
0.2 -> 0.0011001100110011...(无限循环)
```

转换之后两个数都是无限循环二进制小数。在这里产生了第一次精度损失。

转换之后还需要对小数进行对阶，对阶的目的是让小数的尾数能够进行运算。对阶过程中js引擎会对小数进行截断，这里产生了第二次精度损失。

在两次精度损失后，运算结果就成了我们看到的这样 `0.1 + 0.2 = 0.30000000000000004` .

为了解决这个问题，对于比较小的数据运算，我们可以将小数转换为整数进行计算，然后再缩小。对于大数的运算我们可以借助第三方库。
