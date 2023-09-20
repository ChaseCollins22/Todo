let numTasks = -1;

export default class Task {
  constructor(title, details = '', date) {
    this.title = title;
    this.details = details;
    this.date = date;
    this.taskId = numTasks += 1;
    this.isCompleted = false;
  }

  get getTaskId() {
    return this.taskId;
  }

  get getTaskTitle() {
    return this.title;
  }

  get getTaskDetails() {
    return this.details;
  }

  get getTaskDate() {
    return this.date;
  }

  get isTaskCompleted() {
    return this.isCompleted;
  }

  set setTaskCompleted(value) {
    this.isCompleted = value;
  }
  
}
