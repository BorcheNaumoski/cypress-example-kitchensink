import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;

  // Main input for creating new todos
  readonly input: Locator;

  // All todo list rows
  readonly todoItems: Locator;

  // Footer counter text ("X items left")
  readonly itemsLeft: Locator;

  // Toggle checkboxes for marking todos completed
  readonly toggleCheckboxes: Locator;

  // Inline edit input fields (visible only in edit mode)
  readonly editInputs: Locator;

  // Delete (destroy) buttons — visible on hover
  readonly deleteButtons: Locator;

  // Filter links
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;

  // Clear completed button
  readonly clearCompletedButton: Locator;


  constructor(page: Page) {
    this.page = page;

    // Use placeholder attribute — stable selector
    this.input = page.locator('input[placeholder="What needs to be done?"]');

    // Each todo row
    this.todoItems = page.locator('.todo-list li');

    // Items left counter container
    this.itemsLeft = page.locator('.todo-count');

    // Toggle checkbox inside each row
    this.toggleCheckboxes = page.locator('.todo-list li .toggle');

    // Edit input inside each row (only visible during editing)
    this.editInputs = page.locator('.todo-list li .edit');

    // Delete buttons inside each row (shown on hover)
    this.deleteButtons = page.locator('.todo-list li .destroy');

    // Footer filters
    this.filterAll = page.locator('a[href="#/"]');
    this.filterActive = page.locator('a[href="#/active"]');
    this.filterCompleted = page.locator('a[href="#/completed"]');

    // Clear completed button
    this.clearCompletedButton = page.locator('.clear-completed');
  }

  // Opens the Todo application page
  async open() {
    await this.page.goto('/todo');
  }

  // Adds a single todo using input + Enter
  async addTodo(text: string) {
    await this.input.fill(text);
    await this.input.press('Enter');
  }

  // Returns current number of todo rows
  async getTodoCount() {
    return await this.todoItems.count();
  }

  // Adds multiple todos sequentially
  async addMultiple(todos: string[]) {
    for (const text of todos) {
      await this.addTodo(text);
    }
  }

  // Press Enter without entering text (used for empty-todo scenario)
  async pressEnterOnEmptyInput() {
    await this.input.press('Enter');
  }

  // Marks todo completed/uncompleted by index
  async toggleTodo(index: number) {
    await this.toggleCheckboxes.nth(index).check();
  }

  // Returns class attribute of row (used to verify "completed" state)
  async isTodoCompleted(index: number) {
    return this.todoItems.nth(index).getAttribute('class');
  }

  // Edits todo text by double-clicking label → typing → Enter
  async editTodo(index: number, newText: string) {
    const row = this.todoItems.nth(index);
    const label = row.locator('label');

    await label.dblclick();

    const input = row.locator('.edit');
    await input.waitFor({ state: 'visible' });

    await input.fill(newText);
    await input.press('Enter');
  }

  // Enters edit mode but does not confirm change
  async startEdit(index: number) {
    const row = this.todoItems.nth(index);
    await row.locator('label').dblclick();
    await row.locator('.edit').waitFor({ state: 'visible' });
  }

  // Cancels edit using Escape key
  async cancelEdit(index: number) {
    const row = this.todoItems.nth(index);
    await row.locator('.edit').press('Escape');
  }

  // Deletes todo by hovering row and clicking destroy button
  async deleteTodo(index: number) {
    const item = this.todoItems.nth(index);
    await item.hover(); // required — button appears only on hover
    await this.deleteButtons.nth(index).click();
  }

  // Filter: show all todos
  async showAll() {
    await this.filterAll.click();
  }

  // Filter: show active todos
  async showActive() {
    await this.filterActive.click();
  }

  // Filter: show completed todos
  async showCompleted() {
    await this.filterCompleted.click();
  }

  // Removes all completed todos
  async clearCompleted() {
    await this.clearCompletedButton.click();
  }
}
