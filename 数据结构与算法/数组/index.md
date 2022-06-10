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
