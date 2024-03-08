const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");
let taskCount = 0;

const displayCount = (taskCount) => {
  countValue.innerText = taskCount;
};

const saveTasksToLocalStorage = () => {
  const tasks = [];
  const taskElements = document.querySelectorAll(".task");
  taskElements.forEach((taskElement) => {
    const taskName = taskElement.querySelector(".taskname").innerText;
    const isChecked = taskElement.querySelector(".task-check").checked;
    tasks.push({ name: taskName, checked: isChecked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);
    tasks.forEach((task) => {
      const taskHTML = `<div class="task">
        <input type="checkbox" class="task-check" ${task.checked ? "checked" : ""}/>
        <span class="taskname">${task.name}</span>
        <button class="edit">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`;
      tasksContainer.insertAdjacentHTML("beforeend", taskHTML);
    });

    taskCount = tasks.length;
    displayCount(taskCount);
    attachEventListeners();
  }
};

const attachEventListeners = () => {
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.onclick = () => {
      button.parentNode.remove();
      taskCount -= 1;
      displayCount(taskCount);
      saveTasksToLocalStorage();
    };
  });

  const editButtons = document.querySelectorAll(".edit");
  editButtons.forEach((editBtn) => {
    editBtn.onclick = (e) => {
      let targetElement = e.target;
      if (!(e.target.className == "edit")) {
        targetElement = e.target.parentElement;
      }
      newTaskInput.value = targetElement.previousElementSibling?.innerText;
      targetElement.parentNode.remove();
      taskCount -= 1;
      displayCount(taskCount);
      saveTasksToLocalStorage();
    };
  });

  const tasksCheck = document.querySelectorAll(".task-check");
  tasksCheck.forEach((checkBox) => {
    checkBox.onchange = () => {
      checkBox.nextElementSibling.classList.toggle("completed");
      if (checkBox.checked) {
        taskCount -= 1;
      } else {
        taskCount += 1;
      }
      displayCount(taskCount);
      saveTasksToLocalStorage();
    };
  });
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.style.display = "none";
  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }

  const task = `<div class="task">
    <input type="checkbox" class="task-check"/>
    <span class="taskname">${taskName}</span>
    <button class="edit">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button class="delete">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>`;

  tasksContainer.insertAdjacentHTML("beforeend", task);
  taskCount += 1;
  displayCount(taskCount);
  newTaskInput.value = "";
  saveTasksToLocalStorage();
  attachEventListeners();
};

addBtn.addEventListener("click", () => {
  addTask();
});

newTaskInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});
window.onload = () => {
  displayCount(taskCount);
  newTaskInput.value = "";
  loadTasksFromLocalStorage();
};
