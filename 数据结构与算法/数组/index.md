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

第一种思路是双指针两边向中间走，左指针遇到目标值就将右指针的值赋值给左指针。
题目不要求返回数据的顺序，所以只要左右指针相遇的时候，目标值已经被覆盖完了。
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

第二个思路是快慢指针，当快指针不是目标值的时候，将快指针赋值给慢指针（要保留下来的值）
```typescript
var removeElement = function (nums, val) {
  let slow = 0, fast = 0;
  while (fast < nums.length){
    if (nums[fast] !== val){
      nums[slow++] = nums[fast];
    }
    fast++;
  }
  return slow;
}
```
