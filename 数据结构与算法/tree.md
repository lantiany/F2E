## 二叉树相关题目

### 104. 二叉树的最大深度

[二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/submissions/)

思路：理解二叉树的结构，二叉树有一个根结点，根结点可以有左右两个子节点。 而如果横向看二叉树，那就是一层一层的。

```typescript
//
//    3
//   / \
//  9  20
//    /  \
//   15   7
//
```

从第一层开始，在遍历每一层的时候，先记录当前这一层的节点个数`size` ， 将这一层的每一个节点放入队列中，每遍历一个节点`size - 1` , 当 size 为 0 的时候， 这一层遍历完毕，深度 depth +
1。开启下一层的遍历，size 重置为下一层的节点个数。

> ps: 理解了这一点, 二叉树（甚至N叉树）的层序遍历相关题目感觉就有眉目了。

```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let depth = 0, queue = [root];
  while (queue.length > 0) {
    let size = queue.length;
    while (size > 0) {
      const node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
      size--;
    }
    depth++;
  }
  return depth;
};
```

写完了循环，再尝试尝试递归。

递归三要素：

1、函数主功能。 2、参数、返回值。 3、递归结束条件。

思路：二叉树的基本结构（或者说是最小单位）是：根结点，左右子节点（可能没有）。对于每一个节点，看是否存在子节点，存在子节点则深度+1，计算每个单元的深度，取更大的那个值，一直做下去，直到到达每一个分叉的终点，就得到最大的深度。

ps: 可以这样理解，但是执行过程并不是这样的。

```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let l = maxDepth(root.left);
  let r = maxDepth(root.right);
  return Math.max(l, r) + 1;
}
```

### 559. N叉数的最大深度

[N叉数的最大深度](https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/)

思路同二叉树的深度。

循环

```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let depth = 0, queue = [root];
  while (queue.length > 0) {
    let size = queue.length;
    while (size > 0) {
      const node = queue.shift();
      node.children && queue.push(...node.children);
      size--;
    }
    depth++;
  }
  return depth;
};
```

递归

```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let depth = 0, children = root.children;

  for (let child of children) {
    let childDepth = maxDepth(child);
    depth = Math.max(depth, childDepth);
  }
  return depth + 1;
};
```

### 102. 二叉树的层序遍历

[二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

```typescript
var levelOrder = function (root) {
  if (root == null) return [];
  const result = [], queue = [root];
  while (queue.length > 0) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
      level.push(node.val);
    }
    result.push(level);
  }
  return result
};
```

### 637. 二叉树的层平均值

[二叉树的层平均值](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)

```typescript
var averageOfLevels = function (root) {
  if (root == null) return 0;
  const result = [], queue = [root];
  while (queue.length > 0) {
    let size = queue.length, sum = 0;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
      sum += node.val;
    }
    result.push((sum / size).toFixed(5));
  }
  return result;
};
```

### 515. 在每个树行中找最大值

[在每个树行中找最大值](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)

```typescript
var largestValues = function (root) {
  if (root == null) return [];
  const result = [], queue = [root];

  while (queue.length > 0) {
    let max = Number.MIN_SAFE_INTEGER, size = queue.length;
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      if (node.val > max) {
        max = node.val;
      }
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    result.push(max);
  }
  return result;
};
```

### 简单总结

这几个题下来，就有点套路的意思了。层序遍历基本都是这个框架：

```typescript

var traverse = function (root) {
  if (root == null) return;
  const queue = [root], result = [];
  
  while (queue.length > 0){
    const size = queue.length;
    for(let i = 0; i < size; i++){
      const node = queue.shift();
      // 如果是 N叉树 就操作 node.children
      queue.push(...node.children);
      // 二叉树就操作左右子节点
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
      
      // do something
    }
  }
  return result
}

```
