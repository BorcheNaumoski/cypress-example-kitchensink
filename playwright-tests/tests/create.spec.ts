import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test('Add a new todo item', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  const beforeCount = await todo.todoItems.count();
  const beforeCounter = await todo.itemsLeft.textContent();

  // When the user enters "Buy Fruit" in the todo input field
  await todo.input.fill('Buy Fruit');

  // And presses Enter
  await todo.input.press('Enter');

  // Then the todo item "Buy Fruit" should appear in the list
  await expect(todo.todoItems.last()).toHaveText('Buy Fruit');

  // And the items left counter should be increased by 1
  await expect(todo.todoItems).toHaveCount(beforeCount + 1);
  await expect(todo.itemsLeft).not.toHaveText(beforeCounter || '');
});

test('Add multiple todo items', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  const items = [
    'Change car oil',
    'Practice guitar for one hour',
    'Buy a pack of beer'
  ];

  // capture baseline
  const beforeCount = await todo.todoItems.count();
  const beforeCounter = await todo.itemsLeft.textContent();

  // When the user adds the following todo items
  for (const item of items) {
    await todo.input.fill(item);
    await todo.input.press('Enter');
  }

  // Then exact total count must equal X
  await expect(todo.todoItems).toHaveCount(beforeCount + items.length);

  // And order must be enforced (new items appended at end)
  for (let i = 0; i < items.length; i++) {
    await expect(todo.todoItems.nth(beforeCount + i))
      .toHaveText(items[i]);
  }

  // And counter must change
  await expect(todo.itemsLeft).not.toHaveText(beforeCounter || '');
});

test('Attempt to add an empty todo', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  const beforeCount = await todo.todoItems.count();

  // When the user presses Enter without entering a task
  await todo.input.press('Enter');

  // Then no new todo item should be added
  await expect(todo.todoItems).toHaveCount(beforeCount);
});

  

  


  

  






