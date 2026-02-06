import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

  test('Delete a todo item', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given a todo item "Buy a pack of beer" exists
  await todo.input.fill('Buy a pack of beer');
  await todo.input.press('Enter');

  const beforeCount = await todo.todoItems.count();
  const index = beforeCount - 1;
  const row = todo.todoItems.nth(index);

  // When the user deletes the todo item
  await row.hover();
  await row.locator('.destroy').click();

  // Then the todo item should be removed from the list
  await expect(todo.todoItems).toHaveCount(beforeCount - 1);
  await expect(todo.todoItems).not.toContainText(['Buy a pack of beer']);
});

test('Delete a completed todo', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given a completed todo item exists
  await todo.addTodo('Completed task');
  const count = await todo.todoItems.count();
  await todo.toggleTodo(count - 1);

  // When the user deletes the completed todo item
  await page.locator('.filters').getByText('Completed').click();
  await page.locator('.clear-completed').click();

  // Then the todo item should be removed from the list
  await page.locator('.filters').getByText('All').click();
  await expect(todo.todoItems).toHaveCount(count - 1);
});