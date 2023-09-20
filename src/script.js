import './styles/styles.css'
import * as sidebarDOM from './DOMScripts/sidebarDOM.js';
import './DOMScripts/navbarDOM.js';
import { sidebarIcon } from './DOMScripts/navbarDOM.js';
import Project, { addNewProject, getAllProjects } from './projects.js';
import Task from './tasks.js';

// if (!localStorage.getItem('testProject')) {
//   populateStorage()
// } else {
//   setData()
// }

// function populateStorage() {
//   console.log('helloer')
//   const testProject = {'name': 'Testing'};
  
//   localStorage.setItem('testProject', JSON.stringify(testProject));
// }

// function setData() {
//   const testProject = localStorage.getItem('testProject');
//   addNewProject(testProject);
// }

// console.log(localStorage)
// console.log(getAllProjects());

sidebarIcon.click();