import TestFixtures                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../../test_framework/test_wrappers/work_package_component_verifications.js';
import UpdateComponentVerifications from '../../../test_framework/test_wrappers/design_update_component_verifications.js';

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
