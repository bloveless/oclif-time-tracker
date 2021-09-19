const {Command} = require('@oclif/command')
const FilesystemStorage = require('../storage/filesystem')

class EndTimerCommand extends Command {
  async run() {
    const {args} = this.parse(EndTimerCommand)
    const db = await EndTimerCommand.storage.load()

    if (!db.projects || !db.projects[args.projectName]) {
      this.error(`Project "${args.projectName}" does not exist`)
    }

    if (db.activeProject !== args.projectName) {
      this.error(`Project "${args.projectName}" is not currently being worked on`)
    }

    // TODO: If this is ever false then the DB is likely corrupt
    if (db.projects && db.projects[args.projectName]) {
      db.activeProject = null
      db.projects[args.projectName].entries[db.projects[args.projectName].activeEntry].endTime = new Date(Date.now())
      db.projects[args.projectName].activeEntry = null
    }

    this.log(`Ended time entry for "${args.projectName}"`)

    await EndTimerCommand.storage.save(db)
  }
}

EndTimerCommand.storage = new FilesystemStorage()

EndTimerCommand.description = 'Add a new project to the time tracking database'

EndTimerCommand.args = [
  {name: 'projectName', required: true},
]

module.exports = EndTimerCommand
