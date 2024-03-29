### 54、螺旋矩阵

```typescript
var spiralOrder = function (matrix) {
  const result = [];
  const m = matrix.length, n = matrix[0].length;
  let upperBound = 0, bottomBound = m - 1;
  let leftBound = 0, rightBound = n - 1;
  while (result.length < m * n) {
    // 当上边界小于等于下边界的时候，这一行存在，才可以横向遍历
    // 当左边界小于等于右边界的时候，这一列存在，才可以纵向遍历
    if (upperBound <= bottomBound) {
      for (let i = leftBound; i <= rightBound; i++) {
        result.push(matrix[upperBound][i])
      }
      upperBound++;
    }
    if (leftBound <= rightBound) {
      for (let i = upperBound; i <= bottomBound; i++) {
        result.push(matrix[i][rightBound])
      }
      rightBound--;
    }
    if (upperBound <= bottomBound) {
      for (let i = rightBound; i >= leftBound; i--) {
        result.push(matrix[bottomBound][i]);
      }
      bottomBound--;
    }
    if (leftBound <= rightBound) {
      for (let i = bottomBound; i >= upperBound; i--) {
        result.push(matrix[i][leftBound]);
      }
      leftBound++;
    }
  }
  return result;
};
```

### 26、删除有序数组中的重复项

[删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/submissions/)

双指针

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/1.gif)

```typescript
var removeDuplicates = function (nums) {
  let j = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[j]) {
      nums[++j] = nums[i];
    }
  }
  return j + 1;
}
```

### 83、删除排序链表中的重复元素

[删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/submissions/)

思路与上题一致，只是操作的内容从数组变成了链表，从数组索引变成了链表指针。（详见注释）

