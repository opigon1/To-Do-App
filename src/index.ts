import { v4 as uuidv4 } from 'uuid';

type Todo = {
  id: string;
  name: string;
  completed: boolean;
  date: Date;
};

const submitButtonElement =
  document.querySelector<HTMLButtonElement>('.button');
const inputElement = document.querySelector<HTMLInputElement>('.input');
const formElement = document.querySelector<HTMLFormElement>('.form');
const todoListElement = document.querySelector<HTMLUListElement>('.task-list');
const completedTodoListElement = document.querySelector<HTMLUListElement>(
  '.complited-section__list',
);
const templateElement = document
  .querySelector<HTMLTemplateElement>('#template')
  ?.content.querySelector<HTMLLIElement>('.task');

const todos: Todo[] = loadTodos();
console.log(todos);
function handleSubmit(e: Event): void {
  e.preventDefault();

  if (inputElement && todoListElement) {
    const data: Todo = {
      id: uuidv4(),
      name: inputElement?.value,
      completed: false,
      date: new Date(),
    };

    renderTodo(data, todoListElement);
    todos.push(data);
    saveTodos(todos);
  }

  formElement?.reset();
  if (submitButtonElement) submitButtonElement.disabled = true;
}

function createTodo(data: Todo): HTMLLIElement | null {
  const todoEleemnt: HTMLLIElement | null = templateElement?.cloneNode(
    true,
  ) as HTMLLIElement;
  const deleteButtonElement =
    todoEleemnt.querySelector<HTMLButtonElement>('.task__delete');
  const completeButtonElement =
    todoEleemnt.querySelector<HTMLButtonElement>('.task__complited');

  if (todoEleemnt) {
    const todoNameElement =
      todoEleemnt.querySelector<HTMLParagraphElement>('.task__name');

    if (todoNameElement) {
      todoNameElement.textContent = data.name;
    }
  }

  if (deleteButtonElement) {
    deleteButtonElement.addEventListener('click', () => {
      const todoItem = deleteButtonElement.closest('.task');
      todoItem?.remove();
      deleteTodo(data);
    });
  }

  if (completeButtonElement && completedTodoListElement) {
    completeButtonElement.addEventListener('click', () => {
      const todoItem = completeButtonElement.closest('.task');
      if (todoItem) {
        data.completed = true;
        renderTodo(data, completedTodoListElement);
        saveTodos(todos);
      }
    });
  }

  return todoEleemnt;
}

function deleteTodo({id}: Todo): void {
  const index = todos.findIndex((t) => t.id === id);
  if (index > -1) {
    todos.splice(index, 1);
    saveTodos(todos);
  }
}

function renderTodo(data: Todo, container: HTMLUListElement) {
  const todoElement = createTodo(data);

  if (todoElement) {
    container.append(todoElement);
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos(): Todo[] {
  const todosJson = localStorage.getItem('todos');

  if (todosJson) {
    return JSON.parse(todosJson) as Todo[];
  }

  return [];
}

if (todoListElement) {
  document.addEventListener('DOMContentLoaded', () => {
    todos.forEach((todo) => renderTodo(todo, todoListElement));
  });
}

formElement?.addEventListener('submit', handleSubmit);
inputElement?.addEventListener('input', () => {
  if (submitButtonElement) {
    submitButtonElement.disabled = inputElement.value.trim() === '';
  }
});
