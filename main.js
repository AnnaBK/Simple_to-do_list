let tasks = [];
const taskInput = document.querySelector("#taskInput");
let addTaskButton = document.querySelector("#add-task-btn");
const startMessage = document.querySelector("#start-message");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener("click", addTaskHandler);
taskList.addEventListener("click", changeTaskState);

function addTaskHandler() {
  if (taskInput.value === "") return;
  if (!startMessage.hidden) startMessage.hidden = true;

  const newTask = {
    text: taskInput.value,
    date: new Date(),
    completed: false,
  };

  tasks.push(newTask);
  taskList.append(createTask(newTask));
  taskInput.value = "";
}

function createTask(task) {
  let li = document.createElement("li");
  li.classList.add("task");

  if (task.completed) {
    li.classList.add("completed");
  }

  let input = document.createElement("input");
  input.type = "checkbox";
  input.checked = task.completed;

  let p = document.createElement("p");
  p.textContent = task.text;

  let button = document.createElement("button");
  button.textContent = "Delete";
  button.style.marginLeft = "10px";

  button.addEventListener("click", function () {
    let siblings = this.parentElement.children;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].text === siblings[1].textContent) {
        tasks.splice(i, 1);
      }
    }
    this.parentElement.remove();
    if (taskList.children.length === 0) {
      startMessage.hidden = false;
    }
  });

  let data = document.createElement("span");
  data.textContent = task.date.toLocaleDateString("en-GB");
  data.style.marginLeft = "auto";

  li.append(input);
  li.append(p);
  li.append(data);
  li.append(button);

  return li;
}

function changeTaskState(e) {
  if (e.target.nodeName === "INPUT" && e.target.type === "checkbox") {
    const checkbox = e.target;
    let siblings = checkbox.parentElement.children;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].text === siblings[1].textContent) {
        tasks[i].completed = checkbox.checked;
        checkbox.parentElement.classList.toggle("completed");
      }
    }
    // const taskIndex = Array.from(taskList.children).indexOf(
    //   checkbox.parentElement
    // );
    // tasks[taskIndex].completed = checkbox.checked;
    // checkbox.parentElement.classList.toggle("completed");
  }
}

const filterByDate = document.querySelector("#filterByDate");
const filterByName = document.querySelector("#filterByName");
const filterByCompletion = document.querySelector("#filterByCompletion");

function applyFilters() {
  let filteredTasks = tasks.slice();

  if (filterByDate.value !== "all") {
    filteredTasks.sort((a, b) => {
      if (filterByDate.value === "ascending") {
        return a.date - b.date;
      } else {
        return b.date - a.date;
      }
    });
  }

  if (filterByName.value !== "all") {
    filteredTasks.sort((a, b) => {
      if (filterByName.value === "ascending") {
        return a.text.localeCompare(b.text);
      } else {
        return b.text.localeCompare(a.text);
      }
    });
  }

  if (filterByCompletion.value === "completed") {
    let tempArray = [];
    filteredTasks.filter((task) => {
      if (task.completed) {
        tempArray.push(task);
      }
    });
    if (tempArray.length === 0) {
      startMessage.hidden = false;
    }
    filteredTasks = tempArray;
  } else if (filterByCompletion.value === "notCompleted") {
    let tempArray = [];
    filteredTasks.filter((task) => {
      if (!task.completed) {
        tempArray.push(task);
      }
    });
    if (tempArray.length === 0) {
      startMessage.hidden = false;
    }
    filteredTasks = tempArray;
  }
  displaySortedTasks(filteredTasks);
}

filterByDate.addEventListener("change", applyFilters);
filterByName.addEventListener("change", applyFilters);
filterByCompletion.addEventListener("change", applyFilters);

function displaySortedTasks(tasksToDisplay) {
  taskList.innerHTML = "";
  if (tasksToDisplay.length !== 0) {
    startMessage.hidden = true;
  }
  tasksToDisplay.forEach((task) => {
    taskList.append(createTask(task));
  });
}
