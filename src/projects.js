import Task from "./tasks.js";

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

export function getAllTasks() {
  return allProjects.flatMap((project) => project.getAllTasks);
}

export function getProjectById(projectNum) {
  return allProjects[projectNum];
}

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

  get getLastTaskNum() {
    return this.tasks.length - 1;
  }

  static deleteProject(projectNum) {
    allProjects.splice(projectNum, 1);
  }

  set renameProject(newName) {
    this.name = newName;
  }
}

const testProject = new Project('Website');
const projectDate = new Date(Date.now())
const testTask = new Task('Build Website', 'Full-stack using JS and React', projectDate);
testProject.addTask(testTask);

allProjects.push(testProject);
