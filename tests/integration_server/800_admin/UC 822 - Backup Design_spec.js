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

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Actions
    it('Any user can back up the current version of a Design', function(){

        // Just check that each role can back up the design without errors
        DesignActions.designerWorksOnDesign('Design1');
        DesignActions.designerBacksUpDesign('Design1');

        sleep(2000);

        DesignActions.developerWorksOnDesign('Design1');
        DesignActions.developerBacksUpDesign('Design1');

        sleep(2000);

        DesignActions.managerWorksOnDesign('Design1');
        DesignActions.managerBacksUpDesign('Design1');
    });

});
