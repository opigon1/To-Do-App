type Todo = {
  name: string;
  completed: boolean;
  date: Date;
};

const submitButtonElement =
  document.querySelector<HTMLButtonElement>('.button');
const inputElement = document.querySelector<HTMLInputElement>('.input');
const formElement = document.querySelector<HTMLFormElement>('.form');
const todoListElement = document.querySelector<HTMLUListElement>('.task-list');
const templateElement = document
  .querySelector<HTMLTemplateElement>('#template')
  ?.content.querySelector<HTMLLIElement>('.task');
console.log(templateElement);

function handleSubmit(e: Event): void {
  e.preventDefault();

  if (inputElement && todoListElement) {
    const data: Todo = {
      name: inputElement?.value,
      completed: false,
      date: new Date(),
    };

    renderTodo(data, todoListElement);
  }

  formElement?.reset();
}

function createTodo(data: Todo): HTMLLIElement | null {
  const todoEleemnt: HTMLLIElement | null = templateElement?.cloneNode(
    true,
  ) as HTMLLIElement;

  if (todoEleemnt) {
    const todoNameElement =
      todoEleemnt.querySelector<HTMLParagraphElement>('.task__name');

    if (todoNameElement) {
      todoNameElement.textContent = data.name;
    }
  }

  return todoEleemnt;
}

function renderTodo(data: Todo, container: HTMLUListElement) {
  const todoElement = createTodo(data);
  
  if (todoElement) {
    container.append(todoElement);
  }
}

formElement?.addEventListener('submit', handleSubmit);
