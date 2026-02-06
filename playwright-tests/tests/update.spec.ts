import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

  test('Mark a todo as completed', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given a todo item "Change car oil" exists
  await todo.input.fill('Change car oil');
  await todo.input.press('Enter');

  const index = (await todo.todoItems.count()) - 1;
  const beforeCounter = await todo.itemsLeft.textContent();

  // When the user marks the todo item as completed
  await todo.toggleTodo(index);

  // Then the todo item should appear as completed
  await expect(todo.todoItems.nth(index)).toHaveClass(/completed/);

  // And the items left counter should be decreased by 1
  await expect(todo.itemsLeft).not.toHaveText(beforeCounter || '');
});

test('Edit an existing todo', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given a todo item "Practice guitar for one hour" exists
  await todo.input.fill('Practice guitar for one hour');
  await todo.input.press('Enter');

  const index = (await todo.todoItems.count()) - 1;
  const row = todo.todoItems.nth(index);

  // When the user edits the todo item to "Practice guitar for two hours"
  const label = row.locator('label');
  await label.dblclick();

  const editInput = row.locator('.edit');
  await editInput.waitFor();
  await editInput.fill('Practice guitar for two hours');
  await editInput.press('Enter');

  // Then the updated todo item should be displayed
  await expect(row).toHaveText('Practice guitar for two hours');
});


test('Cancel editing a todo', async ({ page }) => {
  const todo = new TodoPage(page);

  // Background: Given the user opens the Todo application
  await todo.open();

  // Given a todo item "Buy a pack of beer" exists
  await todo.input.fill('Buy a pack of beer');
  await todo.input.press('Enter');

  const index = (await todo.todoItems.count()) - 1;
  const row = todo.todoItems.nth(index);

  // When the user starts editing the todo item
  const label = row.locator('label');
  await label.dblclick();

  const editInput = row.locator('.edit');
  await editInput.waitFor();
  await editInput.click(); // ensure focus

  // And presses Escape
  await editInput.press('Escape');

  // Then the original todo item text should remain unchanged
  await expect(row).toHaveText('Buy a pack of beer');
});