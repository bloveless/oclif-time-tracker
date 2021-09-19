const {expect, test} = require('@oclif/test')
const AddProjectCommand = require('../../src/commands/add-project')
const MemoryStorage = require('../../src/storage/memory')
const {generateDb} = require('../test-helpers')

describe('add project', () => {
  test
  .stdout()
  .stub(AddProjectCommand, 'storage', new MemoryStorage({}))
  .command(['add-project', 'project-one'])
  .it('should add a new project', async ctx => {
    expect(await AddProjectCommand.storage.load()).to.eql({
      activeProject: null,
      projects: {
        'project-one': {
          activeEntry: null,
          entries: [],
        },
      },
    })
    expect(ctx.stdout).to.contain('Created new project "project-one"')
  })

  test
  .stdout()
  .stub(AddProjectCommand, 'storage', new MemoryStorage(generateDb('project-one')))
  .command(['add-project', 'project-one'])
  .catch('Project "project-one" already exists')
  .it('should return an error if the project already exists', async _ => {
    // Expect that the storage is unchanged
    expect(await AddProjectCommand.storage.load()).to.eql(generateDb('project-one'))
  })
})
