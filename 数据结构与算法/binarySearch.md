写二分搜索的魔鬼细节：

- 边界条件 基础二分搜索 `while` 条件用 `left <= right`，找边界用 `left < right`

- `mid = Math.floor((left + right) / 2)` 与 `mid = Math.floor(left + (right - left) / 2)` 等价，但是后者可以防止两数相加超出整数安全范围

```typescript
// 基础二分搜索
var binarySearch = function (nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] === target) {
      return mid;
    }
  }
  return -1;
}
```

- 初始化 `right = nums.length - 1` => 搜索区间是`[left, right]`；
- 区间`[left, right]` => `while(left <= right)`；如果不写等号，区间就是`[lleft, right)`，左闭右开，会漏掉。
- 因此 `left = mid + 1, right = mid - 1` 因为 `mid` 已经搜索过了，移动边界需要 `mid +- 1`
- 找到 `target` 返回索引，否则返回 `-1`。

> 下面的搜索左右边界也是如此，只是在找到 target 之后不急着返回，而是缩小不边界继续查找，查找左右边界的时候返回的是left/right，所以最后返回之前需要判断是否越界（因为可能没有找到，left/right就有可能越过对方）。

```typescript
// 搜索左边界
var binaryLeftBound = function (nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] === target) {
      right = mid - 1;
    }
  }

  if (left >= nums.length - 1 || nums[left] !== target) {
    return -1
  }
  return left
}
```

```typescript
// 搜索右边界
var binaryRightBound = function (nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] === target) {
      left = mid + 1;
    }
  }

  if (right < 0 || nums[right] !== target) {
    return -1
  }
  return right
}
```

### 875、爱吃香蕉的珂珂

[爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/submissions/)

```typescript
var minEatingSpeed = function (piles, h) {
  let maxVal = 1;
  for (let pile of piles) {
    if (pile > maxVal) maxVal = pile;
  }
  let left = 1, right = maxVal;
  while (left < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (calcSum(piles, mid) > h) {
      //  吃的还不够快，要更快一点，不然吃不完
      left = mid + 1;
    } else {
      // 快了，珂珂想慢一点
      right = mid;
    }
  }
  return left;

  function calcSum(piles, speed) {
    let sum = 0;
    for (let pile of piles) {
      sum += Math.ceil(pile / speed);
    }
    return sum;
  }
};

console.log(minEatingSpeed([30, 11, 23, 4, 20], 6))
```
