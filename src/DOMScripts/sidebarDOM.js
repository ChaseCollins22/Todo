import '/src/styles/sidebarStyles.css';
import { Project, addNewProject, getAllProjects, getProjectByName } from '../projects';
import Task from '../tasks';


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


  [allTasks, todayTasks, weekTasks].forEach((taskType) => {
    const taskContainer = document.getElementById('task-type-container');
    taskType.addEventListener('click', function() {
      taskContainer.firstElementChild.textContent = taskType.textContent;
    })
  });
  
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

function updateProjectsList() {
  const newProjectContainer = document.getElementById('new-project-container');
  const projectList = document.createElement('ul');
  projectList.className = 'projects-list';
  const projectListContainer = document.getElementById('project-list-container');
  let allProjects = getAllProjects();

  allProjects.forEach((project, projectNumber) => {
    const listItem = document.createElement('li');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '⋮';

    function createEditOptions() {
      const editOptionsContainer = document.createElement('div');
      editOptionsContainer.className = 'edit-options-container';
      editOptionsContainer.id = 'edit-options-container';
      const renameBtn = document.createElement('button');
      const deleteBtn = document.createElement('button');

      renameBtn.textContent = 'Rename';
      deleteBtn.textContent = 'Delete';

      editOptionsContainer.style.display = 'flex';
      editOptionsContainer.style.flexDirection = 'column';

      editOptionsContainer.appendChild(renameBtn)
      editOptionsContainer.appendChild(deleteBtn);
      projectList.prepend(editOptionsContainer)
    }

    deleteBtn.addEventListener('click', function () {
      let editOptionsContainer = document.getElementById('edit-options-container');
      if (!projectList.contains(editOptionsContainer)) {
        createEditOptions();
      }
      try {
        if (editOptionsContainer.style.display === 'none') {
          editOptionsContainer.style.display = 'flex';
        } else {
          editOptionsContainer.style.display = 'none';
        }
      } catch  {
        return 
      }
      
    });

    listItem.id = `project-${projectNumber}`;
    listItem.className = 'project';
    listItem.textContent = project.name;
    listItem.appendChild(deleteBtn);

    listItem.addEventListener('click', function() {
      const taskContainer = document.getElementById('task-type-container');
      taskContainer.firstElementChild.textContent = listItem.textContent.slice(0, -1);
      createTaskContainer();
    })

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

        const formBtnContainer = document.createElement('div');
        formBtnContainer.id = 'form-btn-container';
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.className = 'add-btn';

        addBtn.addEventListener('click', function() {
          const newTask = new Task(titleTextBox.value, detailsTextBox.value, dateTextBox.value);
          const taskName = document.getElementById('task-type-container').firstElementChild.textContent;
          const currentProject = getProjectByName(taskName);
          currentProject.addTask(newTask);

          const test = document.getElementById('tasks');
          let taskListContainer;

          if (!test.children.namedItem('task-list-container')) {
            taskListContainer = createTaskListContainer();
          } else {
            taskListContainer = document.getElementById('task-list-container');
            clearTaskListContainer();
          }

          currentProject.getAllTasks.forEach((task, taskIdx) => {
            taskListContainer.appendChild(createTask(task, taskIdx));
          });
          
          const projectContainer = document.getElementById('tasks');
          projectContainer.firstElementChild.after(taskListContainer);
          
          const addTaskForm = document.getElementById('task-form-container');
          addTaskForm.remove();
        });
        
        function createTaskListContainer() {
          const taskListContainer = document.createElement('div');
          taskListContainer.id = 'task-list-container';
          taskListContainer.className = 'task-list-container';
          taskListContainer.name = 'task-list-container';

          return taskListContainer;
        }

        function createTask(taskObj, taskNum) {
          const taskContainer = document.createElement('div');
          const taskBtnContainer = document.createElement('div');
          const taskCompleteBtn = document.createElement('input');
          const titleDetailsContainer = document.createElement('div');
          const taskTitle = document.createElement('h2');
          const taskDetails = document.createElement('h3');
          const taskDate = document.createElement('p');
          
          taskDate.id = 'task-date';
          taskContainer.id = `task-item-container-${taskNum}`;
          taskContainer.className = 'task-item-container';
          taskTitle.textContent = taskObj.getTaskTitle;
          taskDetails.textContent = taskObj.getTaskDetails;
          taskDate.textContent = taskObj.getTaskDate;
          taskCompleteBtn.type = 'radio';
          taskBtnContainer.id = `task-complete-btn-container-${taskNum}`;
          taskBtnContainer.className = 'task-complete-btn-container';

          taskCompleteBtn.addEventListener('click', function() {
            console.log(taskCompleteBtn.parentElement.parentElement)
            const titleText = document.querySelector('h2');
            const detailsText = document.querySelector('h3');
            const dateText = document.getElementById('task-date');

            if (taskCompleteBtn.style.backgroundColor === 'green') {
              taskCompleteBtn.style.backgroundColor = 'rgba(255, 255, 255, 0)';

              titleText.style.textDecoration = 'none';
              detailsText.style.textDecoration = 'none';
              dateText.style.textDecoration = 'none';

              titleText.style.color = 'white';
              detailsText.style.color = 'white';
              dateText.style.color = 'white';
            } else {
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
              
            }
          })

          taskBtnContainer.appendChild(taskCompleteBtn); 
          titleDetailsContainer.appendChild(taskTitle);
          titleDetailsContainer.appendChild(taskDetails);
          taskBtnContainer.appendChild(titleDetailsContainer);

          taskContainer.appendChild(taskBtnContainer);
          taskContainer.appendChild(taskDate);

          return taskContainer;
        }

        function clearTaskListContainer() {
          const taskListContainer = document.getElementById('task-list-container');

          while(taskListContainer.firstChild) {
            taskListContainer.removeChild(taskListContainer.firstChild);
          }
        }

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

    function createTaskContainer() {
      const tasksContainer = document.getElementById('tasks');

      if (tasksContainer.lastChild.id !== 'task-list') {
        const tasks = document.createElement('div');
        tasks.id = 'task-list';
        tasks.className = 'task-list';
        console.log(tasksContainer.lastChild)
        
        tasks.appendChild(createAddTaskBtn());
        tasksContainer.appendChild(tasks);
      }      
    }

    projectList.appendChild(listItem);
  });

  clearProjectList()
  projectListContainer.prepend(projectList);
  newProjectContainer.remove();
}

function clearProjectList() {
  const projectListContainer = document.getElementById('project-list-container');
  while (projectListContainer.firstChild.id !== 'project-list') {
    projectListContainer.removeChild(projectListContainer.firstChild);
  }
}



