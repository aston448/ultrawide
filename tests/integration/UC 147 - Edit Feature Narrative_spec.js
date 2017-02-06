
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 147 - Edit Feature Narrative', function(){

    before(function(){

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


    // Interface
    it('Each Feature has a default Narrative template', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Verify default Narrative template is there
        expect(DesignComponentVerifications.feature_NarrativeIs('Feature1', DefaultComponentNames.NEW_NARRATIVE_TEXT));

    });


    // Actions
    it('A Designer can edit and save a Feature Narrative', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        let oldNarrative = DefaultComponentNames.NEW_NARRATIVE_TEXT;
        let newNarrative = 'As a hen\nI want to peck\nSo that I can eat';
        // Check
        expect(DesignComponentVerifications.feature_NarrativeIs('Feature1', oldNarrative));

        // Execute
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        DesignComponentActions.designerEditsSelectedFeatureNarrativeTo(newNarrative);

        // Verify
        expect(DesignComponentVerifications.feature_NarrativeIs('Feature1', newNarrative));
    });


    // Consequences
    it('When a Narrative is updated in a base Design Version, any related Work Packages are updated', function(){

        // Setup
        // Publish DV1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Add 2 work packages
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');

        // Execute - Designer edits Feature1 Narrative
        let newNarrative = 'As a hen\nI want to peck\nSo that I can eat';
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        DesignComponentActions.designerEditsSelectedFeatureNarrativeTo(newNarrative);

        // Verify - New Narrative in both WPs
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        WpComponentActions.managerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(WpComponentVerifications.managerSelectedFeatureNarrativeIs(newNarrative));

        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
        WpComponentActions.managerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(WpComponentVerifications.managerSelectedFeatureNarrativeIs(newNarrative));
    });

});
