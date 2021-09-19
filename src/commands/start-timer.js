const {Command} = require('@oclif/command')
const FilesystemStorage = require('../storage/filesystem')

class StartTimerCommand extends Command {
  async run() {
    const {args} = this.parse(StartTimerCommand)
    const db = await StartTimerCommand.storage.load()

    // Check to see if there is a timer running on another project and end it
    if (db.activeProject && db.activeProject !== args.projectName) {
      db.projects[db.activeProject].entries[db.projects[db.activeProject].activeEntry].endTime = new Date(Date.now())
      db.projects[db.activeProject].activeEntry = null
    }

    if (db.projects && db.projects[args.projectName]) {
      db.activeProject = args.projectName
      // Set the active entry before we push so we can take advantage of the fact
      // that the current length is the index of the next insert
      db.projects[args.projectName].activeEntry = db.projects[args.projectName].entries.length
      db.projects[args.projectName].entries.push({startTime: new Date(Date.now()), endTime: null})
    }

    if (!db.projects || !db.projects[args.projectName]) {
      this.error(`Project "${args.projectName}" does not exist`)
    }

    this.log(`Started a new time entry on "${args.projectName}"`)

    await StartTimerCommand.storage.save(db)
  }
}

StartTimerCommand.storage = new FilesystemStorage()

StartTimerCommand.description = 'Add a new project to the time tracking database'

StartTimerCommand.args = [
  {name: 'projectName', required: true},
]

module.exports = StartTimerCommand
