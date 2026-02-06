import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test('View active todos', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given an active todo item "Active item" exists
  await todo.input.fill('Active item');
  await todo.input.press('Enter');

  // And a completed todo item "Completed item" exists
  await todo.input.fill('Completed item');
  await todo.input.press('Enter');

  const index = (await todo.todoItems.count()) - 1;
  await todo.todoItems.nth(index).locator('.toggle').click();

  // When the user selects the "Active" filter
  await page.locator('.filters').getByText('Active').click();

  // active item visible
  await expect(todo.todoItems).toContainText(['Active item']);

  // completed item not visible
  await expect(todo.todoItems).not.toContainText(['Completed item']);
});

test('View completed todos', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given both active and completed todo items exist

  // active item
  await todo.input.fill('Active item');
  await todo.input.press('Enter');

  // completed item
  await todo.input.fill('Completed item');
  await todo.input.press('Enter');

  const index = (await todo.todoItems.count()) - 1;
  await todo.todoItems.nth(index).locator('.toggle').click();

  // When the user selects the "Completed" filter
  await page.locator('.filters').getByText('Completed').click();

  // Then only completed todo items should be displayed
  const items = await todo.todoItems.all();

  for (const item of items) {
    await expect(item).toHaveClass(/completed/);
  }

  // completed item visible
  await expect(todo.todoItems).toContainText(['Completed item']);

  // active item not visible
  await expect(todo.todoItems).not.toContainText(['Active item']);
});

test('View all todos', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given multiple todo items exist
  await todo.input.fill('Active item');
  await todo.input.press('Enter');

  await todo.input.fill('Completed item');
  await todo.input.press('Enter');

  const index = (await todo.todoItems.count()) - 1;
  await todo.todoItems.nth(index).locator('.toggle').click();

  // When the user selects the "All" filter
  await page.locator('.filters').getByText('All').click();

  // Then all todo items should be displayed
  await expect(todo.todoItems).toContainText([
    'Active item',
    'Completed item'
  ]);
});