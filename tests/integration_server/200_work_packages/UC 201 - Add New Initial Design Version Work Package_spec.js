
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { WorkPackageActions }           from '../../../test_framework/test_wrappers/work_package_actions.js';
import { WorkPackageVerifications }     from '../../../test_framework/test_wrappers/work_package_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';

describe('UC 201 - Add New Initial Design Version Work Package', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 201 - Add New Initial Design Version Work Package');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    // Actions
    it('A Manager may add a new Work Package to an Initial Design Version', function() {

        // Setup
        // Designer Publish DesignVersion1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Manager select DesignVersion1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Execute - add WP as Manager
        WorkPackageActions.managerAddsBaseDesignWorkPackage();

        // Verify
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        expect(WorkPackageVerifications.workPackageExistsForManagerCalled(DefaultItemNames.NEW_WORK_PACKAGE_NAME));

    });

});