![](https://lantiany-1254329693.cos.ap-chongqing.myqcloud.com/blog/2.gif)

```typescript
var deleteDuplicates = function (head) {
  if (head == null) return null;
  let slow = head, fast = head.next;
  // for(let i = 1; i < nums.length; )
  while (fast != null) {
    // if (nums[i] !== nums[j])
    if (slow.val !== fast.val) {
      // nums[++j] = nums[i]
      slow.next = fast
      slow = slow.next;
    }
    // i++
    fast = fast.next;
  }
  // 断开与后面元素的连接
  slow.next = null;
  return head;
};
```

### 27、移除元素

第一种思路是双指针两边向中间走，左指针遇到目标值就将右指针的值赋值给左指针。 题目不要求返回数据的顺序，所以只要左右指针相遇的时候，目标值已经被覆盖完了。

```typescript
var removeElement = function (nums, val) {
  let left = 0, right = nums.length
  while (left < right) {
    if (nums[left] === val) {
      nums[left] = nums[--right]
    } else {
      left++
    }
  }
  return left
};
```

第二个思路是快慢指针，当快指针不是目标值的时候，将快指针（的值）赋值给慢指针（要保留下来的值）

```typescript
var removeElement = function (nums, val) {
  let slow = 0, fast = 0;
  while (fast < nums.length) {
    if (nums[fast] !== val) {
      nums[slow++] = nums[fast];
    }
    fast++;
  }
  return slow;
}
```

### 5、最长回文子串

`acbaabc` 和 `acbabc` 这两种情况的处理。用一个扩散函数来确定在当前位置，分别假设奇数中心和偶数中心，可以构成回文串。

得到两个长度之后，取大的那个，计算开始位置：`start = i - Math.floor((max - 1) / 2);` max 需要 - 1 是因为 当前位置 i 占据了一个字符。

```typescript
var longestPalindrome = function (s) {
  let max = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    let oddLen = isPalindrome(s, i, i);
    let evenLen = isPalindrome(s, i, i + 1);

    let curMax = Math.max(oddLen, evenLen);

    if (curMax > max) {
      max = curMax;
      start = i - Math.floor((max - 1) / 2);
    }
  }
  return s.substring(start, start + max)
}

// 扩散函数
function isPalindrome(s, i, j) {
  while (i >= 0 && j <= s.length - 1) {
    if (s[i] !== s[j]) {
      break;
    }
    i--;
    j++;
  }
  return j - i - 1;
}
```

### 1、两数之和

[两数之和](https://leetcode.cn/problems/two-sum/submissions/)

两边 for 循环，暴力破解 O(N^2)

```typescript
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let need = target - nums[i];
    for (let j = 0; j < nums.length; j++) {
      // 要注意 i !== j 的情况才是正确解。数字不能重复
      if (nums[j] === need && i !== j) {
        return [i, j]
      }
    }
  }
}
```

使用map缓存数据，O(N)复杂度

```typescript
var twoSum = function (nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let need = target - nums[i];
    if (map.has(need)) {
      return [map.get(need), i]
    }
    map.set(nums[i], i)
  }
}
```

#### 拓展1: 如果给出的 nums 有序，需要返回多组和为 target 的两个数？

```typescript
var twoSumTarget = function (nums, target) {
  nums = nums.sort((a, b) => a - b);
  let lo = 0, hi = nums.length - 1;
  const result = [];
  while (lo < hi) {
    let left = nums[lo], right = nums[hi];
    let sum = left + right;
    if (sum > target) {
      while (lo < hi && nums[hi] === right) hi--;
    } else if (sum < target) {
      while (lo < hi && nums[lo] === left) lo++;
    } else if (sum === target) {
      result.push([left, right]);
      while (lo < hi && nums[hi] === right) hi--;
      while (lo < hi && nums[lo] === left) lo++;
    }
  }
  return result;
}
```

```typescript
// Test Code

let arr = [1, 2, 3, 4, 4, 5, 6, 7];
console.log(twoSumTarget(arr, 8));

// [[1,7],[2,6],[3,5],[4,4]]
```

#### 拓展2: 在两数之和的基础上，解决三数之和问题

```typescript
var twoSumTarget = function (nums, target, start = 0) {
  nums = nums.sort((a, b) => a - b);
  let lo = start, hi = nums.length - 1;
  const result = [];
  while (lo < hi) {
    let left = nums[lo], right = nums[hi];
    let sum = left + right;
    if (sum > target) {
      while (lo < hi && nums[hi] === right) hi--;
    } else if (sum < target) {
      while (lo < hi && nums[lo] === left) lo++;
    } else if (sum === target) {
      result.push([left, right]);
      while (lo < hi && nums[hi] === right) hi--;
      while (lo < hi && nums[lo] === left) lo++;
    }
  }
  return result;
}

var threeSum = function (nums, target) {
  nums = nums.sort((a, b) => a - b);
  const size = nums.length, result = [];
  for (let i = 0; i < size; i++) {
    let tuples = twoSumTarget(nums, i + 1, target - nums[i]);

    for (let j = 0; j < tuples.length; j++) {
      tuples[j].push(nums[i]);
    }
    result.push(...tuples);
    while (i < size - 1 && nums[i] === nums[i + 1]) i++;
  }
  return result;
}

let a = [0, 0, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5]
console.log(threeSum(a, 6));
/**
 * [
 *  [1, 5, 0],
 *  [2, 4, 0],
 *  [3, 3, 0],
 *  [1, 4, 1],
 *  [2, 3, 1]
 * ]
 */
```

#### 拓展3: 解决 4Sum 问题，甚至 nSum 问题？

```typescript
function nSumTarget(nums, n, target, start) {
  const size = nums.length, result = [];
  nums = nums.sort((a, b) => a - b);

  if (size < 2 || size < n) {
    return result;
  }

  if (n === 2) {
    let lo = start, hi = size - 1;
    while (lo < hi) {
      let left = nums[lo], right = nums[hi];
      let sum = left + right;
      if (sum > target) {
        while (lo < hi && nums[hi] === right) hi--;
      } else if (sum < target) {
        while (lo < hi && nums[lo] === left) lo++;
      } else {
        result.push([left, right])
        while (lo < hi && nums[hi] === right) hi--;
        while (lo < hi && nums[lo] === left) lo++;
      }
    }
  } else {
    for (let i = start; i < size; i++) {
      let subResult = nSumTarget(nums, n - 1, target - nums[i], i + 1);
      for (let sub of subResult) {
        sub.push(nums[i]);
        result.push(sub);
      }

      while (i < size && nums[i] === nums[i + 1]) i++;
    }
  }
  return result;
}
```

### 三数之和

```typescript
// 见上
```

### 167、两数之和 2 - 输入有序数组

双指针从两边往中间走，通过与目标值比较，调整左右指针大小，直到找到答案。

```typescript
var twoSum = function (numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    let sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else if (sum > target) {
      right--;
    }
  }
  return [-1, -1]
};
```

### 先升后降数组找最大值

```typescript
var findMax = function (nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    let mid = Math.floor((left + (right - left) / 2));
    if (nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1]) {
      return nums[mid]
    } else if (nums[mid] > nums[mid + 1]) {
      right = mid - 1;
    } else if (nums[mid] > nums[mid - 1]) {
      left = mid + 1;
    }
  }
  return -1;
}
```

### 11、[盛水最多的容器](https://leetcode.cn/problems/container-with-most-water)

```typescript
var maxArea = function (nums) {
  let left = 0, right = nums.length - 1;
  let max = 0;
  while (left < right) {
    if (nums[left] < nums[right]) {
      max = Math.max(nums[left] * (right - left), max);
      left++;
    } else {
      max = Math.max(nums[right] * (right - left), max);
      right--;
    }
  }
  return max;
}
```

### 153、寻找旋转排序数组中的最小值

```typescript
var findMin = function (nums) {
  let left = 0, right = nums.length - 1;

  while (left < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < nums[right]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return nums[left];
};
```

### 33、搜索旋转排序数组

```typescript
var search = function (nums, target) {
  let left = 0, right = nums.length - 1;
  // 用 mid 将 数组分割之后，数组有一个很重要的特点：至少一边一定是连续递增的
  // 
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[left] <= nums[mid]) {
      // 左边连续递增
      if (nums[left] <= target && target < nums[mid]) {
        // target 在左边区间
        right = mid - 1;
      } else {
        // target 在右边区间
        left = mid + 1;
      }
    } else {
      // 右边连续递增
      if (nums[mid] < target && target <= nums[right]) {
        // target 在右边区间
        left = mid + 1;
      } else {
        // target 在左边区间
        right = mid - 1;
      }
    }
  }
  return -1;
};
```

### 75、[颜色分类 （Medium）](https://leetcode.cn/problems/sort-colors/)

双指针解法

```typescript
var sortColors = function (nums) {
  // 用双指针，第一个指针只想最后一个0，第二个指针指向第一个2，另外用 current 做下标遍历
  let lastZero = -1, firstTwo = nums.length;
  let current = 0;

  // 排序完成的条件
  while (current < firstTwo) {
    if (nums[current] === 0) {
      // 当前是 0，要跟 lastZero 做交换
      lastZero++;
      [nums[lastZero], nums[current]] = [nums[current], nums[lastZero]];
      // 假设开局是0，上述交换完成之后，current就不会移动，所以当 0 交换之后，current 应该向右走
      current++;
    } else if (nums[current] === 1) {
      // 当前是 1 的时候不用动
      current++;
    } else if (nums[current] === 2) {
      // 当前是 2， 要跟 firstTwo 交换
      firstTwo--;
      [nums[firstTwo], nums[current]] = [nums[current], nums[firstTwo]];
    }
  }
}
```

### 135、[分发糖果](https://leetcode.cn/problems/candy/solution/)

```typescript
var candy = function (ratings) {
  const candys = new Array(ratings.length).fill(1);

  // 从左往右扫一遍，右边比左边大的孩子多一个糖果
  for (let i = 0; i < ratings.length - 1; i++) {
    if (ratings[i + 1] > ratings[i]) {
      candys[i + 1] = candys[i] + 1;
    }
  }

  // 从右往左扫一遍，右边比左边大的孩子多一个糖果，同时取最大值
  for (let j = ratings.length - 1; j > 0; j--) {
    if (ratings[j - 1] > ratings[j]) {
      candys[j - 1] = Math.max(candys[j - 1], candys[j] + 1);
    }
  }

  return candys.reduce((a, b) => b + a, 0);
};
```
