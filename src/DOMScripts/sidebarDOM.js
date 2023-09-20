import '/src/styles/sidebarStyles.css';
import { Project, addNewProject, getAllProjects, getProjectByName, getAllTasks, renameProject, getProjectById } from '../projects';
import Task from '../tasks';
import { addWeeks, differenceInDays, differenceInHours, getTime, isToday, isWithinInterval, startOfDay, startOfToday} from 'date-fns';
import { de } from 'date-fns/locale';



const mainContainer = document.querySelector('div');

function clearTaskContainer() {
  const taskContainer = document.getElementById('tasks');
  while (taskContainer.lastChild.id !== 'task-type-container') {
    taskContainer.lastChild.remove();
  }
}

function displayAllTasks(taskListContainer) {
  const allProjects = getAllProjects();
      
  const allTasks = allProjects.flatMap((project) => project.getAllTasks);

  if (allTasks.length > 0) {
    allTasks.forEach((task) => {
      taskListContainer.appendChild(createTask(task, task.getTaskId));
    });
  } else {
    const noTasks = document.createElement('h2');
    noTasks.textContent = 'No tasks today!';
    noTasks.style.textAlign = 'center';
    taskListContainer.appendChild(noTasks);
  }
}


function displayTodaysTasks(taskListContainer) {
  const allProjects = getAllProjects();

  let todaysTasks = allProjects.flatMap((project) => project.getAllTasks);

  todaysTasks = todaysTasks.filter((taskObj) => isToday(taskObj.getTaskDate));

  if (todaysTasks.length > 0) {
    todaysTasks.forEach((task) => {
      taskListContainer.appendChild(createTask(task, task.getTaskId));
    });
  } else {
    const noTasks = document.createElement('h2');
    noTasks.textContent = 'No tasks today!';
    noTasks.style.textAlign = 'center';
    taskListContainer.appendChild(noTasks);
  }
}

function displayWeekTasks(taskListContainer) {
  const allProjects = getAllProjects();

  let todaysDate = startOfToday();
 
  let weekTasks = allProjects.flatMap((project) => project.getAllTasks)
                             .filter((taskObj) => {
                                let taskDate = new Date(taskObj.getTaskDate);
                                return isWithinInterval(taskDate, {
                                  start: todaysDate,
                                  end: addWeeks(todaysDate, 1)
                                });
                             });

  if (weekTasks.length > 0) {
    weekTasks.forEach((task) => taskListContainer.appendChild(createTask(task, task.getTaskId)));
  } else {
    const noTasks = document.createElement('h2');
    noTasks.textContent = 'No tasks today!';
    noTasks.style.textAlign = 'center';
    taskListContainer.appendChild(noTasks);
  }
}

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


  [allTasks, todayTasks, weekTasks].forEach((taskType) => {
    const taskContainer = document.getElementById('task-type-container');
    const mainContainer = document.getElementById('tasks');
    taskType.addEventListener('click', function() {
      taskContainer.firstElementChild.textContent = taskType.textContent;
      clearTaskContainer();
      const taskListContainer = createTaskListContainer();

      switch (taskType.textContent) {
        case 'All Tasks':
          displayAllTasks(taskListContainer);
          break;
        case "Today's Tasks":
          displayTodaysTasks(taskListContainer);
          break;
        default:
          displayWeekTasks(taskListContainer);
      }

      mainContainer.appendChild(taskListContainer);
      
      
      getAllTasks().forEach((task) => {
        try {
          taskCompletedStyles(task, task.getTaskId)
        } catch (e) {
          return e
        }
      })
    });
  });

  allTasks.id = 'all-tasks-sidebar';
  allTasks.textContent = 'All Tasks';
  todayTasks.textContent = 'Today\'s Tasks';
  weekTasks.textContent = 'Week\'s Tasks';

  taskTypeList.appendChild(allTasks);
  taskTypeList.appendChild(todayTasks);
  taskTypeList.appendChild(weekTasks);

  const projectsTitle = document.createElement('h1');
  projectsTitle.textContent = 'Projects';

  const projectsListContainer = document.createElement('div');
  projectsListContainer.id = 'project-list-container';
  const projectsList = document.createElement('ul');
  projectsList.id = 'project-list';
  const addProject = document.createElement('li');
  addProject.textContent = 'Add Project';

  addProject.addEventListener('click', function() {
    if (projectsList.firstChild.id !== 'new-project-container') {
      const newProjectContainer = document.createElement('div');
      newProjectContainer.id = 'new-project-container';

      const textBox = document.createElement('input');
      textBox.placeholder = 'Project name';

      const btnContainer = document.createElement('div');
      btnContainer.classList = 'project-btn-container';

      const addProjectBtn = document.createElement('button');
      const cancelProjectBtn = document.createElement('button');

      addProjectBtn.textContent = 'Add';
      addProjectBtn.id = 'add-project-btn';
      cancelProjectBtn.textContent = 'Cancel';
      cancelProjectBtn.id = 'cancel-project-btn';

      addProjectBtn.addEventListener('click', function() {
        const newProject = new Project(textBox.value);
        addNewProject(newProject);
        updateProjectsList();

      });

      cancelProjectBtn.addEventListener('click', function() {
        newProjectContainer.remove();
      })

      btnContainer.appendChild(addProjectBtn);
      btnContainer.appendChild(cancelProjectBtn);


      newProjectContainer.appendChild(textBox);
      newProjectContainer.appendChild(btnContainer);
      projectsList.prepend(newProjectContainer);

      textBox.focus();
    }
  });

  addProject.addEventListener('mousedown', function() {
    if (projectsList.firstChild.id === 'new-project-container') {
      const newProjectTextbox = document.querySelector('input');
      newProjectTextbox.style.borderColor = 'rgba(255, 255, 255, 0)';
      setTimeout(() => {
        newProjectTextbox.style.borderColor = '#e8eef1';
        newProjectTextbox.focus();
      }, 100);
    }
  });

  projectsList.appendChild(addProject);
  projectsListContainer.appendChild(projectsList);
  sidebarContainer.appendChild(homeTitle);
  sidebarContainer.appendChild(taskTypeList);
  sidebarContainer.appendChild(projectsTitle);
  sidebarContainer.appendChild(projectsListContainer);
  mainContainer.prepend(sidebarContainer);

  return sidebarContainer;
}

