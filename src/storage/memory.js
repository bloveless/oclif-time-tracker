class MemoryStorage {
  constructor(initialData = {}) {
    this.data = initialData
  }

  load() {
    return Promise.resolve(this.data)
  }

  save(data) {
    this.data = data
    return Promise.resolve()
  }
}

module.exports = MemoryStorage
