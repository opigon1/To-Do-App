import {v4 as uuidv4} from "../_snowpack/pkg/uuid.js";
const taskCounterCompleted = document.querySelector(".task__counter_type_completed");
const taskCounterInCompleted = document.querySelector(".task__counter_type_incompleted");
const submitButtonElement = document.querySelector(".button");
const inputElement = document.querySelector(".input");
const formElement = document.querySelector(".form");
const todoListElement = document.querySelector(".task-list_type_incompleted");
const completedTodoListElement = document.querySelector(".task-list_type_completed");
const templateElement = document.querySelector("#template")?.content.querySelector(".task");
const templateCompletedElement = document.querySelector("#template-completed")?.content.querySelector(".task");
const todos = loadTodos("todos");
const completedTodos = loadTodos("completedTodos");
function updateTaskCounter() {
  if (taskCounterInCompleted) {
    taskCounterInCompleted.textContent = `Незавершённые - ${todos.length}`;
  }
  if (taskCounterCompleted) {
    taskCounterCompleted.textContent = `Завершённые - ${completedTodos.length}`;
  }
}
updateTaskCounter();
function handleSubmit(e) {
  e.preventDefault();
  if (inputElement && todoListElement && templateElement) {
    const data = {
      id: uuidv4(),
      name: inputElement?.value,
      completed: false,
      date: new Date()
    };
    renderTodo(data, todoListElement, templateElement);
    todos.push(data);
    saveTodos(todos, "todos");
    updateTaskCounter();
  }
  formElement?.reset();
  if (submitButtonElement)
    submitButtonElement.disabled = true;
}
function createTodo(data, template) {
  const todoEleemnt = template?.cloneNode(true);
  const deleteButtonElement = todoEleemnt.querySelector(".task__delete");
  const completeButtonElement = todoEleemnt.querySelector(".task__complited");
  const editButtonElement = todoEleemnt.querySelector(".task__edit");
  console.log(editButtonElement);
  if (todoEleemnt) {
    const todoNameElement = todoEleemnt.querySelector(".task__name");
    if (todoNameElement) {
      todoNameElement.value = data.name;
    }
    if (deleteButtonElement) {
      deleteButtonElement.addEventListener("click", () => {
        const todoItem = deleteButtonElement.closest(".task");
        todoItem?.remove();
        if (data.completed === true) {
          deleteTodo(data, completedTodos, "completedTodos");
        } else if (data.completed === false) {
          deleteTodo(data, todos, "todos");
        }
      });
    }
    if (completeButtonElement) {
      completeButtonElement.addEventListener("click", () => {
        handleCompletedTodo(data);
        const todoItem = deleteButtonElement?.closest(".task");
        data.completed = true;
        completedTodos.push(data);
        todoItem?.remove();
        saveTodos(completedTodos, "completedTodos");
        updateTaskCounter();
      });
    }
    if (editButtonElement && todoNameElement) {
      editButtonElement.addEventListener("click", () => {
        if (editButtonElement.textContent === "Редактировать") {
          todoNameElement.disabled = false;
          editButtonElement.textContent = "Сохранить";
        } else if (editButtonElement.textContent === "Сохранить") {
          if (todoNameElement.value.trim() === "") {
            alert("Значение не может быть пустым!");
          } else {
            todoNameElement.disabled = true;
            data.name = todoNameElement.value;
            saveTodos(todos, "todos");
            editButtonElement.textContent = "Редактировать";
          }
        }
      });
    }
  }
  return todoEleemnt;
}
function deleteTodo({id}, localStorageArr, localStorageKey) {
  const index = localStorageArr.findIndex((t) => t.id === id);
  if (index > -1) {
    localStorageArr.splice(index, 1);
    saveTodos(localStorageArr, localStorageKey);
  }
  updateTaskCounter();
}
function handleCompletedTodo(data) {
  deleteTodo(data, todos, "todos");
  if (completedTodoListElement && templateCompletedElement) {
    renderTodo(data, completedTodoListElement, templateCompletedElement);
  }
}
function renderTodo(data, container, template) {
  const todoElement = createTodo(data, template);
  if (todoElement) {
    container.prepend(todoElement);
  }
}
function saveTodos(todos2, key) {
  localStorage.setItem(key, JSON.stringify(todos2));
}
function loadTodos(key) {
  const todosJson = localStorage.getItem(key);
  if (todosJson) {
    return JSON.parse(todosJson);
  }
  return [];
}
if (todoListElement && templateElement) {
  document.addEventListener("DOMContentLoaded", () => {
    todos.forEach((todo) => renderTodo(todo, todoListElement, templateElement));
  });
}
if (completedTodoListElement && templateCompletedElement) {
  document.addEventListener("DOMContentLoaded", () => {
    completedTodos.forEach((completedTodos2) => renderTodo(completedTodos2, completedTodoListElement, templateCompletedElement));
  });
}
formElement?.addEventListener("submit", handleSubmit);
inputElement?.addEventListener("input", () => {
  if (submitButtonElement) {
    submitButtonElement.disabled = inputElement.value.trim() === "";
  }
});
