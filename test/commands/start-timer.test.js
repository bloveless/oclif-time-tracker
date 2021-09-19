const {expect, test} = require('@oclif/test')
const StartTimerCommand = require('../../src/commands/start-timer')
const MemoryStorage = require('../../src/storage/memory')
const {generateDb} = require('../test-helpers')

const someStartDate = 1631936940178
const someDate = 1631943984467

describe('start time', () => {
  test
  .stdout()
  .stub(StartTimerCommand, 'storage', new MemoryStorage(generateDb('project-one')))
  .stub(Date, 'now', () => someDate)
  .command(['start-timer', 'project-one'])
  .it('should start a timer for "project-one"', async ctx => {
    expect(await StartTimerCommand.storage.load()).to.eql({
      activeProject: 'project-one',
      projects: {
        'project-one': {
          activeEntry: 0,
          entries: [
            {
              startTime: new Date(someDate),
              endTime: null,
            },
          ],
        },
      },
    })
    expect(ctx.stdout).to.contain('Started a new time entry on "project-one"')
  })

  test
  .stdout()
  .stub(StartTimerCommand, 'storage', new MemoryStorage(generateDb('project-one')))
  .stub(Date, 'now', () => someDate)
  .command(['start-timer', 'project-does-not-exist'])
  .catch('Project "project-does-not-exist" does not exist')
  .it('should return an error if the user attempts to starts a timer on a project that doesn\'t exist', async _ => {
    // Expect that the storage is unchanged
    expect(await StartTimerCommand.storage.load()).to.eql({
      activeProject: null,
      projects: {
        'project-one': {
          activeEntry: null,
          entries: [],
        },
      },
    })
  })

  test
  .stdout()
  .stub(StartTimerCommand, 'storage', new MemoryStorage({
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
  .command(['start-timer', 'project-two'])
  .it('should end the running timer from another project before starting a timer on the requested one', async ctx => {
    // Expect that the storage is unchanged
    expect(await StartTimerCommand.storage.load()).to.eql({
      activeProject: 'project-two',
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
        'project-two': {
          activeEntry: 0,
          entries: [
            {
              startTime: new Date(someDate),
              endTime: null,
            },
          ],
        },
      },
    })

    expect(ctx.stdout).to.contain('Started a new time entry on "project-two"')
  })
})
