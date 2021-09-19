const {Command} = require('@oclif/command')
const FilesystemStorage = require('../storage/filesystem')

class ListProjectsCommand extends Command {
  async run() {
    const db = await ListProjectsCommand.storage.load()

    Object.keys(db.projects).forEach(projectName => {
      const isActive = projectName === db.activeProject ? '(active) ' : ''
      const totalTime = db.projects[projectName].entries.reduce((prev, current) => {
        if (current.startTime && current.endTime) {
          return prev + (new Date(current.endTime).getTime() - new Date(current.startTime).getTime())
        }

        if (current.startTime && !current.endTime) {
          return prev + (new Date(Date.now()).getTime() - new Date(current.startTime).getTime())
        }

        return prev
      }, 0)
      const timeSeconds = (totalTime / 1000) % 60
      const timeMinutes = (Math.floor((totalTime / 1000) / 60)) % 60
      const timeHours = (Math.floor((Math.floor((totalTime / 1000) / 60)) / 60)) % 60
      this.log(isActive + projectName + ` (${timeHours}h ${timeMinutes}m ${timeSeconds.toFixed(2)}s)`)

      db.projects[projectName].entries.forEach(entry => {
        if (entry.startTime && entry.endTime) {
          const totalTime = new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()
          const timeSeconds = (totalTime / 1000) % 60
          const timeMinutes = (Math.floor((totalTime / 1000) / 60)) % 60
          const timeHours = (Math.floor((Math.floor((totalTime / 1000) / 60)) / 60)) % 60
          this.log(`- ${entry.startTime.toLocaleString()} - ${entry.endTime.toLocaleString()} (${timeHours}h ${timeMinutes}m ${timeSeconds.toFixed(2)}s)`)
        } else {
          const totalTime = new Date(Date.now()).getTime() - new Date(entry.startTime).getTime()
          const timeSeconds = (totalTime / 1000) % 60
          const timeMinutes = (Math.floor((totalTime / 1000) / 60)) % 60
          const timeHours = (Math.floor((Math.floor((totalTime / 1000) / 60)) / 60)) % 60
          this.log(`- ${entry.startTime} (${timeHours}h ${timeMinutes}m ${timeSeconds.toFixed(2)}s)`)
        }
      })
    })
  }
}

ListProjectsCommand.storage = new FilesystemStorage()

ListProjectsCommand.description = 'Add a new project to the time tracking database'

module.exports = ListProjectsCommand
