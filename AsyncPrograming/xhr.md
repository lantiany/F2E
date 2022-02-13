
# 基于 Promise 封装一个Ajax

readyState 状态

0 － （未初始化）还没有调用send()方法
1 － （载入）已调用send()方法，正在发送请求
2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
3 － （交互）正在解析响应内容
4 － （完成）响应内容解析完成，可以在客户端调用了

```javascript
function Ajax({url, method, params, contentType}){
    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    Object.keys(key => {
        formData.append(key, params[key])
    })
    
    return new Promise((resolve, reject) => {
        try{
            xhr.onreadystatechange = function (){
                if (xhr.readyState === 4){
                    if (xhr.status >= 200 && xhr.status <= 400){
                        resolve(xhr.responseText)
                    }else {
                        reject(xhr)
                    }
                }
            }
            xhr.open(method, url, formData)
            xhr.setRequestHeader('Content-type', contentType)
            xhr.send()
        }catch (err){
            reject(err)
        }
    })
}
```


# 增强 Ajax 的功能，使其能够在失败后重试
