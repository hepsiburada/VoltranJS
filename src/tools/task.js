/* istanbul ignore file */
function run(task, action, ...args) {
  const command = process.argv[2];
  const taskName = command && !command.startsWith('-') ? `${task}:${command}` : task;
  const start = new Date();

  console.log('tools/task.js', 'run', `Starting '${taskName}'...\n`);

  return Promise.resolve()
    .then(() => action(...args))
    .then(() => {
      console.log(
        'tools/task.js',
        'run',
        `Finished '${taskName}' after ${new Date().getTime() - start.getTime()}ms\n`
      );
    })
    .catch(err => console.log('tools/task.js', 'run', `${err.stack}\n`));
}

process.nextTick(() => require.main.exports());

module.exports = (task, action) => run.bind(undefined, task, action);
