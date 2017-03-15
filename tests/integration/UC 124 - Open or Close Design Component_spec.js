
import TestFixtures                 from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import UpdateComponentVerifications from '../../test_framework/test_wrappers/design_update_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 124 - Open or Close Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 124 - Open or Close Design Component');
        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    after(function(){

    });

    beforeEach(function(){
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
    });

    afterEach(function(){

    });


    // Actions
    it('A closed Design Component may be opened');

    it('An open Design Component may be closed');


    // Consequences
    it('Opening a Feature opens all Design Components in that Feature', function(){

        // Setup
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');

        // Execute and Verify
        const expectedOpenComponents = [
            {
                componentType:  ComponentType.FEATURE,
                parentName:     'Section1',
                componentName:  'Feature1'
            },
            {
                componentType:  ComponentType.FEATURE_ASPECT,
                parentName:     'Feature1',
                componentName:  'Interface'
            },
            {
                componentType:  ComponentType.FEATURE_ASPECT,
                parentName:     'Feature1',
                componentName:  'Actions'
            },
            {
                componentType:  ComponentType.FEATURE_ASPECT,
                parentName:     'Feature1',
                componentName:  'Conditions'
            },
            {
                componentType:  ComponentType.FEATURE_ASPECT,
                parentName:     'Feature1',
                componentName:  'Consequences'
            },
        ];

        DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);
    });

});
