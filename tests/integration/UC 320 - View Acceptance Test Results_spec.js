describe('UC 320 - View Acceptance Test Results', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('A list of Features and their acceptance test status is shown for an Application selected in a Work Package');

    it('A list of Features and their acceptance test status is shown for a Design Section selected in a Work Package');

    it('A list of Scenarios and their acceptance test status is shown for a Feature selected in a Work Package');

    it('A list of Scenario Steps and their acceptance test status is shown for a Scenario selected in a Work Package');

    it('Features are grouped by their Design Sections');

    it('Scenarios are grouped by their Features and Feature Aspects');

    it('Scenario Steps are grouped as Design Only, Linked and Development Only');


    // Actions
    it('Feature acceptance test status may be viewed for all Features in a Work Package Application');

    it('Feature acceptance test status may be viewed for all Features in a Work Package Design Section');

    it('Scenario acceptance test status may be viewed for all Scenarios in a Work Package Feature');

    it('Scenario acceptance test status may be viewed for all Scenarios in a Work Package Feature Aspect');

    it('Scenario Steps acceptance test status may be viewed for all Scenario Steps in a Work Package Scenario');


    // Conditions
    it('A Feature acceptance test status is Not Implemented of no test file exists for it');

    it('A Feature acceptance test status is Failed if any Scenario tests in the Feature have failed');

    it('A Feature acceptance test status is Pending if any Scenario test in the Feature is pending and none is failed');

    it('A Feature acceptance test status is Passed if all Scenario tests in the Feature are passed');

    it('A Scenario acceptance test status is Not Implemented if no test file exists for its Feature');

    it('A Scenario acceptance test status is Not Implemented if a Feature test file exists but does not contain the Scenario');

    it('A Scenario acceptance test status is Failed if any Scenario Steps for the Scenario have failed');

    it('A Scenario acceptance test status is Pending if the Scenario test is pending');

    it('A Scenario acceptance test status is Passed if all Scenario Steps for the Scenario are passing');

    it('A Scenario acceptance test status is Not Designed if the Scenario is in the Feature test file but not in the Design');

    it('A Scenario Step acceptance test status is Not Implemented if no test file exists for its Feature');

    it('A Scenario Step acceptance test status is Not Implemented if a Feature test file exists but does not contain the Scenario');

    it('A Scenario Step acceptance test status is Not Implemented if a Feature test file exists with the Scenario but without the Scenario Step');

    it('A Scenario Step acceptance test status is Failed if the Scenario Step is tested and failing');

    it('A Scenario Step acceptance test status is Pending if the Scenario Step is tested and pending');

    it('A Scenario Step acceptance test status is Passed if the Scenario Step is tested and passing');

    it('A Scenario Step acceptance test status is Not Designed if the Feature test Scenario exists for the Feature in the Design but the Scenario Step does not');

});
