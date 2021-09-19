const {Command} = require('@oclif/command')
const FilesystemStorage = require('../storage/filesystem')

class AddProjectCommand extends Command {
  async run() {
    const {args} = this.parse(AddProjectCommand)
    const db = await AddProjectCommand.storage.load()

    if (db.projects && db.projects[args.projectName]) {
      this.error(`Project "${args.projectName}" already exists`)
    }

    db.activeProject = db.activeProject || null
    db.projects = db.projects || {}
    db.projects[args.projectName] = {
      activeEntry: null,
      entries: [],
    }

    this.log(`Created new project "${args.projectName}"`)

    await AddProjectCommand.storage.save(db)
  }
}

AddProjectCommand.storage = new FilesystemStorage()

AddProjectCommand.description = 'Add a new project to the time tracking database'

AddProjectCommand.args = [
  {name: 'projectName', required: true},
]

module.exports = AddProjectCommand
