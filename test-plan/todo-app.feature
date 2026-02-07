Feature: Todo Management
  As a user
  I want to manage my tasks
  So that I can track what needs to be done

  Background:
    Given the user opens the Todo application

  # ------------------
  # CREATE TODO
  # ------------------

  Scenario: Add a new todo item
    When the user enters "Buy Fruit" in the todo input field
    And presses Enter
    Then the todo item "Buy Fruit" should appear in the list
    And the items left counter should be increased by 1

  Scenario: Add multiple todo items
    When the user adds the following todo items:
      | Change car oil               |
      | Practice guitar for one hour |
      | Buy a pack of beer           |
    Then all todo items should be displayed in the list

  Scenario: Attempt to add an empty todo
    When the user presses Enter without entering a task
    Then no new todo item should be added

  # ------------------
  # UPDATE TODO
  # ------------------

  Scenario: Mark a todo as completed
    Given a todo item "Change car oil" exists
    When the user marks the todo item as completed
    Then the todo item should appear as completed
    And the items left counter should be decreased by 1

  Scenario: Edit an existing todo
    Given a todo item "Practice guitar for one hour" exists
    When the user edits the todo item to "Practice guitar for two hours"
    Then the updated todo item "Practice guitar for two hours" should be displayed

  Scenario: Cancel editing a todo
    Given a todo item "Buy a pack of beer" exists
    When the user starts editing the todo item
    And presses Escape
    Then the original todo item text should remain unchanged

  # ------------------
  # DELETE TODO
  # ------------------

  Scenario: Delete a todo item
    Given a todo item "Buy a pack of beer" exists
    When the user deletes the todo item
    Then the todo item should be removed from the list

  Scenario: Delete a completed todo
    Given a completed todo item exists
    When the user deletes the completed todo item
    Then the todo item should be removed from the list

  # ------------------
  # FILTER TODO
  # ------------------

  Scenario: View active todos
    Given an active todo item "Active item" exists
    And a completed todo item "Completed item" exists
    When the user selects the "Active" filter
    Then only active todo items should be displayed

  Scenario: View completed todos
    Given both active and completed todo items exist
    When the user selects the "Completed" filter
    Then only completed todo items should be displayed

  Scenario: View all todos
    Given multiple todo items exist
    When the user selects the "All" filter
    Then all todo items should be displayed

  # ----------------------------
  # EDGE CASES / BUGS
  # ----------------------------

  Scenario: Add a todo with leading and trailing spaces
    When the user enters "    Buy bread        " in the todo input field
    And presses Enter
    Then the todo item should be trimmed and displayed as "Buy bread"

  Scenario: Refresh the page
    Given todo items exist
    When the user refreshes the page
    Then the todo items should persist

  Scenario: Todo should not be created without pressing Enter
    When the user types "Buy Chocolate" in the todo input field
    And clicks outside the input field
    Then the todo item "Buy Chocolate" should not be created

  Scenario: Add a very long todo text
    When the user enters a todo text longer than 200 characters
    And presses Enter
    Then the todo item should be truncated or rejected gracefully
