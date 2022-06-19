### 206、反转链表

[反转链表](https://leetcode.cn/problems/reverse-linked-list/)

迭代解法思路：

```text
next
prev   curr   
null     1  ->  2  ->  3  ->  4  ->  5

prev     curr   next
null  <-   1  ->  2  ->  3  ->  4  ->  5

         prev   curr   next
null  <-   1  ->  2  ->  3  ->  4  ->  5
         next = curr.next;  指针后移
         curr.next = prev;  反转
         prev = curr;       指针后移
         curr = next;       指针后移
         
         ......
                                             next
                                    prev     curr
null  <-  1  <-  2  <-  3  <-  4  <-  5      null
```

```typescript
var reverseList = function (head) {
  if (head == null) return null;
  let prev = null, next = null, curr = head;
  while (curr) {
    next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

递归解法：

```typescript
var reverseList = function (head) {
  if (head == null || head.next == null) return head;

  let last = reverseList(head.next);

  head.next.next = head
  head.next = null;

  return last;
}
```

### 21、[合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

```typescript
var mergeTwoLists = function (list1, list2) {
  let curr = new ListNode();
  let dummy = curr;

  while (list1 && list2) {
    if (list1.val < list2.val) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      curr.next = list2;
      list2 = list2.next;
    }
    curr = curr.next;
  }

  list1 ? curr.next = list1 : '';
  list2 ? curr.next = list2 : '';

  return dummy.next;
}
```

骚操作，不太好理解。
```typescript
var mergeTwoLists = function (list1, list2) {
  if (list1 == null) return list2;
  if (list2 == null) return list1;

  if (list1.val < list2.val) {
    list1.next = mergeTwoLists(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoLists(list1, list2.next);
    return list2;
  }
};
```


### 876、[链表的中间节点](https://leetcode.cn/problems/middle-of-the-linked-list/submissions/)

```typescript
var middleNode = function(head) {
    if (head == null) return null;
    let p = head, k = head;

    while (k && k.next){
        k = k.next.next;
        p = p.next;
    }

    return p;
};
```

### 141、[环形链表](https://leetcode.cn/problems/linked-list-cycle/)

```typescript
var hasCycle = function(head) {
    if (head == null) return false;

    let p = head, k = head;

    while (k.next !== null && k.next.next !== null){
        p = p.next;
        k = k.next.next;
        if (p === k) {
            return true
        }
    }
    return false;
};
```

### 142、[环形链表2](https://leetcode.cn/problems/linked-list-cycle-ii/submissions/)

```typescript
var detectCycle = function(head) {
  if (head == null) return null;
  let p = head, k = head;
  let hasCycle = false;

  while (k.next && k.next.next) {
    p = p.next;
    k = k.next.next;
    if (p === k) {
      hasCycle = true;
      break;
    }
  }

  if (!hasCycle) {
    return null;
  }

  k = head;

  while (p !== k) {
    p = p.next;
    k = k.next;
  }

  return p;
};
```

### 24、[两两交换的链表](https://leetcode.cn/problems/swap-nodes-in-pairs/submissions/)

```typescript
var swapPairs = function(head) {
    let dummy = new ListNode();
    dummy.next = head;
    let current = dummy;

    while (current.next && current.next.next) {
        let n1 = current.next;
        let n2 = current.next.next;
        current.next = n2;
        n1.next = n2.next;
        n2.next = n1;
        current = n1;
    }

    return dummy.next;
};
```

### 83、删除排序链表中的重复元素

[删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/submissions/)


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
