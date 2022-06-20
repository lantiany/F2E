

```typescript
class Subject {
  list = [];

  attach(observer) {
    this.list.push(observer);
  }

  detach(observer) {
    this.list.splice(this.list.findIndex(item => item === observer), 1);
  }

  notify(message) {
    this.list.forEach(observer => {
      observer.update(message)
    })
  }
}

class Observer {
  constructor(cb) {
    if (typeof cb !== 'function') {
      throw new Error('cb should be a function')
    }
    this.cb = cb;
  }

  update(message) {
    this.cb(message);
  }
}


const s = new Subject()

const o1 = new Observer((message) => {
  console.log('o1 received message: ' + message);
})

const o2 = new Observer((message) => {
  console.log('o2 received message: ' + message);
})

s.attach(o1)
s.attach(o2)
s.notify('hello')
s.detach(o2)
s.notify('world')

```
