import './style.css';
import utils from './modules/utils.js';
import { completed, unCompleted } from './modules/status.js';

const localData = utils.retrieve();
if (!localData) localStorage.setItem('todo', '[]');

const display = () => {
  const storeData = utils.retrieve();

  const list = document.getElementById('list');
  list.innerHTML = '';
  storeData.forEach((value) => {
    // Creating list of to-do
    const li = document.createElement('li');
    li.className = 'flex';
    li.innerHTML = `
    <input class="checkbox" type="checkbox" ${value.completed ? 'checked' : ''}>
    <input class="text" type="text" value="${value.description}"/> 
    <i class="fa-solid fa-ellipsis-vertical"></i>
    `;
    const removeButton = document.createElement('div');
    removeButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    removeButton.addEventListener('click', () => {
      utils.remove(value.id);
      display();
    });
    li.appendChild(removeButton);
    list.appendChild(li);
  });

  const span = document.querySelectorAll('.text');
  span.forEach((btn, index) => {
    btn.addEventListener('keyup', () => {
      const storeData = utils.retrieve();
      storeData[index].description = btn.value;
      utils.save(storeData);
    });
  });

  const checkbox = document.querySelectorAll('.checkbox');
  checkbox.forEach((btn, index) => {
    btn.addEventListener('change', () => {
      const storeData = utils.retrieve();
      if (btn.checked === true) {
        storeData[index].completed = completed(storeData);
      } else {
        storeData[index].completed = unCompleted(storeData);
      }
      utils.save(storeData);
    });
  });
};

const renderList = () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const storeData = utils.retrieve();
    const input = form.text.value;
    const completed = false;
    const id = storeData.length;

    utils.add(input, completed, id);
    display();
    form.text.value = '';
  });
};
renderList();
display();
const clear = () => {
  let store = utils.retrieve();
  store = store.filter((todo) => !todo.completed);
  const remains = utils.updateList(store);
  utils.save(remains);
};

const link = document.querySelector('a');
link.addEventListener('click', (e) => {
  e.preventDefault();
  clear();
  display();
});
