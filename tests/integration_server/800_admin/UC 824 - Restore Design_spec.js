import TestFixtures                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import RestoreActions               from '../../../test_framework/test_wrappers/restore_actions.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';


// Default Data
//
//  Application1
//      Section1
//          Feature1
//              Interface
//              Actions
//                  Scenario1
//                  Scenario7
//                  ExtraScenario
//              Conditions
//                  Scenario2
//              Consequences
//              ExtraAspect
//          Feature444
//              Interface
//              Actions
//              Conditions
//              Consequences
//          SubSection1
//      Section2
//          Feature2
//              Interface
//              Actions
//                  Scenario3
//              Conditions
//                  Scenario4
//              Consequences
//          SubSection2
//  Application88
//  Application99
//      Section99
//          Feature99



describe('UC 824 - Restore Design', function(){

    before(function(){

        TestFixtures.logTestSuite('UC 824 - Restore Design');
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


    // Interface
    it('A live Design in the Designs administration list has an option to restore it to a previous backup version');

    it('An archived Design in the Designs administration list has an option to restore it');


    // Actions
    it('The admin user can restore a live Design to any previous backup version', function(){

        DesignActions.designerWorksOnDesign('Design1');
        DesignActions.designerBacksUpDesign('Design1');

        // Simulate losing all the data
        TestFixtures.clearAllDesignData();

        // Restore from backup
        RestoreActions.adminRestoresBackup();

        // Verify we have the expected default data
        expect(DesignVerifications.designExistsCalled('Design1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application88', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application99', 'Design1', 'DesignVersion1'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 'Application1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 'Application99'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection2', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection2', 'Design1', 'DesignVersion1', 'Section2'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 'Section2'));


    });

    it('The admin user can restore an archived Design to the backup taken when it was archived');

    it('The admin user can import a Design from a backup made in a different instance of Ultrawide');


    // Conditions
    it('Designer, Developer and Manager users cannot restore a Design');

});
