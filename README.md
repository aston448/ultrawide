# ULTRAWIDE # 

## Synopsis ## 

Ultrawide is a tool designed to help those involved in software development take functional control of their project. It records what is wanted from a project and links this functional picture to the actual testable code so that an accurate view of what is complete and what is pending emerges. This view is accessable across the whole development team.

The main philosophies of ultrawide are: 
  * Record only what is necessary to understand what we are trying to do 
  * As little restriction as possible on _how_ things are done

Therefore, if used carefully, Ultrawide could be the only repository of functional, management and progress information you need but it does not tell you how you have to code and test.

To use Ultrawide well you need to have two disciplines only:

1. The functionality you want to create must be clearly and unambiguously defined.  (But why would you want it otherwise?)
2. You should have a test framework that can be tagged with clear functional labels.

#### Why 'Ultrawide'? ####
  * Ultrawide reaches across the whole development team: Manager, Designer, Developer, Tester.  It is their shared source of knowledge.
  * The bigger and wider a monitor you use with it the more you will get out of it!  It is a big picture that also zooms down to the smallest details.


## Status Note ##
This is the first release of Ultrawide.  It is fully working as far as it has been implemented and has been successfully used to design and build itself!  However it still has a few rough edges and there are a lot of additional features planned for future releases.

It runs on a Meteor server and is currently only fully tested to be accessed via the Chrome browser.  Some problems have been seen with Firefox.

To be used with a range of test outputs, additional modules will need to be written though this is a relatively trivial task if the tests have a machine readable output.

## Deploying Ultrawide ##

Ultrawide runs on a Meteor server.  Must be v1.4 or higher.  In a project situation this should be on a Unix / Linux server.

For trial use it could be installed and run on a development machine (e.g. MacOS) and served via the local host.

Ultrawide has primarily a web GUI interface but there is also a REST API by which the transfer of test results data to Ultrawide can be automated.

Once a server for Ultrawide has been commissioned, you will need to build the Ultrawide project from code and deploy it.  The easiest way to deploy is to use Meteor Up.  The mup.js configuration file should contain the following:

```javascript
module.exports = {
  servers: {
    one: {
      // This is the Ultrawide server you have commissioned
      host: '<IP or hostname>',
      username: '<your ultrawide account user>',  // A user on the server authorised to run Ultrawide
      // The following may be needed depending on how you set up secure access
      // pem: '~/.ssh/id_rsa'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'ultrawide',
    path: '<path to your ultrawide code project you are deploying from>',

    // This is important.  It is the main ultrawide data store.  You must specify a location accessible on your server.
    // Your backups and test files will be located beneath this directory
    volumes: {
    	"<absolute server path>": "/ultrawide_data"
    },

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://app.com',
      MONGO_URL: 'mongodb://localhost/meteor',
      ULTRAWIDE_DATA_STORE: '/ultrawide_data/'   // Important: this tells Ultrawide where its data store is
    },

    docker: {
      image: 'abernix/meteord:base',
      // imagePort: 80, // (default: 80, some images EXPOSE different ports)
    },

    // This is the maximum time in seconds it will wait
    // for your app to start
    // Add 30 seconds if the server has 512mb of ram
    // And 30 more if you have binary npm dependencies.
    deployCheckWaitTime: 60,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: false
  },

  mongo: {
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
```
See the Meteor Up documentation for more details on using Meteor Up.

## Using Ultrawide ##

### Users ###
Ultrawide initially has no data and one admin user.  Log in as user 'admin' with password 'admin123'.
You can now (as admin):
  * change the admin password
  * create other users as needed

A user (apart from admin) is someone who can use your Ultrawide installation.  The user can one or more of 3 roles:
 * Designer - creates the functional design for your project and manages changes to the design.
 * Developer - implements the design as code and links automated tests to Ultrawide
 * Manager - organises the design functionality into work packages
   
