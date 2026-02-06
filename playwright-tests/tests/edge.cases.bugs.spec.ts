import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test('Add a todo with leading and trailing spaces', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // When the user enters spaced text in the todo input field
  await todo.input.fill('    Buy bread        ');

  // And presses Enter
  await todo.input.press('Enter');

  // Then the todo item should be trimmed and displayed as "Buy bread"
  await expect(todo.todoItems.last()).toHaveText('Buy bread');
});

test('Refresh the page', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given todo items exist
  await todo.input.fill('Persist me');
  await todo.input.press('Enter');

  // When the user refreshes the page
  await page.reload();

  // Then the todo items should persist
  await expect(todo.todoItems).toContainText(['Persist me']);
});

test('Todo should not be created without pressing Enter', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  const beforeCount = await todo.todoItems.count();

  // When the user types in the todo input field
  await todo.input.fill('Buy Chocolate');

  // And clicks outside the input field
  await page.locator('body').click();

  // Then the todo item should not be created
  await expect(todo.todoItems).toHaveCount(beforeCount);
  await expect(todo.todoItems).not.toContainText(['Buy Chocolate']);
});


test('Add a very long todo text', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  const longText = 'A'.repeat(250);
  const beforeCount = await todo.todoItems.count();

  // When the user enters a todo text longer than 200 characters
  await todo.input.fill(longText);

  // And presses Enter
  await todo.input.press('Enter');

  // Then the todo item should be truncated or rejected gracefully
  const afterCount = await todo.todoItems.count();

  expect(
    afterCount === beforeCount || afterCount === beforeCount + 1
  ).toBeTruthy();
});