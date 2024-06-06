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
const templateCompletedElement = document
.querySelector<HTMLTemplateElement>('#template-completed')
?.content.querySelector<HTMLLIElement>('.task');
const todos: Todo[] = loadTodos('todos');
const completedTodos: Todo[] = loadTodos('completedTodos');

console.log(todos);

function handleSubmit(e: Event): void {
  e.preventDefault();

  if (inputElement && todoListElement && templateElement) {
    const data: Todo = {
      id: uuidv4(),
      name: inputElement?.value,
      completed: false,
      date: new Date(),
    };

    renderTodo(data, todoListElement, templateElement);
    todos.push(data);
    saveTodos(todos, 'todos');
  }

  formElement?.reset();
  if (submitButtonElement) submitButtonElement.disabled = true;
}

function createTodo(data: Todo, template: HTMLLIElement): HTMLLIElement | null {
  const todoEleemnt: HTMLLIElement | null = template?.cloneNode(
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
      if (data.completed === true) {
        deleteTodo(data, completedTodos, 'completedTodos');
      } else if (data.completed === false) {
        deleteTodo(data, todos, 'todos');
      }
    });
  }

  if (completeButtonElement) {
    completeButtonElement.addEventListener('click', () => {
      handleCompletedTodo(data);
      const todoItem = deleteButtonElement?.closest('.task');
      data.completed = true;
      completedTodos.push(data);
      todoItem?.remove();
      saveTodos(completedTodos, 'completedTodos');
    });
  }

  return todoEleemnt;
}

function deleteTodo(
  { id }: Todo,
  localStorageArr: Todo[],
  localStorageKey: string,
): void {
  const index = localStorageArr.findIndex((t) => t.id === id);
  console.log(index);
  if (index > -1) {
    localStorageArr.splice(index, 1);
    saveTodos(localStorageArr, localStorageKey);
  }
}

function handleCompletedTodo(data: Todo) {
  deleteTodo(data, todos, 'todos');
  if (completedTodoListElement && templateCompletedElement) {
    renderTodo(data, completedTodoListElement, templateCompletedElement);
  }
}

function renderTodo(data: Todo, container: HTMLUListElement, template: HTMLLIElement) {
  const todoElement = createTodo(data, template);

  if (todoElement) {
    container.append(todoElement);
  }
}

function saveTodos(todos: Todo[], key: string): void {
  localStorage.setItem(key, JSON.stringify(todos));
}

function loadTodos(key: string): Todo[] {
  const todosJson = localStorage.getItem(key);

  if (todosJson) {
    return JSON.parse(todosJson) as Todo[];
  }

  return [];
}

if (todoListElement && templateElement) {
  document.addEventListener('DOMContentLoaded', () => {
    todos.forEach((todo) => renderTodo(todo, todoListElement, templateElement));
  });
}

if (completedTodoListElement && templateCompletedElement) {
  document.addEventListener('DOMContentLoaded', () => {
    completedTodos.forEach((completedTodos) =>
      renderTodo(completedTodos, completedTodoListElement, templateCompletedElement),
    );
  });
}

formElement?.addEventListener('submit', handleSubmit);
inputElement?.addEventListener('input', () => {
  if (submitButtonElement) {
    submitButtonElement.disabled = inputElement.value.trim() === '';
  }
});
