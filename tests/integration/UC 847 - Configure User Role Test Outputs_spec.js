describe('UC 847 - Configure User Role Test Outputs', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('The Test Output Location Configuration list shows all shared Test Output Locations');

    it('For a Developer the Test Output Location Configuration list shows private Test Output Locations created by that Developer');

    it('Each Test Output Location Configuration has an option to retrieve Unit tests');

    it('Each Test Output Location Configuration has an option to retrieve Integration tests');

    it('Each Test Output Location Configuration has an option to retrieve Acceptance tests');


    // Actions
    it('One or more test options may be selected for a Test Output Location Configuration');


    // Conditions
    it('The Test Output Location Configuration list does not show private Test Output Locations to Designers and Managers');

    it('The Test Output Location Configuration list does not show private Test Output Locations to Developers if they were not created by that Developer');


    // Consequences
    it('When a Test Output Location Configuration Unit test option is selected for a user Ultrawide will read all Unit test files at that location for the user');

    it('When a Test Output Location Configuration Integration test option is selected for a user Ultrawide will read all Integration test files at that location for the user');

    it('When a Test Output Location Configuration Acceptance test option is selected for a user Ultrawide will read all Acceptance test files at that location for the user');

});
