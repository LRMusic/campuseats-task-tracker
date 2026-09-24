const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'tasks.json');
let tasks = loadTasks();

function loadTasks() {
  try {
    const fileContents = fs.readFileSync(dataFile, 'utf8');
    const parsedTasks = JSON.parse(fileContents);
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
}

function addTask(title) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return { success: false, message: 'Task title cannot be empty.' };
  }

  const task = {
    id: tasks.length === 0 ? 1 : Math.max(...tasks.map((item) => item.id)) + 1,
    title: trimmedTitle,
    completed: false,
  };

  tasks.push(task);
  saveTasks();

  return { success: true, message: `Added task #${task.id}: ${task.title}` };
}

function listTasks() {
  if (tasks.length === 0) {
    console.log('No tasks yet.');
    return;
  }

  console.log('CampusEats Task List');
  tasks.forEach((task) => {
    const status = task.completed ? '[x]' : '[ ]';
    console.log(`${task.id}. ${status} ${task.title}`);
  });
}

function markTaskDone(id) {
  const task = tasks.find((item) => item.id === Number(id));

  if (!task) {
    return { success: false, message: `Task #${id} was not found.` };
  }

  task.completed = true;
  saveTasks();
  return { success: true, message: `Marked task #${task.id} as done.` };
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === Number(id));

  if (index === -1) {
    return { success: false, message: `Task #${id} was not found.` };
  }

  const [removed] = tasks.splice(index, 1);
  saveTasks();
  return { success: true, message: `Deleted task #${removed.id}: ${removed.title}` };
}

function showUsage() {
  console.log('Usage:');
  console.log('  node src/tasks.js add "Task title"');
  console.log('  node src/tasks.js list');
  console.log('  node src/tasks.js done 1');
  console.log('  node src/tasks.js delete 1');
}

if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'add':
      console.log(addTask(args.join(' ')).message);
      break;
    case 'done':
      console.log(markTaskDone(args[0]).message);
      break;
    case 'delete':
      console.log(deleteTask(args[0]).message);
      break;
    case 'list':
    case undefined:
      listTasks();
      break;
    default:
      showUsage();
      break;
  }
}

module.exports = {
  tasks,
  addTask,
  listTasks,
  markTaskDone,
  deleteTask,
};
