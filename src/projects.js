let allProjects = [];

export function addNewProject(newProject) {
  allProjects.push(newProject);
}

export function getAllProjects() {
  return allProjects;
}

export function getProjectByName(projectName) {
  return allProjects.find(({ name }) => name === projectName);
}

console.log(allProjects)

export class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  get getAllTasks() {
    return this.tasks;
  }
}