An important principle that applies across Ultrawide is that you can decide either to be strict and controlling or free and easy.  Somewhere in the middle that is appropriate for your work needs is probably best.  For example you could use it as a one person developer.  Assign yourself all three roles and use them to create the minimum structure you feel is necessary to keep your project under control and manageable.  On a big project with a large team you may want to be strict and only allow functional changes to be made by a specific Designer with other users being able to see what's needed but not change the specification.  Its up to you.  This will become clearer as you read on.

For this guide we will assume one user with all roles to keep things simple.

 * Create a new user
 * Edit the user.  The user name you give is their login. The display name is their full name.  For example: username 'john', display name 'John Smith'.  Tick the roles you want the user to have.
 * Save the user. The user password defaults to username123 (i.e. john123 in this case). The user can set their own password after logging in.
 
### Designs ###
 * Log in as a user with the Designer role.  You will see the roles menu with choices for the roles that user has.
 * Click 'Choose Working Design' for the Designer role.  You will now see the (empty) Designs list.
 * Click Add Design
 * Select the new Design to see its full details.  Give it a name by editing the name field (blue icon to the right)
 
This Design is the functional definition of your development project.  Or will be once you have created it.  The detail of the design can be created before or after your code is written.  It can be a full specification before you start coding or retrospectively applied to existing code to bring it under control.  Or it can be a bit of both, iteratively updated.  Its up to you.
 
#### Design Versions ####
When you create a new Design you also create an initial Design Version.  A Design Version represents a significant iteration of your project - e.g. a major release.  The initial design version is special in that you have total freedom to edit and change it in any way you like.  You should probably stay on the initial version until the functionality of your project is fairly well nailed down and implemented and any changes are of the formally planned and managed type.  Subsequent Design Versions can only be modified by defining Design Updates that formally document the changes you are making to your project functionality. More on those later.

For the initial Design Version the aim is to lay out the features of the Application (or Applications) you have decided are necessary to develop.  To do this you have an editor with a number of tools.

 * Click on 'Work on this Design' for your new Design
 * Select the initial Design Version that has been created by default
 * Edit the Name and Version fields as required

You will notice that your design has a status of 'New'.  This means it can be edited by a Designer but not seen by other users.  As a Designer you can Publish it at any time so that other users can see it.  You can also Withdraw it again if desired. 
 
 * Click on the Edit button to start editing the Design Version.  If there is no edit button, are you using the Designer role?
 
On the left you have the Design Version editor.  What appears on the right depends on what you tick in the View menu.  The following sections show how a Design is constructed:

#### Domain Dictionary ####
The Domain Dictionary is a place where you can define special terms that have particular meaning for your project.  These terms will then be highlighted in your functional design so people can look them up and see exactly what they mean.  It also helps you to maintain a consistent set of unambiguous terms.  Display the Domain Dictionary by selecting it in the View menu.  You can then add new terms and definitions to it.
Tip: It is a good idea to distinguish your domain terms by capitalising them.  The highlighting is case sensitive.  So defining the term 'Design' will highlight 'Design' (and also 'Designs') in the editor but not 'design'.  This gives you a bit more control over what appears as a domain term.
If you want to use Domain terms it is probably best to define them early on so you can use them as you write the Design.

#### Organisational Design Components ####
The editor allows you to create 3 types of organisational design components:
 * Application - use this to define your major applications.  There may be just one.
 * Design Section - use these to break up your design into logical sections - as you would in a normal functional specification.  Sections can be nested but must be inside an Application.
 * Feature Aspect - use these to help organise the aspects of your Features - see below.
 
In the editor you will see first the ability to add a new Application.  Once this is done you will see an option to add a Design Section to the application... and so on.

#### Functional Design Components #####
These are the core of Ultrawide and of two types:
 * Feature - definition of a capability or use case for your application.  For example: 'Add new user'.
 * Scenario - testable definition of a functional aspect of a Feature
 
The Scenario is the atomic part of Ultrawide.  To get the best from Ultrawide it should clearly state one testable thing that your application will do.  It should only say **what** and never **how**.  

