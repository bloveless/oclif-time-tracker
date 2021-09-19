const fs = require('fs/promises')

class FilesystemStorage {
  constructor(initialData = {}) {
    this.data = initialData
  }

  load() {
    return fs.readFile('./time.json').then(file => {
      return JSON.parse(file.toString('utf-8'))
    }).catch(() => {
      // If reading the file results in an error then assume that the file didn't exist and return an empty object
      return Promise.resolve(this.data)
    })
  }

  save(data) {
    return fs.writeFile('./time.json', JSON.stringify(data))
  }
}

module.exports = FilesystemStorage
