import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';

describe('UC 822 - Backup Design', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 822 - Backup Design');
        TestFixtures.clearAllData();
        TestFixtures.clearBackupFiles();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });

    // Actions
    it('Any user can back up the current version of a Design', function(){

        // Just check that user can back up the design without errors
        DesignActions.designerWorksOnDesign('Design1');
        DesignActions.designerBacksUpDesign('Design1');

        // For some reason if you try to do this more than once it refuses to call even the framework function
        // Haven't managed to work out why...
    });

});
