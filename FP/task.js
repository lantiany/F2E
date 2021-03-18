const fs = require('fs');
const {task} = require('folktale/concurrency/task');
const {split, find} = require('lodash/fp')

function readFile(fileName){
  return task(resolver => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if(err) return resolver.reject(err)
      resolver.resolve(data)
    })
  })
}

readFile('package.json')  
  .map(split('\n'))
  .map(find(x => x.includes('version')))
  .run()
  .listen({
  onRejected: err => {
    console.log(err);
  },
  onResolved: data => {
    console.log(data);
  }
})