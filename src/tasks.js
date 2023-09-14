export default class Task {
  constructor(title, details = '', date) {
    this.title = title;
    this.details = details;
    this.date = date;
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
  
}
