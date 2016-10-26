@test
Feature: UC 101 - Add New Design

  Background:
    Given a new instance of Ultrawide

  @test
  Scenario: A new Design can be added to Ultrawide by a Designer
    When I log in as a Designer
    And I add a new Design
    Then A new Design is added to the Designs list

  @ignore
  Scenario: An Add New Design item is present when no Designs exist at all
    And no Designs exist
    When the Designs screen is accessed
    Then no Designs are listed
    And it is possible to add a new Design

  @ignore
  Scenario: An Add New Design item is present at the end of the existing Designs list
    And there is an existing Design called "Existing"
    And the Designs screen is accessed
    Then the Designs list contains "Existing"
    And the "Add New Design" control is visible

  @ignore
  Scenario: When a new Design is added a new initial Design Version is created
    When a Manager creates a new Design
    Then a new Design Version is created for the new Design
    And the new Design Version may be edited by the Desiger

  @ignore
  Scenario: A new Design cannot be added by a Developer
    And I log in as a Developer
    When I navigate to the Designs screen
    Then the "Add New Design" control is not visible

  @ignore
  Scenario: A new Design cannot be added by a Manager
    And I log in as a Manager
    When I navigate to the Designs screen
    Then the "Add New Design" control is not visible

  @ignore
  Scenario: Some made up dev scenario
    And I log in as a Manager
    When I navigate to the Designs screen
    Then the "Add New Design" control is not visible

