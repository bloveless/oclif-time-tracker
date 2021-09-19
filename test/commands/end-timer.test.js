const {expect, test} = require('@oclif/test')
const EndTimerCommand = require('../../src/commands/end-timer')
const MemoryStorage = require('../../src/storage/memory')
const {generateDbWithStartedEntry} = require('../test-helpers')

const someStartDate = 1631936940178
const someDate = 1631943984467

describe('end time', () => {
  test
  .stdout()
  .stub(EndTimerCommand, 'storage', new MemoryStorage(generateDbWithStartedEntry('project-one', someStartDate)))
  .stub(Date, 'now', () => someDate)
  .command(['end-timer', 'project-one'])
  .it('should set end time, unset the activeProject, and activeEntry when an entry is successfully ended', async ctx => {
    expect(await EndTimerCommand.storage.load()).to.eql({
      activeProject: null,
      projects: {
        'project-one': {
          activeEntry: null,
          entries: [
            {
              startTime: new Date(someStartDate),
              endTime: new Date(someDate),
            },
          ],
        },
      },
    })
    expect(ctx.stdout).to.contain('Ended time entry for "project-one"')
  })

  test
  .stdout()
  .stub(EndTimerCommand, 'storage', new MemoryStorage({
    activeProject: 'project-one',
    projects: {
      'project-one': {
        activeEntry: 0,
        entries: [
          {
            startTime: new Date(someStartDate),
            endTime: null,
          },
        ],
      },
      'project-two': {
        activeEntry: null,
        entries: [],
      },
    },
  }))
  .stub(Date, 'now', () => someDate)
  .command(['end-timer', 'project-two'])
  .catch('Project "project-two" is not currently being worked on')
  .it('should return an error if the user attempts to end a timer on a project that isn\'t being worked on', async _ => {
    // Expect that the storage is unchanged
    expect(await EndTimerCommand.storage.load()).to.eql({
      activeProject: 'project-one',
      projects: {
        'project-one': {
          activeEntry: 0,
          entries: [
            {
              startTime: new Date(someStartDate),
              endTime: null,
            },
          ],
        },
        'project-two': {
          activeEntry: null,
          entries: [],
        },
      },
    })
  })

  test
  .stdout()
  .stub(EndTimerCommand, 'storage', new MemoryStorage(generateDbWithStartedEntry('project-one', someStartDate)))
  .stub(Date, 'now', () => someDate)
  .command(['end-timer', 'project-does-not-exist'])
  .catch('Project "project-does-not-exist" does not exist')
  .it('should return an error if the user attempts to ends a timer on a project that doesn\'t exist', async _ => {
    // Expect that the storage is unchanged
    expect(await EndTimerCommand.storage.load()).to.eql(generateDbWithStartedEntry('project-one', someStartDate))
  })
})
