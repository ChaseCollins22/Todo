import * as sidebarDOM from './sidebarDOM.js'
import { startOfToday, format } from 'date-fns';

export const sidebarIcon = document.querySelector('span');

sidebarIcon.addEventListener('click', function() {
  sidebarDOM.createSideBar();
}, {once: true})

sidebarIcon.addEventListener('click', function() {
  let sidebar = document.getElementById('sidebar-container');
  if (sidebar.style.display === 'block') { sidebar.style.display = 'none'}
  else { sidebar.style.display = 'block'}
  document.getElementById('all-tasks-sidebar').click()
});

const dateText = document.getElementById('date-today');
dateText.textContent = format(startOfToday(), 'MMMM do, y')
