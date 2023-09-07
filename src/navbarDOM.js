import * as sidebarDOM from './sidebarDOM.js'

const sidebarIcon = document.querySelector('span');

sidebarIcon.addEventListener('click', function() {
  sidebarDOM.createSideBar();
}, {once: true})

sidebarIcon.addEventListener('click', function() {
  let sidebar = document.getElementById('sidebar-container');
  if (sidebar.style.display === 'block') { sidebar.style.display = 'none'}
  else { sidebar.style.display = 'block'}
})
