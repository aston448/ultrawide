
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

describe('UC 123 - Select Design Component', function(){

    before(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    after(function(){

    });

    beforeEach(function(){

        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

    });

    afterEach(function(){

    });


    // Actions
    it('An Application may be selected', function(){

        DesignComponentActions.designerSelectApplication('Application1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.APPLICATION, 'NONE', 'Application1'));
    });

    it('A Design Section may be selected', function(){

        DesignComponentActions.designerSelectDesignSection('Application1', 'Section1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
    });

    it('A Feature may be selected', function() {

        DesignComponentActions.designerSelectFeature('Section1', 'Feature1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('A Feature Aspect may be selected', function(){

        DesignComponentActions.designerSelectFeatureAspect('Feature1', 'Actions');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('A Scenario may be selected', function(){

        DesignComponentActions.designerSelectScenario('Feature1', 'Actions', 'Scenario1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });


    // Consequences
    it('When a Design Component that is not a Feature Aspect is selected its detail text is shown');

    it('When a Feature is selected its Feature Background Steps are shown');

    it('When a Scenario is selected its Scenario Steps are shown');

    it('When a Design Component is selected it becomes the current component in the user context');

});
