module.exports = {
  generateDb: project => {
    return {
      activeProject: null,
      projects: {
        [project]: {
          activeEntry: null,
          entries: [],
        },
      },
    }
  },
  generateDbWithStartedEntry: (project, startTime) => (
    {
      activeProject: project,
      projects: {
        [project]: {
          activeEntry: 0,
          entries: [
            {
              startTime: new Date(startTime),
              endTime: null,
            },
          ],
        },
      },
    }
  ),
}