Testable means that the Scenario can be verified by one high level test (e.g. an integration or acceptance test).  However it does **not** mean you need a 1:1 between scenarios and unit tests.  Ultrawide will allow you to link as many unit tests to a sigle Scenario as you like.

By default, Ultrawide splits a Feature into four Feature Aspects.  You can change add or remove these as required.  But they do help you think about an efficient and comprehensive design:
 * Interface - Defines the interface objects that a user can manipulate for the Feature.  Should say what they are, not how they work.  For example: 'There is an option to add a new user' and not 'The New User button can be clicked to add a new user'.
 * Actions - The core happy path actions of your Feature.  These are the Scenarios that MUST work as a minimum.  For example: 'The administrator can add a new user'
 * Conditions - The core functional limitations to your Feature.  Important business rules.  For example: 'A non-administrator user cannot add a new user'
 * Consequences - These scenarios (if any) should cover knock on actions from an action in the Feature that are not covered by any other Feature in the Design.  For example: 'When a new user is added the default password is xxxxx'.  Use consequences sparingly. Don't add consequences that are actually other features in your application or you will find unnecessary duplications creeping in.
 
Of course you can add more Feature Aspects or remove unwanted aspects as necessary.

#### Editing ####
Each section of your design has the options of what can be added to it at the bottom - e.g. a Feature Aspect has 'Add Scenario'  A Design Section has add Design Section or Add Feature.
On the right are options to edit delete or move design items.  When you create a new item the first thing to do is edit it.  Items can be moved to different sections or have their order rearranged within a section.  Only items with no children can be deleted so delete unwanted stuff from the bottom up.  Changes are automatically saved.

The following illustrates a simple Feature added to your design.  The Domain Dictionary pane is visible.

![Design Update](./images/InitialDesignVersion.png?raw=true)

A cleaner view can be obtained by switching to View Only (eye icon at top of editor) to remove all editing controls.

#### Details ####
Each Feature has a BDD style Narrative you can edit to give a clear summary of what the intention of the Feature is.  It summarises:
 * who uses the feature
 * their goal
 * and why they want it

Use this to give a high level understanding of what the feature is for.

Each design component (except Feature Aspects) has a Details pane (can be displayed / hidden in View menu).  Here you can write detailed notes that apply the the section, Feature or Scenario in question to give examples or functional notes.

![Design Update](./images/DesignComponentDetails.png?raw=true)

### Work Packages ###
Once you have some or all of your initial design version defined you can divide it up into one or more Work Packages to dole out the implementation work.  You can decide how best to do this.  Could be one big work package for everything or individual work packages down to the granularity of a Senario.  A Scenario cannot appear in more than one Work Package.

Create Work Packages as the Manager role.  Either go to the Roles screen and go to the current design version as Manager or, after refreshing the work summary, click the blue design icon beside the design version to switch to manager role.

When the current design version is selected you see a list or work packages (empty to start) and you can add new work packages to it.

 * Click Add Work Package
 * Select the new work package
 * Edit its name as required
 * Edit the Work Package with the Edit button
 
 On the left is the current design version and on the right the work package content.
 
 Check the section, feature etc. you want to add to the Work Package.  This adds everything beneath that section.  You can remove things by unchecking them.

 ![Design Update](./images/WorkPackageEdit.png?raw=true)

 When done, go back to the home screen and publish the Work Package.  Its now available to all users.
 
 Refreshing the work progress will now show the new Work Package(s)

 In this case the Manager created two Work Packages, one for the Interface code and one for the rest.  The Scenarios not checkable the scope in the above editor view are so because they are in the other work package.

 ![Design Update](./images/InitialVersionSummary.png?raw=true)
 
### Implement Work Packages ###
As the Developer role, (either via roles screen or red work package icon in progress summary) select a Work Package (WP).

 * Click Adopt - this WP is now yours until you or a manager user releases it
 * Click Develop - the WP editor opens

The WP editor shows the part of the design in the WP on the left.  On the right you can display Details, Dictionary, Unit Tests, Acceptance Tests.  You can also overlay a Test Summary on the Design

 ![Design Update](./images/DevelopWorkpackage_NoTests.png?raw=true)