function createAddTaskBtn() {
  const addTaskBtn = document.createElement('button');
  addTaskBtn.textContent = '+ Add Task';
  addTaskBtn.id = 'add-task-btn';
  addTaskBtn.type = 'button';

  addTaskBtn.addEventListener('click', function() {
    const taskContainer = document.getElementById('tasks');

    const taskFormContainer = document.createElement('div');
    taskFormContainer.id = 'task-form-container';
    taskFormContainer.className = 'task-form-container';

    const taskForm = document.createElement('form');
    taskForm.id = 'task-form';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title:'
    const titleTextBox = document.createElement('input');
    titleTextBox.placeholder = 'Task title';

    const detailsLabel = document.createElement('label');
    detailsLabel.textContent = 'Details (optional)';
    const detailsTextBox = document.createElement('textarea');
    detailsTextBox.placeholder = 'What to do';

    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Date:';
    const dateTextBox = document.createElement('input');
    dateTextBox.type = 'date';
    dateTextBox.setAttribute('pattern', "\d{2}-\d{2}-\d{4}")

    const formBtnContainer = document.createElement('div');
    formBtnContainer.id = 'form-btn-container';
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.className = 'add-btn';

    addBtn.addEventListener('click', function() {
      const [year, month, day] = dateTextBox.value.split('-');
      const timeNow = new Date(Date.now());
      const taskDate = new Date(year, month - 1, day, timeNow.getHours(), timeNow.getMinutes(), timeNow.getSeconds(), timeNow.getMilliseconds());
      
      const newTask = new Task(titleTextBox.value, detailsTextBox.value, taskDate);
      const taskName = document.getElementById('task-type-container').firstElementChild.textContent;
      const currentProject = getProjectByName(taskName);
      currentProject.addTask(newTask);
      
      const taskListContainer = document.getElementById('task-list-container');

      taskListContainer.appendChild(createTask(newTask, newTask.getTaskId));
      
      const addTaskForm = document.getElementById('task-form-container');
      addTaskForm.remove();
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'cancel-btn';
    
    cancelBtn.addEventListener('click', function() {
      const taskFormContainer = document.getElementById('task-form-container');
      taskFormContainer.remove();
    })

    formBtnContainer.appendChild(addBtn)
    formBtnContainer.appendChild(cancelBtn);

    if (taskContainer.children.item(1).id !== 'task-form-container') {
      taskForm.appendChild(titleLabel);
      taskForm.appendChild(titleTextBox);
      taskForm.appendChild(detailsLabel);
      taskForm.appendChild(detailsTextBox);
      taskForm.appendChild(dateLabel);
      taskForm.appendChild(dateTextBox);
      
      taskFormContainer.appendChild(taskForm);
      taskFormContainer.appendChild(formBtnContainer);
      taskContainer.lastChild.before(taskFormContainer);
    } else {
      const taskFormContainerExisting = document.getElementById('task-form-container');
      setTimeout(() => {
        taskFormContainerExisting.style.border = '2px solid #43b0f1'
      }, 100);
      taskFormContainerExisting.style.border = '2px solid white'
    }
  })

  return addTaskBtn;
}

function createTaskListContainer() {
  const taskListContainer = document.createElement('div');
  taskListContainer.id = 'task-list-container';
  taskListContainer.className = 'task-list-container';
  taskListContainer.name = 'task-list-container';

  return taskListContainer;
}

function taskCompletedStyles(taskObj, taskNum) {
  const titleText = document.getElementById(`task-title-${taskNum}`);
  const detailsText = document.getElementById(`task-details-${taskNum}`);
  const dateText = document.getElementById(`task-date-${taskNum}`);
  const taskCompleteBtn = document.getElementById(`task-complete-btn-${taskNum}`);

  if (taskObj.isTaskCompleted) {
    taskCompleteBtn.style.backgroundColor = 'green';
    titleText.style.color = 'lightgray';
    detailsText.style.color = 'lightgray';
    dateText.style.color = 'lightgray';

    titleText.style.textDecoration = 'line-through';
    detailsText.style.textDecoration = 'line-through';
    dateText.style.textDecoration = 'line-through';

    titleText.style.transition = 'all 0.2s linear';
    detailsText.style.transition = 'all 0.2s linear';
    dateText.style.transition = 'all 0.2s linear';
  } else {
    taskCompleteBtn.style.backgroundColor = 'rgba(255, 255, 255, 0)';

    titleText.style.textDecoration = 'none';
    detailsText.style.textDecoration = 'none';
    dateText.style.textDecoration = 'none';

    titleText.style.color = 'white';
    detailsText.style.color = 'white';
    dateText.style.color = 'white';
  }
}

function createTask(taskObj, taskNum) {
  const taskContainer = document.createElement('div');
  const taskBtnContainer = document.createElement('div');
  const taskCompleteBtn = document.createElement('input');
  const titleDetailsContainer = document.createElement('div');
  const taskTitle = document.createElement('h2');
  const taskDetails = document.createElement('h3');
  const taskDate = document.createElement('p');
  
  taskDate.id = `task-date-${taskNum}`;
  taskTitle.id = `task-title-${taskNum}`;
  taskDetails.id = `task-details-${taskNum}`;
  taskContainer.id = `task-item-container-${taskNum}`;
  taskContainer.className = 'task-item-container';
  taskTitle.textContent = taskObj.getTaskTitle;
  taskDetails.textContent = taskObj.getTaskDetails;
  taskDate.textContent = `${taskObj.getTaskDate.toDateString()}, ${taskObj.getTaskDate.toLocaleTimeString()}`;
  taskDate.style.whiteSpace = 'normal';
  taskDate.style.width = '50%';
  taskDate.style.textAlign = 'end';

  taskCompleteBtn.type = 'radio';
  taskCompleteBtn.id = `task-complete-btn-${taskNum}`;
  taskBtnContainer.id = `task-complete-btn-container-${taskNum}`;
  taskBtnContainer.className = 'task-complete-btn-container';

  taskCompleteBtn.addEventListener('click', function() {
    taskObj.setTaskCompleted = !taskObj.isTaskCompleted;
    taskCompletedStyles(taskObj, taskNum);
  });

  taskBtnContainer.appendChild(taskCompleteBtn); 
  titleDetailsContainer.appendChild(taskTitle);
  titleDetailsContainer.appendChild(taskDetails);
  taskBtnContainer.appendChild(titleDetailsContainer);
  
  taskContainer.appendChild(taskBtnContainer);
  taskContainer.appendChild(taskDate);
  
  return taskContainer;
}

function updateProjectsList() {
  const newProjectContainer = document.getElementById('new-project-container');
  const projectList = document.createElement('ul');
  projectList.className = 'projects-list';
  projectList.id = 'projects-list';
  const projectListContainer = document.getElementById('project-list-container');
  let allProjects = getAllProjects();

  allProjects.forEach((project, projectNumber) => {
    const listItem = document.createElement('li');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '⋮';
    deleteBtn.id = `edit-project-${projectNumber}`;
  
    function createEditOptions() {
      const editOptionsContainer = document.createElement('div');
      editOptionsContainer.className = 'edit-options-container';
      editOptionsContainer.id = 'edit-options-container';
      const renameBtn = document.createElement('button');
      const deleteBtn = document.createElement('button');

      renameBtn.textContent = 'Rename';
      deleteBtn.textContent = 'Delete';

      deleteBtn.addEventListener('click', function() {
        let projectToDelete = document.getElementById('edit-options-container').nextSibling;
        Project.deleteProject(Number(projectToDelete.id.slice(-1)));
        projectToDelete.remove();

        document.getElementById('edit-options-container').remove();

        document.getElementById('all-tasks-sidebar').click();
      });

      renameBtn.addEventListener('click', function() {
        const projectToRename = document.getElementById('edit-options-container').nextSibling;
        const projectNum = Number(projectToRename.id.slice(-1));

        const newInputTextbox = document.createElement('input');
        newInputTextbox.placeholder = projectToRename.textContent.slice(0, -1);
        newInputTextbox.className = 'edit-project-textbox';
        projectToRename.textContent = '';
        document.getElementById('edit-options-container').remove();
        projectToRename.prepend(newInputTextbox);

        const btnsContainer = document.createElement('div');
        const renameConfirmBtn = document.createElement('button');
        renameConfirmBtn.textContent = 'Rename';
        const cancelRenameBtn = document.createElement('button');
        cancelRenameBtn.textContent = 'Cancel';
        btnsContainer.appendChild(renameConfirmBtn);
        btnsContainer.appendChild(cancelRenameBtn);

        btnsContainer.style.fontSize = '.75em';
        btnsContainer.style.marginTop = '.5em';

        renameConfirmBtn.id = 'rename-confirm-btn';
        renameConfirmBtn.className = 'edit-project-btns';
        
        cancelRenameBtn.id = 'rename-cancel-btn';
        cancelRenameBtn.className = 'edit-project-btns';

        cancelRenameBtn.addEventListener('click', function() {
          updateProjectsList();
        });

        renameConfirmBtn.addEventListener('click', function() {
          const projectObj = getProjectById(Number(projectToRename.id.slice(-1)));
          const newProjectName = renameConfirmBtn.parentElement.previousSibling.value;
          projectObj.renameProject = newProjectName;
          updateProjectsList();

          const projectIdListItem = projectToRename.id;
          setTimeout(() => document.getElementById(projectIdListItem).click(), 1)           
        })

        projectToRename.style.flexDirection = 'column';
        projectToRename.appendChild(btnsContainer);
      })

      editOptionsContainer.style.display = 'flex';
      editOptionsContainer.style.flexDirection = 'column';
      editOptionsContainer.setAttribute('name', 'edit-options-container');

      editOptionsContainer.appendChild(renameBtn)
      editOptionsContainer.appendChild(deleteBtn);

      return editOptionsContainer
    }

    deleteBtn.addEventListener('click', function (e) {
      let editOptionsContainer = document.getElementById('edit-options-container');
      const ulProjectList = document.getElementById('projects-list');

      if (projectList.contains(editOptionsContainer)) {
        ulProjectList.children.namedItem('edit-options-container').remove()
      } else if (!projectList.contains(editOptionsContainer)) {
        editOptionsContainer = createEditOptions();
        deleteBtn.parentElement.before(editOptionsContainer);
      } else {
        try {
          if (editOptionsContainer.style.display === 'none') {
            editOptionsContainer.style.display = 'flex';
          } else {
            editOptionsContainer.style.display = 'none';
          }
        } catch  {
          return 
        }
      }
    });

    listItem.id = `project-${projectNumber}`;
    listItem.className = 'project';
    listItem.textContent = project.name;
    listItem.appendChild(deleteBtn);

    listItem.addEventListener('click', function() {
      const taskContainer = document.getElementById('task-type-container');
      taskContainer.firstElementChild.textContent = listItem.firstElementChild.placeholder ?? listItem.textContent.slice(0, -1);
      createTaskContainer();
      
      const ProjectTaskContainer = document.getElementById('tasks');
      
      let projectName = listItem.firstElementChild.placeholder || listItem.textContent.slice(0, -1);
      const currentProject = getProjectByName(projectName);

      let taskListContainer;

      if (!ProjectTaskContainer.children.namedItem('task-list-container')) {
        taskListContainer = createTaskListContainer();
      } else {
        taskListContainer = document.getElementById('task-list-container');
        clearTaskListContainer();
      }

      try {
        currentProject.getAllTasks.forEach((task) => {
          taskListContainer.appendChild(createTask(task, task.getTaskId));
          taskCompletedStyles(task, task.getTaskId);
        });
      } catch (e) {
        return e
      }
      
      ProjectTaskContainer.firstElementChild.after(taskListContainer);
    })

    function clearTaskListContainer() {
      const taskListContainer = document.getElementById('task-list-container');

      while(taskListContainer.firstChild) {
        taskListContainer.removeChild(taskListContainer.firstChild);
      }
    }
  
    function createTaskContainer() {
      const tasksContainer = document.getElementById('tasks');

      if (tasksContainer.lastChild.id !== 'task-list') {
        const tasks = document.createElement('div');
        tasks.id = 'task-list';
        tasks.className = 'task-list';
        
        tasks.appendChild(createAddTaskBtn());
        tasksContainer.appendChild(tasks);
      }      
    }

    projectList.appendChild(listItem);
  });

  clearProjectList()
  projectListContainer.prepend(projectList);

  try {
    newProjectContainer.remove();
  } catch (e) {
    return e
  }
}

function clearProjectList() {
  const projectListContainer = document.getElementById('project-list-container');
  while (projectListContainer.firstChild.id !== 'project-list') {
    projectListContainer.removeChild(projectListContainer.firstChild);
  }
}



