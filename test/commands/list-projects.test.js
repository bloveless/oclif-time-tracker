const {expect, test} = require('@oclif/test')
const EndTimerCommand = require('../../src/commands/end-timer')
const MemoryStorage = require('../../src/storage/memory')
const {generateDbWithStartedEntry} = require('../test-helpers')

const someDate = 1631948193315

describe('list projects', () => {
  test
  .stdout()
  .stub(EndTimerCommand, 'storage', new MemoryStorage({
    activeProject: 'project-two',
    projects: {
      'project-one': {
        activeEntry: null,
        entries: [
          {
            startTime: '2021-09-18T06:25:55.874Z',
            endTime: '2021-09-18T06:26:03.021Z',
          }, {
            startTime: '2021-09-18T06:26:09.883Z',
            endTime: '2021-09-18T06:26:47.585Z',
          }, {
            startTime: '2021-09-18T06:34:28.907Z',
            endTime: '2021-09-18T06:37:15.786Z',
          },
        ],
      },
      'project-two': {
        activeEntry: 1,
        entries: [
          {
            startTime: '2021-09-18T06:26:47.585Z',
            endTime: '2021-09-18T06:27:13.776Z',
          }, {
            startTime: '2021-09-18T06:52:54.791Z',
            endTime: null,
          },
        ],
      },
    },
  }))
  .stub(Date, 'now', () => someDate)
  .command(['list-projects'])
  .it('should list out a project that is currently being worked on', async ctx => {
    expect(ctx.stdout).to.contain('project-one (0h 3m 31.73s)\n' +
      '- 2021-09-18T06:25:55.874Z - 2021-09-18T06:26:03.021Z (0h 0m 7.15s)\n' +
      '- 2021-09-18T06:26:09.883Z - 2021-09-18T06:26:47.585Z (0h 0m 37.70s)\n' +
      '- 2021-09-18T06:34:28.907Z - 2021-09-18T06:37:15.786Z (0h 2m 46.88s)\n' +
      '(active) project-two (0h 4m 4.72s)\n' +
      '- 2021-09-18T06:26:47.585Z - 2021-09-18T06:27:13.776Z (0h 0m 26.19s)\n' +
      '- 2021-09-18T06:52:54.791Z (0h 3m 38.52s)\n')
  })
})
