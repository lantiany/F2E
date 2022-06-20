
function defineReactive(obj, key, val){
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get(){
            return val
        },
        set(newVal){
            val = newVal
        }
    })
}
