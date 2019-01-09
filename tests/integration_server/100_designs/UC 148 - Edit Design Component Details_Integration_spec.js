
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { DesignComponentVerifications } from '../../../test_framework/test_wrappers/design_component_verifications.js';

import {DefaultDetailsText} from '../../../imports/constants/default_names.js';

describe('UC 148 - Edit Design Component Details', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 148 - Edit Design Component Details');
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


    describe('Actions', function(){

        it('A Designer can edit Design Component text and save changes', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
            DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
            expect(DesignComponentVerifications.designerSelectedComponentDetailsTextIs(DefaultDetailsText.NEW_SCENARIO_DETAILS));

            // Execute
            DesignComponentActions.designerEditsSelectedComponentTextTo('Description of Scenario1');

            // Verify
            expect(DesignComponentVerifications.designerSelectedComponentDetailsTextIs('Description of Scenario1'));
        });

    });
});
