import './styles/sidebarStyles.css'

const mainContainer = document.querySelector('div');

export function createSideBar() {
  const sidebarContainer = document.createElement('div');
  sidebarContainer.className = 'sidebar-container';
  sidebarContainer.id = 'sidebar-container'
  
  const homeTitle = document.createElement('h1');
  homeTitle.textContent = 'Home';

  // Create list of task types
  const taskTypeList = document.createElement('ul');
  const allTasks = document.createElement('li');
  const todayTasks = document.createElement('li');
  const weekTasks = document.createElement('li');

  allTasks.textContent = 'All Tasks';
  todayTasks.textContent = 'Today\'s Tasks';
  weekTasks.textContent = 'Week\'s Tasks';

  taskTypeList.appendChild(allTasks);
  taskTypeList.appendChild(todayTasks);
  taskTypeList.appendChild(weekTasks);


  sidebarContainer.appendChild(homeTitle);
  sidebarContainer.appendChild(taskTypeList);
  mainContainer.prepend(sidebarContainer);

  return sidebarContainer;
}



