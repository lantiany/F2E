class EventEmitter {
    constructor() {
        this.cache = {}
    }

    on(name, fn) {
        if (this.cache[name]) {
            this.cache[name].push(fn)
        } else {
            this.cache[name] = [fn]
        }
    }

    off(name, fn) {
        const tasks = this.cache[name]
        if (tasks) {
            const index = tasks.findIndex(task => task === fn)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        }
    }

    emit(name, ...args){
        if (this.cache[name]){
            this.cache[name].forEach(fn => {
                fn(args)
            })
        }
    }
}
