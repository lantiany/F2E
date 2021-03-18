/**
 * 有效括号匹配（基础版）
 * 给定一个只包括 '('，')' 的字符串 s ，判断字符串是否有效。
 * 每个左括号都能按照顺序闭合，返回true，否则返回false
 */


var isValid = function (s) {
  var stack = new Array();
  for(var i = 0, len = s.length; i < len; i++){
    if(s[i] === '('){
      stack.push(s[i])
    }else if(s[i] === ')'){
      stack.pop()
    }
  }
  return stack.length;
}

// console.log(isValid('()(())'))


/**
 * 有效括号匹配（进阶版）
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
 * 每个左括号都能按照顺序闭合，返回true，否则返回false
 */



var isValid1 = function(s){
  if(s.length % 2 !== 0){// 字符串长度不是2的整数倍肯定不合法
    return false
  }
  var map = {
    '(': ')',
    '{': '}',
    '[': ']',
  }
  var stack = new Array();
  for(var i = 0, len = s.length; i < len; i++){
    // 如果是左括号，入栈
    if(Object.keys(map).includes(s[i])){
      stack.push(s[i])
    }else{
      //  如果是右括号，与栈顶元素比较
      // 匹配上，栈顶元素出栈
      // 不匹配，当前元素入栈
      const stackTop = stack[stack.length - 1];
      if(s[i] === map[stackTop]){
        stack.pop()
      }else{
        stack.push(s[i])
      }
    }
  }
  return stack.length === 0;
}


console.log(isValid1("([{(){{}}}])"));


