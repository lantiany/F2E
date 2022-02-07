

let s = (function(){
  class Stack {
    constructor(){
      this.stack = [];
    }

    // 入栈
    push(val){
      this.stack.push(val)
    }

    // 出栈
    pop(){
      this.stack.pop()
    }

    // 栈内元素个数
    size(){
      return this.stack.length;
    }
  }
  return new Stack();
})()

// let s = new Stack();
s.push(1)
s.push(2)
s.push(2)
s.pop()
console.log(s);
console.log(s.size());
