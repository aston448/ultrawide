
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { UserContextVerifications }     from '../../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, ComponentType} from '../../../imports/constants/constants.js'

describe('UC 123 - Select Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 123 - Select Design Component');
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
    it('An Application may be selected', function(){

        DesignComponentActions.designerSelectsApplication('Application1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.APPLICATION, 'NONE', 'Application1'));
    });

    it('A Design Section may be selected', function(){

        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
    });

    it('A Feature may be selected', function() {

        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('A Feature Aspect may be selected', function(){

        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Actions');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('A Scenario may be selected', function(){

        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });


    // Consequences
    it('When a Design Component that is not a Feature Aspect is selected its detail text is shown');

    it('When a Feature is selected its Feature Background Steps are shown');

    it('When a Scenario is selected its Scenario Steps are shown');

    it('When a Design Component is selected it becomes the current component in the user context');

});
