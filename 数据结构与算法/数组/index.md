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