You would now go away and code the features required for your part of the design. It doesn't matter how you do this.  The only things you need to do to integrate your code with Ultrawide are:
 
 * Write Unit and/or Integration tests that relate to the Scenarios in the Design
 * Tag those tests with the Scenario
 
Exactly how you do this depends on the type of tests you use.  You will need to choose the appropriate test runner plugin (see Test Outputs for more details).  As an example for mocha-type tests:
Say that your Scenario is 'A Super User can add an Application User' then an integration test might look like:

```javascript
describe('Add New User', function(){
    it('A Super User can add an Application User', function(){
        // Acceptance test code here
    });
}); 
```

or for 'An Application User cannot add an Application User' a unit test might look like:

```javascript
describe('AddUser', function(){`
   describe('An Application User cannot add an Application User', function(){`
        // Add unit tests to these...
        it('cannot be added by user with Designer role');
        it('cannot be added by user with Manager role');
        it('cannot be added by user with Developer role');
    });
}); 
```

In both cases, Ultrawide, once supplied with the output of these tests, will link them to the appropriate Scenario in the Design so the first will have one integration test and the second 3 unit tests.  There is nothing to stop you having both acceptance tests and unit tests for a Scenario.  There is no limit to the number of unit tests per Scenario and they can be in different places if required.  But there can be only one integration test per Scenario.

Once the tests are run and the data uploaded to Ultrawide the Unit / Integration test panes and the test summary will show the results against the Design.  And the work progress summary will start counting passing and failing tests.

### Test Outputs ###

**NOTE:**  Acceptance Tests are not currently implemented as a separate category in Ultrawide.  Use Integration tests to cover these.

In order for Ultrawide to be able to process your test results the following needs to be in place:

 * A test location created in Ultrawide.  This is where the results should be uploaded to.
 * Test location files defined for the location that say what files are expected and what their contents are.
 * Appropriate test runner plugins for Ultrawide.  These may have to be added to the code base.
 * Machine readable output from your test run.  For example a JSON file.
 * Manual or automatic upload of test outputs to the Ultrawide server.
 
#### Test Output Locations and Files ####

These may be configured in the Ultrawide Configuration screen (Go To menu or from Roles screen).  You are defining a location on the Ultrawide server where a particular set of test files will be placed.
Add a new location and edit it to set its path.  If shared, everyone can use it.  If not only the creating user can use it.
When setting the path you do not need to specify a full path.  The path you set will be within the default test output path on the server which is shown in the interface.  So your path may be just an additional directory.

For each location a set of files can be defined.  Here you set:

 * Alias - friendly name for file
 * Name - exact actual file name
 * Type - Integration or Unit Tests
 * Runner - The test runner that should process the file
 
In the My Test Locations tab you can see all locations available to you.  You can choose from these where you want your instance of Ultrawide to get Integration and Unit test results.  It will then pick up results from any files defined for those locations.  Each user has their own test data so it is possible for different users to view different test outputs against the same design.

#### Uploading Test Data ####
When you have run tests on, say, your build server and output the results to a file that file needs to be uploaded to the Ultrawide server.  You can do this manually if the build server is a local machine by going to the test location in Ultrawide and uploading the file to it.  When you do this the defined location file will have a status of uploaded and the upload date/time.  For a more formal set up the best option is to use the REST API to upload the file.  See the API section for more details.

Once new test data has been uploaded to Ultrawide, refreshing the test data in the GUI (Refresh menu) will update the results displayed against the Design.

### Summary Information ###
#### Test Summary ####
A Test Summary can be overlaid on the Design in many Ultrawide views.  The allows the user to see immediately which Features and Scenarios are passing, failing or untested.  The test summary is shown or hidden from the View menu.  For example a user may view the current Design Version and overlay a test summary.  Zooming to Feature level will show any Features with failing tests as highlighted in red.  The user can then drill down and see which Scenarios are failing and, by displaying the test panes, the failing tests and the failure reasons.
This gives an at a glance view of the overall health and test coverage of the application and allows rapid pinpointing of the problem areas.

Example Test Summary for one Feature:


 ![Design Update](./images/TestSummary.png?raw=true)

#### Progress Summary ####
On the Design Version home screen there is a progress summary that shows the number of Scenarios in the Design and how they have been broken down into Work Packages.  For each the number of passing / failing / untested Scenarios is shown.  It also shows where Scenarios are or are not in a Work Package.

### Design Updates ###

When you decide that you want to close the initial Design Version you do this by clicking Create Next as Designer on the Design Version.  This is a big step.  Once you go past here all changes to the Design are controlled.  So stay free until you are sure you want to explicitly record all changes from now on.

Once you have created a new Updatable Design Version and named it appropriately you need, as Designer, to add Design Updates to it in order to make changes.

 * Click Add Design Update from the bottom of the (empty) Design Updates list
 * Select the Update.  Give it a name and a reference.  The reference could be a change number or defect ticket number.
 * Edit the update.  On the left you have the current base design.  In the centre the editor.  On the right you can display various views of information.
 * The update editor works as per the design editor for the initial version but you must first scope the items you want to update.
 
#### Adding a New Design Item ####
To add, say, a new Feature to your design:

 * Scope the Design Section to which the Feature is to be added by checking it in the scope (left) pane.  It wil now appear in the editor pane.
 * Use the normal Add Feature control in the editor pane.
 * Default Feature Aspects are also added.
 * Edit the new Feature and add Scenarios to it as required.

 The Feature will not appear on the left as this is the baseline view.  However, it will appear in its new place the Working Design pane if the Design Update is published and set to be included in the current Design Version.  It will be marked as an added item (green plus icon)
 New Design Items added can be reordered in their current lists.  Peer items are shown as placeholders so that a new item can be ordered as desired.  New design items can be deleted completely if they were added by mistake.
 
#### Modifying an Existing Design Item ####
 To modify the wording of a Scenario:

 * Check the Scenario in the Scope
 * Edit the Scenario in the editor

 In the Working View (and in Details view) you will see both the old and the new versions of the Scenario.  It will be marked as a modified item.

#### Removing an Existing Design Item ####
To remove a Feature from your design:

 * Add the Feature to scope.
 * Delete the Feature in the editor.

This will mark the Feature and everything below it as deleted.  It will still be visible but marked as deleted.  You can restore any item deleted by mistake using the back icon now by the deleted item.

#### Limitations ####
The Update editor will not let you make changes that do not make sense, for example:

 * Changing a Scenario that is changed in another Update
 * Removing an item that has new items added to it or changes made in it
 * Restoring a removed item whose parent is removed - have to restore everything removed

#### Update Summary ####
As an update is created the update summary - visible as a pane in the editor or on the home screen - builds to show what is Added, Removed and Modified in the update creating a functional summary of the change so that you can confirm the change contains all the required details.

#### Update Status ####
If an update is New, only a Designer can see it.  Once published, everyone can see it and the designer can set whether it is included in the current Design version or not.  If it is, viewing the current design version will show this update as changes to the baseline version.

An update can also be set to Include, Roll Forward or Ignore:

 * Include - the update is merged into the current Design Version
 * Roll forward - the update is not included in the current Design Version but is preserved as an update when you move to the next Design Version
 * Ignore - the update is not included and will be abandoned when moving to the next Design Version

#### Update Work Packages ####
In the same way that the initial design version was able to be divided into work packages by the Manager role, each Design Update can also be assigned to one or more work packages.
The maximum scope of the work package is the scope of the design update.  At least one work package must be created to cover the update.

The design update list shows the work package status and test status for each update:

![Design Update](./images/DesignUpdateStatus.png?raw=true)

 * Work Package Status - grey: not all Scenarios covered by WP; black: all Scenarios covered
 * Test status: grey: no tests; pale green: some passing; dark green: all passing; red: one or more failing

## REST API ##


## Contributors ##
## License ##
