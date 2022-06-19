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
